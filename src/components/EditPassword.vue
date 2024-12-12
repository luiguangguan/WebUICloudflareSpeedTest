<template>
    <div>
        <h3>原密码</h3>
        <el-input placeholder="请输入原密码" v-model="OldPwd" show-password></el-input>
        <h3>新密码</h3>
        <el-input placeholder="请输入新密码" v-model="NewPwd1" show-password></el-input>
        <h3>确认密码</h3>
        <el-input placeholder="确认新密码" v-model="NewPwd2" show-password></el-input>
        <div>
            <el-button type="primary" @click="EditPwd()" style="margin-bottom: 20px;">
                修改密码
            </el-button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            OldPwd: '',
            NewPwd1: '',
            NewPwd2: '',
        };
    },
    methods: {
        // 提交数据到接口
        async EditPwd() {
            const url = '/EditPwd'; // 假设这是接口路径

            let data = { oldpwd: this.OldPwd, newpwd1: this.NewPwd1, newpwd2: this. NewPwd2};
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
                console.error(error)
            }
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