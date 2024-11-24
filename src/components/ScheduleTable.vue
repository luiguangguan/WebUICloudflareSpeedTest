<template>
  <div>
    <!-- 使用单列布局 -->
    <el-row>
      <!-- 循环展示每个计划任务 -->
      <el-col :span="24" v-for="(task, index) in data" :key="index">
        <el-card class="task-card" :body-style="{ padding: '20px' }">
          <div class="task-header">
            <h3>{{ task }}</h3>
          </div>
          <div class="task-body">
            <!-- 你可以在这里展示更多的内容，比如任务详情等 -->
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped>
.el-card {
  background-color: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.el-card:hover {
  transform: scale(1.05);
}

.task-header h3 {
  font-size: 18px;
  font-weight: bold;
}

.task-body p {
  font-size: 14px;
  color: #555;
}

.el-row {
  margin-top: 20px;
}
</style>
