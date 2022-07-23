<template>
  <div>
    <el-button
      type="primary"
      size="mini"
      @click="
        roleDialogVisible = true;
        isEdit = false;
        form = {};
      "
      >新增角色</el-button
    >
    <el-table :data="roleList" border>
      <el-table-column type="index" label="序号" width="50px"></el-table-column>
      <el-table-column
        label="角色名"
        prop="name"
        width="160px"
        sortable
      ></el-table-column>
      <el-table-column
        label="描述"
        prop="description"
        sortable
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button type="text" @click="showRightDialog(row.id)"
            >分配权限</el-button
          >
          <el-button type="text" @click="showRoleDialog(row)">修改</el-button>
          <el-button type="text" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row type="flex" justify="end">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="paramsObj.page"
        :page-size="paramsObj.pagesize"
        :page-sizes="[2, 4, 6, 8]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-row>
    <!--              分配权限弹出框 -->
    <el-dialog title="分配权限" :visible.sync="rightVisible" width="30%">
      <template #footer>
        <el-tree
          v-if="rightVisible"
          ref="myTree"
          :data="permissions"
          :props="{ label: 'name' }"
          default-expand-all
          show-checkbox
          node-key="id"
          :default-checked-keys="selectedPermissions"
        ></el-tree>
        <el-button type="primary" @click="save">确认</el-button>
        <el-button @click="rightVisible = false">取消</el-button>
      </template>
    </el-dialog>
    <!--              编辑新增弹出框 -->
    <el-dialog
      :title="isEdit ? '编辑' : '新增'"
      :visible.sync="roleDialogVisible"
      @close="reset"
    >
      <el-form ref="myForm" label-width="80px" :model="form" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name"> </el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description"> </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="onClick">确认</el-button>
        <el-button @click="roleDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, delRole, addRole, editRole } from '@/api/setting'
import { getPermissions, getPermissionsById, assignPermission } from '@/api/permission'
import { tranferListToTree } from '@/utils'
export default {
  filters: {},
  components: {},
  data () {
    return {
      paramsObj: {
        page: 1, // 默认拿第一页的数据
        pagesize: 4 // 每页的数量
      },
      roleList: [],
      total: null,
      // -------- 分配权限弹出层开关
      rightVisible: false,
      permissions: [],
      selectedPermissions: [],
      id: null,
      // -------- 新增和编辑弹出层开关
      roleDialogVisible: false,
      form: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      // false 是新增 true 是编辑
      isEdit: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const res = await getRoleList(this.paramsObj)
      // console.log(res)
      this.roleList = res.rows
      this.total = res.total // 用于做分页
    },
    handleSizeChange (pagesize) {
      this.paramsObj.pagesize = pagesize
      this.getRoleList()
    },
    handleCurrentChange (page) {
      this.paramsObj.page = page
      this.getRoleList()
    },
    // ------------ 删除
    del (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delRole(id)
        // 解决BUG 当删除最后一页最后一条不刷新
        // 删除最后一页最后一条 应该跑到上一页
        if (this.roleList.length === 1 && this.paramsObj.page > 1) {
          this.paramsObj.page--
        }
        this.getRoleList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // ------------ 弹出层
    async showRightDialog (id) {
      this.id = id
      // 所有的角色权限
      const res = await getPermissions()
      // console.log(res)
      this.permissions = tranferListToTree(res, '0')
      // 获取当前的权限
      const res1 = await getPermissionsById(id)
      this.selectedPermissions = res1.permIds
      // console.log(res1)
      this.rightVisible = true
    },
    async save () {
      // console.log(this.$refs.myTree.getCheckedKeys())
      // getCheckedKeys 只能获取到全选的东西
      // getHalfCheckedKeys  获取半选的东西
      const res = await assignPermission(this.id, this.$refs.myTree.getCheckedKeys())
      console.log(res)
      // 添加完关闭弹出层
      this.rightVisible = false
    },
    onClick () {
      // 二次校验
      this.$refs.myForm.validate(async bool => {
        if (!bool) return this.$message.error('表单格式不正确')
        if (this.isEdit) {
          await editRole(this.form)
        } else {
          // console.log('发送ajax')
          await addRole(this.form)
        }
        this.getRoleList()
        this.roleDialogVisible = false
      })
    },
    // ------------ 自定义关闭事件
    reset () {
      // 关闭后清除表单内容
      this.$refs.myForm.resetFields()
    },
    // ------------ 编辑
    showRoleDialog (row) {
      this.isEdit = true
      this.roleDialogVisible = true
      this.form = { ...row } // 浅拷贝
      // this.form = Object.assign({}, row)
    }
  }
}
</script>

<style scoped lang='scss'>
.el-table {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
