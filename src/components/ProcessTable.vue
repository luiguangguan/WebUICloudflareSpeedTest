<!-- <template>
    <el-table :data="[data]" style="width: 100%">
      <el-table-column label="延迟进度" prop="Delay.Current">
        <template #default="{ row }">
          <el-progress :percentage="(row.Delay.Current / row.Delay.Total) * 100" />
        </template>
      </el-table-column>
      <el-table-column label="下载进度" prop="Download.Current">
        <template #default="{ row }">
          <el-progress :percentage="(row.Download.Current / row.Download.Total) * 100" />
        </template>
      </el-table-column>
    </el-table>
  </template>
   -->
  <script>
  export default {
    props: ['data']
  };
  </script>
  
  <style scoped>
  .el-table {
    margin-top: 20px;
  }
  </style>
  