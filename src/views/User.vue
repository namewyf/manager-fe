<template>
    <div class="user-manage">
        <div class="query-form">
            <el-form :inline="true" :model="user" class="form-inline">
                <el-form-item>
                    <el-input v-model="user.userId" placeholder="请输入用户ID"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="user.userName" placeholder="请输入用户昵称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="user.state" placeholder="请选择状态" clearable>
                        <el-option :value="0" label="所有"></el-option>
                        <el-option :value="1" label="在职"></el-option>
                        <el-option :value="2" label="离职"></el-option>
                        <el-option :value="3" label="试用期"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">查询</el-button>
                    <el-button>重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="base-table">
            <div class="action">
                <el-button type="primary">新增</el-button>
                <el-button type="danger">批量删除</el-button>
            </div>
            <el-table :data="userList">
                <el-table-column type="selection" width="55" />
                <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
                    :width="item.width" />
                <el-table-column label="操作" width="130">
                    <template #default="scope">
                        <el-button @click="handleClick(scope.row)" size="small">编辑</el-button>
                        <el-button type="danger" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
//这里使用的是composition api
import { getCurrentInstance,onMounted, reactive, ref } from 'vue'
export default {
    name: 'user',
    setup() {
        //vue3的this不指向组件实例，我们用proxy来代替this
        //需要使用 getCurrentInstance() 来获取组件实例。
        //中 proxy 属性是我们最常用的，它相当于 Vue 2 中的 this，可以用来访问组件的属性和方法。
        const { proxy } = getCurrentInstance()
        const user = reactive({
            state:1
        })
        const userList = ref([])
        const pager = reactive({
            pageNum: 1,
            pageSize: 10,
        })
        const columns = reactive([
            {
                label: '用户ID',
                prop: 'userId',
            },
            {
                label: '用户名',
                prop: 'userName',
            },
            {
                label: '用户邮箱',
                prop: 'userEmail',
            },
            {
                label: '用户角色',
                prop: 'role',
            },
            {
                label: '用户状态',
                prop: 'state',
            },
            {
                label: '注册时间',
                prop: 'createTime',
            },
            {
                label: '最后登录时间',
                prop: 'lastLoginTime',
            }
        ])
        onMounted(() => {
            getUserList()
        })
        const getUserList = async () => {
            try{
                const {list,page} = await proxy.$api.getUserList(user)
                userList.value = list
                pager.total = page.total
            } catch (error) {
                console.log("error", error);
            }
        }
        return {
            user,
            userList,
            columns,
            pager,
            getUserList,
        }
    },
}
</script>

<style lang="scss" scoped>
.form-inline .el-input {
    --el-input-width: 220px;
}

.form-inline .el-select {
    --el-select-width: 220px;
}
</style>
