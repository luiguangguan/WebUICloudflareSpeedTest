<template>
    <div>
        <textarea v-model="text" rows="10" cols="30" placeholder="请输入文本..."></textarea>
        <div>
            <el-button type="primary" @click="handleSubmit('覆盖')"
                style="margin-bottom: 20px;">
                覆盖
            </el-button>
            <el-button type="success" @click="handleSubmit('追加')"
                style="margin-bottom: 20px;">
                追加
            </el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            text: '', // 用于存储文本框内容
        };
    },
    methods: {
        // 提交数据到接口
        async handleSubmit(action) {
            const url = '/IPs'; // 假设这是接口路径

            let data;
            if (action === '覆盖') {
                data = { action: 'overwrite', content: this.text };
            } else if (action === '追加') {
                data = { action: 'append', content: this.text };
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
                    this.$message.error('失败');

                }
            } catch (error) {
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