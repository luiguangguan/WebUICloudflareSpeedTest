<template>
  <div :class="ononlineStatusClass">
    <!-- 这里不需要加括号 -->
    <h3>连接状态:<span :class="getSocketStatusClassName">{{ socketStatusMsg }}</span></h3>
    <h2>数据总量：{{ processData.AllDataCount }}</h2>
    <h2>下次运行：{{ processData.NextTime }}</h2>
    <hr />

    <h3>开始时间：{{ processData.Delay.Duration.StartTime }}</h3>
    <h3>运行时长：{{ pad(processData.Delay.Duration.Hours) }}:{{ pad(processData.Delay.Duration.Minutes) }}:{{
      pad(processData.Delay.Duration.Seconds) }}</h3>
    <h3>{{ processData.Delay.Current }}/{{ processData.Delay.Total }}</h3>
    <h3>当前IP：{{ processData.Delay.IP }}:{{ processData.Delay.Port }} <strong>{{ processData.Delay.Remark }}</strong>
    </h3>
    <h3>可用IP数：{{ processData.Delay.Available }}</h3>
    <el-progress :percentage="parseFloat(((processData.Delay.Current / processData.Delay.Total) * 100).toFixed(2))" />

    <hr />

    <h3>开始时间：{{ processData.Download.Duration.StartTime }}</h3>
    <h3>运行时长：{{ pad(processData.Download.Duration.Hours) }}:{{ pad(processData.Download.Duration.Minutes) }}:{{
      pad(processData.Download.Duration.Seconds) }}</h3>
    <h3>{{ processData.Download.Current }}/{{ processData.Download.Total }}</h3>
    <h3>当前IP：{{ processData.Download.IP }}:{{ processData.Download.Port }} <strong>{{ processData.Download.Remark
        }}</strong></h3>
    <h3>下载速度：{{ processData.Download.Speed }}MB/s</h3>
    <el-progress
      :percentage="parseFloat(((processData.Download.Current / processData.Download.Total) * 100).toFixed(2))" />
  </div>
</template>

<script>
export default {
  props: ['processData', 'socketStatusMsg', 'socketStatus'],
  methods: {
    pad(num) {
      return num >= 10 ? num : '0' + num;
    }
  },
  computed: {
    getSocketStatusClassName() {
      // 根据 socketStatus 动态返回类名
      return this.socketStatus ? 'SocketStatusSuccess' : 'SocketStatusFail';
    },
    ononlineStatusClass(){
      return this.socketStatus ? '' : 'offline';
    }
  }
};
</script>

<style scoped>
.el-progress {
  margin-top: 20px;
}

.SocketStatusSuccess {
  color: green;
}

.SocketStatusFail {
  color: red;
}
.offline{
  color:#888888
}
</style>
