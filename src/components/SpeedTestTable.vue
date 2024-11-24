<template>
  <el-table :data="dataWithIPRemark" style="width: 100%">
    <el-table-column label="拼接" prop="ipRemark" sortable />
    <el-table-column label="IP" prop="IP" sortable />
    <el-table-column label="日期" prop="Date" sortable />
    <el-table-column label="端口" prop="Port" sortable />
    <el-table-column label="最大延迟 (ms)" prop="MaxDelay" sortable />
    <el-table-column label="最小延迟 (ms)" prop="MinDelay" sortable />
    <el-table-column label="最大下载速度" prop="MaxDownloadSpeed" sortable />
    <el-table-column label="最小下载速度" prop="MinDownloadSpeed" sortable />
    <el-table-column label="平均丢包率" prop="AVGLossRate" sortable />
    <el-table-column label="备注" prop="Remark" sortable />
  </el-table>
</template>

<script>
export default {
  props: ['data'],
  computed: {
    // 计算属性：将 IP 和 Remark 连接为 "IP # Remark" 格式
    dataWithIPRemark() {
      return this.data.map(item => ({
        ...item,  // 保持原有字段
        ipRemark: `${item.IP}#${item.Port}#${item.Remark}`  // 新增连接的列
      }));
    }
  }
};
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}
</style>
