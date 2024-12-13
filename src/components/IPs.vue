<template>
    <div>
        <textarea v-model="text" rows="30" cols="30" placeholder="请输入文本..."></textarea>
        <el-input placeholder="请输入密码" v-model="password" show-password></el-input>
        <div>
            <el-button type="primary" @click="handleSubmit('覆盖')" style="margin-bottom: 20px;">
                覆盖
            </el-button>
            <el-button type="success" @click="handleSubmit('追加')" style="margin-bottom: 20px;">
                追加
            </el-button>
            <el-button type="success" @click="LoadIps()" style="margin-bottom: 20px;">
                加载...
            </el-button>
            <el-button type="primary" @click="ClearTracerInfos('覆盖')" style="margin-bottom: 20px;">
                清空路由信息
            </el-button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { ElMessageBox, ElMessage } from 'element-plus';
export default {
    data() {
        return {
            text: '', // 用于存储文本框内容
            password: '',
        };
    },
    methods: {
        // 提交数据到接口
        async handleSubmit(action) {
            if (!this.password) {
                this.$message.error('请输入密码');
                return;
            }


            ElMessageBox.confirm(
                `您确定要${action}数据吗?`, // 提示信息
                '警告', // 标题
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning', // 弹框类型
                }
            ).then(async () => {
                // 用户点击确认后的操作
                const url = '/IPs'; // 假设这是接口路径

                let data;
                if (action === '覆盖') {
                    data = { action: 'overwrite', content: this.text, password: this.password };
                } else if (action === '追加') {
                    data = { action: 'append', content: this.text, password: this.password };
                }

                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });
                    if (response.ok) {
                        this.$message.success('成功');

                    } else {
                        const errorData = await response.json();
                        this.$message.error(errorData.message);

                    }
                } catch (error) {
                }
            }).catch(() => {
                // 用户点击取消后的操作
                ElMessage.info('删除已取消');
            });

        },
        async LoadIps() {
            try {
                const response = await axios.get('/GetIPs');
                this.text = response.data;
                this.$message.success('成功');
            } catch (error) {
                this.$message.error('失败');
                console.error('获取 MaxData 数据失败：', error);
            }

        },
        async ClearTracerInfos() {

            // 显示确认框
            // $.ElMessageBox
            ElMessageBox.confirm(
                '您确定要清空路由数据吗?', // 提示信息
                '警告', // 标题
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning', // 弹框类型
                }
            ).then(async () => {
                // 用户点击确认后的操作
                try {
                    if (!this.password) {
                        this.$message.error('请输入密码');
                        return;
                    }
                    const url = '/ClearTracerInfo';
                    let data = { password: this.password };


                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });
                    if (response.ok) {
                        this.$message.success('成功');

                    } else {
                        const errorData = await response.json();
                        this.$message.error(errorData.message);

                    }
                } catch (error) {
                    this.$message.error(error);

                }
            }).catch(() => {
                // 用户点击取消后的操作
                ElMessage.info('删除已取消');
            });
        }

    },
};
</script>

<style scoped>
textarea {
    width: 100%;
    resize: none;
}

button {
    margin: 5px;
    padding: 10px 20px;
    cursor: pointer;
}
</style>