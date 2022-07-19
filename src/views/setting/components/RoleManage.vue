<template>
  <div>
    <el-button type="primary" size="mini">新增角色</el-button>
  </div>
</template>

<script>
import { getRoleList } from '@/api/setting'
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
      total: null
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
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
