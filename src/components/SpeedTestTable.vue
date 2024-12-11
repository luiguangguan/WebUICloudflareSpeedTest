<template>
  <div>
    <!-- 按钮 - 复制拼接列 -->
    <el-button type="success" icon="el-icon-copy-document" @click="copyIpRemarkColumn" style="margin-bottom: 20px;">
      复制拼接列
    </el-button>

    <!-- 表格 -->
    <el-table :data="dataWithIPRemark" style="width: 100%" @selection-change="handleSelectionChange"
      :row-class-name="getRowClassName">
      <!-- 勾选框列 -->
      <el-table-column type="selection" width="55" />

      <!-- 数据列 -->
      <!-- <el-table-column label="拼接" prop="ipRemark" sortable /> -->
      <el-table-column label="拼接" prop="ipRemark" sortable>
        <template #default="{ row }">
          <span
            :style="{ fontWeight: hasMatchingIP(row.TraceInfo) ? 'bold' : 'normal', color: hasMatchingIP(row.TraceInfo) ? 'red' : 'inherit' }">
            {{ row.ipRemark }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="IP" prop="IP" sortable />
      <el-table-column label="日期" prop="Date" sortable />
      <el-table-column label="端口" prop="Port" sortable />
      <el-table-column label="最大延迟 (ms)" prop="MaxDelay" sortable />
      <el-table-column label="最小延迟 (ms)" prop="MinDelay" sortable />
      <el-table-column label="最大下载速度" prop="MaxDownloadSpeed" sortable />
      <el-table-column label="最小下载速度" prop="MinDownloadSpeed" sortable />
      <el-table-column label="平均下载速度" prop="AvgDownloadSpeed" sortable />
      <el-table-column label="平均丢包率" prop="AVGLossRate" sortable />
      <el-table-column label="测速次数" prop="Count" sortable />
      <el-table-column label="备注" prop="Remark" sortable />
      <el-table-column label="路由信息" prop="TraceInfo" sortable>
        <template #default="{ row }">
          <div v-if="row.showFullTrace">
            <div style="white-space: pre-wrap; word-break: break-word;">{{ row.TraceInfo }}</div>
            <el-button type="text" size="small" @click="row.showFullTrace = false">收起</el-button>
          </div>
          <div v-else>
            <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">
              {{ row.TraceInfo }}
            </div>
            <el-button type="text" size="small" @click="row.showFullTrace = true">展开</el-button>
          </div>
        </template>
      </el-table-column>
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
    },
    // 检查是否包含 59.43 开头的 IP
    hasMatchingIP(traceInfo) {
      const regex = /\b59\.43\.\d{1,3}\.\d{1,3}\b/;
      return regex.test(traceInfo);
    },
    // 高亮显示匹配的 IP
    highlightTraceInfo(traceInfo) {
      const regex = /\b59\.43\.\d{1,3}\.\d{1,3}\b/g;
      // 替换匹配的 IP 为带样式的 HTML
      return traceInfo.replace(
        regex,
        (match) => `<span style="color: red; font-weight: bold;">${match}</span>`
      );
    },
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
      if (content !== "") {
        const textarea = document.createElement('textarea');
        textarea.value = content;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.$message.success('已复制拼接列内容');
      } else {
        this.$message.error('似乎没有选择要复制的内容！！！？？');
      }
    },

    // 判断每一行的背景色
    getRowClassName({ row }) {
      // 判断最小下载速度是最大下载速度的一半及以上，且最大下载速度不小于 5
      // if (row.MinDownloadSpeed >= row.MaxDownloadSpeed / 2 && row.MaxDownloadSpeed >= 5) {
      //   return 'highlight-row'; // 设置需要高亮的样式类
      // }
      if (row.AvgDownloadSpeed >= 10) {
        return 'highlight-row'; // 设置需要高亮的样式类
      } else if (row.AvgDownloadSpeed >= 5) {
        return 'mindlight-row'; // 设置需要高亮的样式类
      }
      return '';
    }
  }
};
</script>

<style>
/* Scoped 样式 */
.highlight-row {
  background-color: #caffc6 !important;
}

.mindlight-row {
  background-color: #faf759 !important;
}
</style>
