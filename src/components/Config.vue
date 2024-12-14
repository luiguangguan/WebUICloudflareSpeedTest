<template>
    <div>
        <textarea v-model="text" rows="30" cols="30" placeholder="程序配置..."></textarea>
        <el-input placeholder="请输入密码" v-model="password" show-password></el-input>
        <div>
            <el-button type="primary" @click="handleSubmit()" style="margin-bottom: 20px;">
                更新配置
            </el-button>
            <el-button type="success" @click="LoadConfig()" style="margin-bottom: 20px;">
                加载配置...
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
        async handleSubmit() {
            if (!this.password) {
                this.$message.error('请输入密码');
                return;
            }

            ElMessageBox.confirm(
                `您确定要更改配置吗?`, // 提示信息
                '警告', // 标题
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning', // 弹框类型
                }
            ).then(async () => {
                // 用户点击确认后的操作
                const url = '/SaveConfig'; // 假设这是接口路径

                let data = { content: this.text, password: this.password };
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });
                    if (response.ok) {
                        const  resp = await response.json();
                        this.$message.success(resp.message);

                    } else {
                        const errorData = await response.json();
                        this.$message.error(errorData.message);

                    }
                } catch (error) {
                }
            }).catch(() => {
                // 用户点击取消后的操作
                ElMessage.info('操作已取消');
            });

        },
        async LoadConfig() {
            try {
                // 禁用自动解析，设置 responseType 为 'text'
                const response = await axios.get('/GetConfig', { responseType: 'text' });
                this.text = response.data;  // 直接获取文本数据
                this.$message.success('成功');
            } catch (error) {
                this.$message.error('失败');
                console.error('获取数据失败：', error);
            }
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