<template>
    <div>
        <textarea v-model="text" rows="30" cols="30" placeholder="请输入文本..."></textarea>
        <div>
            密码：
        <el-input placeholder="请输入密码" v-model="password" show-password></el-input>
        </div>
        <div>
            无效IP前添加：
            <el-input placeholder="失敗的IP的前添加的字符" v-model="FailFlag"></el-input>
        </div>
        <div>
            <el-button type="primary" @click="TestSpeed()" style="margin-bottom: 20px;">
                测试
            </el-button>
        </div>
        <div>
            <h4>{{ TestMsg }}</h4>
        </div>
        <div v-for="ip in ips">
            <div v-if="ip.Ok" style="color: green;">
                {{ ip.IP }}#{{ ip.Port }}#{{ ip.Remark }}
            </div>
            <div v-else style="color: red;">
                {{ FailFlag }}{{ ip.IP }}#{{ ip.Port }}#{{ ip.Remark }}
            </div>
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
            ips: [],
            TestMsg: "",
            FailFlag:"//"
        };
    },
    methods: {
        // 提交数据到接口
        async TestSpeed() {
            if (!this.password) {
                this.$message.error('请输入密码');
                return;
            }


            ElMessageBox.confirm(
                `您确定要测试吗?`, // 提示信息
                '警告', // 标题
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning', // 弹框类型
                }
            ).then(async () => {
                // 用户点击确认后的操作
                const url = '/TestHttpConnect'; // 假设这是接口路径
                let data = { IpText: this.text, password: this.password };
                try {
                    this.TestMsg = "正在测试..."
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });
                    // debugger
                    if (response.ok) {
                        const repData = await response.json();
                        this.$message.success("成功");
                        this.ips = repData.ips;
                        this.TestMsg = repData.message;
                    } else {
                        const errorData = await response.json();
                        this.$message.error(errorData.message);
                        this.TestMsg = errorData.message;
                    }
                } catch (error) {
                    debugger
                    console.error(error)
                    this.TestMsg = "";
                }
            }).catch(() => {
                // 用户点击取消后的操作
                ElMessage.info(`操作取消`);
            });

        },
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