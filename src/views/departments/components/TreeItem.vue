<template>
  <div style="width: 100%">
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      style="height: 40px; padding: 30px 140px; font-size: 14px; width: 100%"
    >
      <el-col>
        <span>{{ node.data ? node.data.name : node.name }}</span>
      </el-col>
      <el-col :span="4">
        <el-row type="flex" justify="end">
          <!-- 两个内容 -->
          <el-col>{{ node.data ? node.data.manager : "负责人" }}</el-col>
          <el-col>
            <!-- 下拉菜单 element -->
            <el-dropdown @command="onCommand">
              <span> 操作<i class="el-icon-arrow-down" /> </span>
              <!-- 下拉菜单 -->
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">添加子部门</el-dropdown-item>
                <template v-if="node.data">
                  <el-dropdown-item command="b">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="c">删除部门</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!-- 添加弹框 -->

    <el-dialog
      :title="title"
      :visible.sync="addDialogVisible"
      width="50%"
      @click.native.stop
      @close="handleAddClose"
    >
      <el-form
        ref="addFormRef"
        label-width="100px"
        :model="addDepartmentForm"
        :rules="rules"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="addDepartmentForm.name"
            placeholder="1-50个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="addDepartmentForm.code"></el-input>
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <!-- <el-input v-model="addDepartmentForm.manager"></el-input> -->
          <el-select
            v-model="addDepartmentForm.manager"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.username"
              :value="item.username"
              filterable
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            v-model="addDepartmentForm.introduce"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>+

<script>
import { getSimpleUserList } from '@/api/user'
import { delDepartment, addDepartment, getDepartmentsList, editDepartment } from '@/api/departments'
export default {
  filters: {},
  components: {},
  props: {
    node: {
      type: Object,
      required: true

    }
  },
  data () {
    // 自定义校验规则
    const validateName = async (rule, value, callback) => {
      // 拿到所有的数据
      const res = await getDepartmentsList()
      if (this.isEdit) {
        // 标题不存在编辑
        const pid = this.node.data.pid // 把当前要编辑的部门父级的id找到了 然后根据pid 去找所有的兄弟元素
        res.depts.filter(item => item.pid === pid && item.id !== this.node.data.id).some(item => item.name === value) ? callback(new Error('部门名称重复')) : callback()
      } else {
        // 待筛选所有的子部门pid 的值
        const id = this.node.data ? this.node.data.id : ''
        res.depts.filter(item => item.pid === id).some(item => item.name === value) ? callback(new Error('部门名称重复')) : callback()
      }
    }
    return {
      addDialogVisible: false,
      addDepartmentForm: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门负责人
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3-10位之间', trigger: 'blur' },
          { validator: validateName, trigger: 'change' }
        ]
      },
      users: [],
      isEdit: false // 判断是在编辑还是在添加
    }
  },
  computed: {
    title () {
      return this.isEdit ? '编辑部门' : '新增部门'
    }
  },
  watch: {},
  created () { },
  methods: {
    async onCommand (key) {
      if (this.users.length === 0) {
        // 点开获取员工列表接口
        this.getSimpleUserList()
      }
      if (key === 'a') {
        this.isEdit = false
        // console.log('添加')
        this.addDialogVisible = true
      } else if (key === 'b') {
        this.isEdit = true
        this.addDialogVisible = true
        console.log('编辑')
        // 点开把数据重新赋值给编辑
        this.addDepartmentForm = { ...this.node.data }
      } else {
        try {
          await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          // console.log('用户确定了')
          await delDepartment(this.node.data.id)
          this.$emit('departments')
        } catch (err) {
          // console.log(err)
          this.$notify({
            message: '取消了删除',
            duration: 1000
          })
        }
      }
    },
    // ------------- 获取部门员工列表
    async getSimpleUserList () {
      const res = await getSimpleUserList()
      // console.log(res)
      this.users = res
    },
    handleAddClose () {
      this.$refs.addFormRef.resetFields() // 表单重置
    },
    // ----------- 添加部门
    async onSubmit () {
      if (this.isEdit) {
        // 删除里面的children 属性
        delete this.addDepartmentForm.children
        await editDepartment(this.addDepartmentForm)
      } else {
        this.addDepartmentForm.pid = this.node.data ? this.node.data.id : ''
        await addDepartment(this.addDepartmentForm)
        // console.log(res)
      }
      this.addDialogVisible = false
      // 确定完刷新
      this.$emit('departments')
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
