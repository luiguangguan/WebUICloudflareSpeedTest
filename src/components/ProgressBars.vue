<template>
  <div>
    <h3>{{ processData.Delay.Current }}/{{   processData.Delay.Total}}</h3>
    <el-progress :percentage="parseFloat(((processData.Delay.Current / processData.Delay.Total) * 100).toFixed(2))" />
    <h3>{{ processData.Download.Current }}/{{   processData.Download.Total}}</h3>
    <el-progress :percentage="parseFloat(((processData.Download.Current / processData.Download.Total) * 100).toFixed(2))" />

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
