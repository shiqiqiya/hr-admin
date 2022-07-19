<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card
        v-loading="isLoading"
        style="min-height: 700px"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-tabs>
          <el-tab-pane label="用户管理">
            <!-- 用了一个行列布局 -->
            <TreeItem
              :node="titleObj"
              @departments="getDepartmentsList"
            ></TreeItem>
            <!-- tree -->
            <el-tree :data="data" default-expand-all>
              <!-- 使用 scoped slot 会传入两个参数node和data，分别表示当前节点的 Node 对象和当前节点的数据 -->
              <template slot-scope="scope">
                <TreeItem
                  :node="scope.node"
                  @departments="getDepartmentsList"
                ></TreeItem>
              </template>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
import { getDepartmentsList } from '@/api/departments'
import TreeItem from './components/TreeItem.vue'
export default {
  filters: {},
  components: {
    TreeItem
  },
  data () {
    return {
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1'
        }]
      }],
      titleObj: {},
      isLoading: true
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getDepartmentsList()
  },
  methods: {
    // ----------- 获取组织列表
    async getDepartmentsList () {
      const res = await getDepartmentsList()
      console.log(res)
      // 数据不能直接使用 需要处理一下
      function tranferListToTree (list, pid) {
        const list1 = []
        list.forEach(item => {
          if (item.pid === pid) {
            list1.push(item)
            item.children = tranferListToTree(list, item.id)
          }
        })
        return list1
      }
      this.data = tranferListToTree(res.depts, '')
      this.titleObj = res.depts[0]
      this.isLoading = false
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep .el-tree-node {
  padding: 10px !important;
  span,
  div {
    font-size: 20px;
  }
}
::v-deep .el-tree-node__content {
  padding: 20px 0 !important;
}
</style>
