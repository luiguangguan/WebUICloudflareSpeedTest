<template>
  <div>
    <div style="margin-top: 20px;">
      <!-- 刷新和时间选择框放在同一行 -->
      <el-row gutter={20}>
        <el-col :span="12">
          <!-- 蓝色的刷新按钮 -->
          <el-button type="primary" @click="refreshData">刷新数据</el-button>
        </el-col>
        <el-col :span="12">
          <!-- 自动刷新设置 -->
          <el-select v-model="interval" placeholder="选择刷新间隔" @change="setAutoRefresh" style="width: 100%;">
            <el-option label="1秒" value="1000"></el-option>
            <el-option label="5秒" value="5000"></el-option>
            <el-option label="10秒" value="10000"></el-option>
            <el-option label="15秒" value="15000"></el-option>
            <el-option label="暂停" value="0"></el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>

    <!-- Tabs 切换 -->
    <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick">
      <el-tab-pane label="测速结果" name="maxData">
        <SpeedTestTable :data="maxData" />
      </el-tab-pane>
      <el-tab-pane label="测速结果(今天)" name="S1daymaxData">
        <SpeedTestTable :data="S1daymaxData" />
      </el-tab-pane>
      <el-tab-pane label="测速结果(昨天)" name="SYesterdaymaxData">
        <SpeedTestTable :data="SYesterdaymaxData" />
      </el-tab-pane>
      <el-tab-pane label="测速结果(3 Day)" name="S3daymaxData">
        <SpeedTestTable :data="S3daymaxData" />
      </el-tab-pane>
      <el-tab-pane label="测速结果(5 Day)" name="S5daymaxData">
        <SpeedTestTable :data="S5daymaxData" />
      </el-tab-pane>
      <el-tab-pane label="计划任务" name="ScheduleData">
        <div v-if="ScheduleData.length > 0">
          <ScheduleTable :data="ScheduleData" />
        </div>
        <div v-else>
          <p>没有计划任务数据</p>
        </div>
      </el-tab-pane>
      <el-tab-pane label="运行状态" name="processData">
        <!-- 进度条展示 -->
        <ProgressBars :processData="processData" :socketStatus="SocketStatus" :socketStatusMsg="SocketStatusMsg"
          :netStatus="netStatus" :netType="netType" />
      </el-tab-pane>

    </el-tabs>

    <!-- 暗黑模式切换按钮，放置在右下角 -->
    <!-- <el-button
      class="dark-mode-toggle"
      @click="toggleDarkMode"
      type="text"
      style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;">
      {{ isDarkMode ? '切换到亮色模式' : '切换到黑暗模式' }}
    </el-button> -->
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
// import VConsole from "vconsole"
import SpeedTestTable from './components/SpeedTestTable.vue';
import ScheduleTable from './components/ScheduleTable.vue';
import ProgressBars from './components/ProgressBars.vue';

export default {
  components: {
    SpeedTestTable,
    ScheduleTable,
    ProgressBars
  },
  setup() {
    // 主题切换的状态
    const isDarkMode = ref(localStorage.getItem('isDarkMode') === 'true'); // 从localStorage读取

    // Tab 切换
    const activeTab = ref('maxData'); // 当前激活的 Tab

    const maxData = ref([]); // 存储MaxData接口数据
    const SYesterdaymaxData = ref([]); // 
    const S1daymaxData = ref([]); // 
    const S3daymaxData = ref([]); // 
    const S5daymaxData = ref([]); // 
    const SocketStatus = ref(false);
    const netStatus = ref(false);
    const netType = ref("");
    const SocketStatusMsg = ref("");

    // const vConsole = new VConsole();

    const processData = ref(
      {
        Delay: {
          Current: 0,
          Total: 0,
          IP: "",
          Port: 0,
          Remark: "",
          Available: 0,
          Duration: {
            StartTime: "",
            Hours: 0,
            Minutes: 0,
            Seconds: 0
          }
        },
        Download: {
          Current: 0,
          Total: 0,
          IP: "",
          Port: 0,
          Remark: "",
          Speed: 0,
          Duration: {
            StartTime: "",
            Hours: 0,
            Minutes: 0,
            Seconds: 0
          }
        },
        AllDataCount: 0,
        NextTime: ""
      });
    const interval = ref(5000); // 默认自动刷新时间间隔为5秒
    const ScheduleData = ref([])//计划任务时间
    let autoRefresh = null;

    // 获取 MaxData 数据
    const fetchMaxData = async () => {
      try {
        const response = await axios.get('/MaxData');
        maxData.value = response.data;
      } catch (error) {
        console.error('获取 MaxData 数据失败：', error);
      }
    };
    const fetch1dayMaxData = async () => {
      try {
        const response = await axios.get('/Get1DayMaxData');
        S1daymaxData.value = response.data;
      } catch (error) {
        console.error('获取 1DayMaxData 数据失败：', error);
      }
    };
    const fetchYesterdayMaxData = async () => {
      try {
        const response = await axios.get('/GetYesterdayMaxData');
        SYesterdaymaxData.value = response.data;
      } catch (error) {
        console.error('获取 1DayMaxData 数据失败：', error);
      }
    };

    const fetch3dayMaxData = async () => {
      try {
        const response = await axios.get('/Get3DayMaxData');
        S3daymaxData.value = response.data;
      } catch (error) {
        console.error('获取 3DayMaxData 数据失败：', error);
      }
    };

    const fetch5dayMaxData = async () => {
      try {
        const response = await axios.get('/Get5DayMaxData');
        S5daymaxData.value = response.data;
      } catch (error) {
        console.error('获取 5DayMaxData 数据失败：', error);
      }
    };

    // 获取计划任务数据
    const fetchSchedules = async () => {
      try {
        const response = await axios.get('/Schedules');
        ScheduleData.value = response.data; // 假设后端返回的是一个字符串数组
        //console.log('Schedule Data:', ScheduleData.value); // 打印出请求的数据，检查是否成功获取
      } catch (error) {
        console.error('获取 ScheduleData 数据失败：', error);
      }
    };


    // 获取 Process 数据
    // const fetchProcessData = async () => {
    //   try {
    //     const response = await axios.get('/Process');
    //     processData.value = response.data;
    //   } catch (error) {
    //     console.error('获取 Process 数据失败：', error);
    //   }
    // };

    let socket;

    function ProcessConnect() {
      if (socket && socket.readyState !== WebSocket.CLOSED && socket.readyState !== WebSocket.CLOSING) {
        console.log("Existing connection detected, skipping reconnect.");
        return;
      }
      SocketStatusMsg.value = "开始连接...";

      // 初始化 WebSocket
      socket = new WebSocket("/Process");

      socket.onopen = () => {
        console.log("WebSocket connection established.");
        SocketStatus.value = true;
        SocketStatusMsg.value = "已连接"
      };

      socket.onmessage = (event) => {
        try {
          if (event.data !== "heartbeat") {
            processData.value = JSON.parse(event.data);
          }
        } catch (e) {
          console.error("Error parsing WebSocket message:", e);
          console.error("data:", event.data);
        }
        SocketStatus.value = true;
        SocketStatusMsg.value = "已连接";
      };

      socket.onclose = (event) => {
        let retrySec = 3;
        console.log("WebSocket connection closed:", event.reason);
        console.log("Reconnecting in 3 seconds...");
        setTimeout(ProcessConnect, retrySec * 1000); // 3 秒后重连
        SocketStatusMsg.value = `连接断开，${retrySec}秒后重试...`;
        SocketStatus.value = false;
        // alert("鏈接已關閉")
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        SocketStatusMsg.value = "通信出错...";
        SocketStatus.value = false;
      };
    }

    // 监听网络状态变化

    window.addEventListener("online", (event) => {
      console.log('Network is back online.');
      // 重新连接 WebSocket
      if (socket && socket.readyState !== WebSocket.CLOSED) {
        SocketStatusMsg.value += " 網絡恢復"
        socket.close();
        ProcessConnect();
      }
    });

    window.addEventListener('offline', (event) => {
      console.log('Network is offline.');
      // 你可以在这里处理设备离线状态的逻辑
      SocketStatusMsg.value = "网络离线，等待恢复...";
      SocketStatus.value = false;
    });
    function UpdateNetStatus() {
      netStatus.value = navigator.onLine;
      netType.value = navigator.connection.type;
    }
    navigator.connection.onchange = function (e) {
      UpdateNetStatus();

      if (navigator.onLine) {
        if (navigator.connection.type && navigator.connection.type === "wifi") {
          try {
            // SocketStatusMsg.value
            if (socket) {
              socket.close();
              // alert("關閉鏈接")
            }
          } catch (e) {
          }
          ProcessConnect();
        }
      } else {
        SocketStatusMsg.value = "网络离线，等待恢复...";
        SocketStatus.value = false;
      }

      // alert(JSON.stringify({ e: e, online: navigator.onLine, type: navigator.connection.type }))
    }

    // 初始化连接
    ProcessConnect();
    UpdateNetStatus();

    // setInterval(() => {
    //   console.log(navigator.onLine);
    // }, 1000);

    // 刷新数据
    const refreshData = async () => {
      await fetchMaxData();
      await fetchYesterdayMaxData();
      await fetch1dayMaxData();
      await fetch3dayMaxData();
      await fetch5dayMaxData();
      // await fetchProcessData();
      await fetchSchedules();
    };

    // 设置自动刷新
    const setAutoRefresh = () => {
      if (autoRefresh) {
        clearInterval(autoRefresh);
      }
      if (interval.value > 0) {

        autoRefresh = setInterval(() => {
          refreshData();
        }, interval.value);
      }

    };

    // 在页面加载时请求数据
    onMounted(() => {
      refreshData();
      setAutoRefresh();
    });

    // 监听 interval 变化
    watch(interval, setAutoRefresh);

    // 处理 Tab 切换事件
    const handleTabClick = (tab) => {
      console.log('当前选中的 Tab：', tab.label);
    };

    // 切换黑暗模式
    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value;
      localStorage.setItem('isDarkMode', isDarkMode.value); // 保存到localStorage

      // 切换body的class
      if (isDarkMode.value) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    };

    // 初始化页面的主题
    if (isDarkMode.value) {
      document.body.classList.add('dark-mode');
    }

    return {
      isDarkMode,
      activeTab,
      maxData,
      SYesterdaymaxData,
      S1daymaxData,
      S3daymaxData,
      S5daymaxData,
      processData,
      interval,
      refreshData,
      setAutoRefresh,
      handleTabClick,
      toggleDarkMode,
      ScheduleData,
      SocketStatus,
      SocketStatusMsg,
      netType,
      netStatus,
    };
  }
};
</script>

<style scoped>
/* 额外的样式 */
.el-table {
  margin-top: 20px;
}

/* 对表单布局进行调整 */
.el-row {
  margin-top: 20px;
}

.el-col {
  display: flex;
  align-items: center;
}

/* 样式调整：按钮和时间框显示在同一行 */
.el-button {
  width: 100%;
}

.el-select {
  width: 100%;
}

/* 黑暗模式相关样式 */
.dark-mode {
  background-color: #121212;
  color: white;
}

/* 确保表格在暗黑模式下可读 */
.dark-mode .el-table {
  background-color: #333;
  color: #fff;
}

.dark-mode .el-table th,
.dark-mode .el-table td {
  color: #fff;
}

.dark-mode .el-table__header {
  background-color: #2c2c2c;
}

.dark-mode .el-button {
  background-color: #0078d4;
  color: #fff;
}

.dark-mode .el-select {
  background-color: #444;
  color: #fff;
}

/* 右下角的暗黑模式切换按钮样式 */
.dark-mode-toggle {
  font-size: 14px;
  background-color: #0078d4;
  color: white;
  border-radius: 50%;
  padding: 10px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dark-mode-toggle:hover {
  background-color: #005fa3;
}

/* 全局样式调整，应用于暗黑模式下 */
body.dark-mode {
  background-color: #121212;
  color: #ffffff;
}

/* 针对暗黑模式下的样式 */
body.dark-mode .el-tabs__header {
  background-color: #333;
}

body.dark-mode .el-button {
  background-color: #0078d4;
  color: #fff;
}

body.dark-mode .el-table {
  background-color: #444;
  color: #fff;
}

body.dark-mode .el-select {
  background-color: #444;
  color: #fff;
}
</style>
