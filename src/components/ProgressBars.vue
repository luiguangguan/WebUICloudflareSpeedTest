<template>
  <div>
    <el-progress :percentage="(processData.Delay.Current / processData.Delay.Total) * 100" />
    <el-progress :percentage="(processData.Download.Current / processData.Download.Total) * 100" />
  </div>
</template>

<script>
export default {
  props: ['processData']
};
</script>

<style scoped>
.el-progress {
  margin-top: 20px;
}
</style>
