<template>
  <div>
    <!-- 按钮 - 复制拼接列 -->
    <el-button type="success" icon="el-icon-copy-document" @click="copyIpRemarkColumn" style="margin-bottom: 20px;">
      复制拼接列
    </el-button>

    <!-- 表格 -->
    <el-table :data="dataWithIPRemark" style="width: 100%" @selection-change="handleSelectionChange">
      <!-- 勾选框列 -->
      <el-table-column type="selection" width="55" />

      <!-- 数据列 -->
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
  </div>
</template>

<script>
export default {
  props: ['data'],
  data() {
    return {
      selectedRows: [], // 保存勾选的行
    };
  },
  computed: {
    // 计算属性：将 IP 和 Remark 连接为 "IP # Remark" 格式
    dataWithIPRemark() {
      return this.data.map(item => ({
        ...item,  // 保持原有字段
        ipRemark: `${item.IP}#${item.Port}#${item.Remark}`  // 新增连接的列
      }));
    }
  },
  methods: {
    // 处理勾选变化
    handleSelectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    },

    // 复制拼接列内容
    copyIpRemarkColumn() {
      // 获取勾选的行中 "拼接" 列的内容
      const content = this.selectedRows.map(row => row.ipRemark).join('\n');
      this.copyToClipboard(content);
    },

    // 复制内容到剪贴板
    copyToClipboard(content) {
      if (content != "") {
        const textarea = document.createElement('textarea');
        textarea.value = content;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.$message.success('已复制拼接列内容');
      }else{
        this.$message.error('似乎没有选择要复制的内容！！！？？');
      }
    }
  }
};
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}

/* 按钮样式 */
.el-button {
  margin-bottom: 20px;
}
</style>
