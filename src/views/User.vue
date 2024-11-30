<template>
    <div class="user-manage">
        <div class="query-form">
            <el-form ref="form" :inline="true" :model="user" class="form-inline">
                <el-form-item label="用户ID" prop="userId">
                    <el-input v-model="user.userId" placeholder="请输入用户ID"></el-input>
                </el-form-item>
                <el-form-item label="用户名称" prop="userName">
                    <el-input v-model="user.userName" placeholder="请输入用户昵称"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="user.state" placeholder="请选择状态" clearable>
                        <el-option :value="0" label="所有"></el-option>
                        <el-option :value="1" label="在职"></el-option>
                        <el-option :value="2" label="离职"></el-option>
                        <el-option :value="3" label="试用期"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleQuery">查询</el-button>
                    <el-button @click="handleReset">重置</el-button>
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
            <el-pagination class="pagination" background layout="prev, pager, next" :total="pager.total" :page-size="pager.pageSize" :current-page="pager.pageNum" @current-change="handleCurrentChange"></el-pagination>
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
        //需要使用 getCurrentInstance() 来获取组件实例，获取composition api
        //中 proxy 属性是我们最常用的，它相当于 Vue 2 中的 this，可以用来访问组件的属性和方法。
        const { proxy } = getCurrentInstance()
        //初始化用户表单对象
        const user = reactive({
            state:0
        })
        //初始化用户列表
        const userList = ref([])
        //初始化分页对象
        const pager = reactive({
            pageNum: 1,
            pageSize: 10,
        })
        //定义动态表格格式
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
        //初始化接口调用
        onMounted(() => {
            getUserList()
        })
        //获取用户列表
        const getUserList = async () => {
            let params = {...user,...pager}
            try{
                const {list,page} = await proxy.$api.getUserList(params)
                userList.value = list
                pager.total = page.total
            } catch (error) {
                console.log("error", error);
            }
        }

        //查询
        const handleQuery = () => {
            getUserList()
        }
        //重置
        const handleReset = () => {
            proxy.$refs.form.resetFields()
            // resetFields() 通过 prop 来识别要重置哪些字段
        }
        //分页事件处理
        const handleCurrentChange = (current) => {
            pager.pageNum = current
            getUserList();
        }
        return {
            user,
            handleCurrentChange,
            userList,
            columns,
            pager,
            getUserList,
            handleQuery,
            handleReset
        }
    },
}
</script>

<style lang="scss" scoped>
.form-inline .el-input {
    --el-input-width: 200px;
}

.form-inline .el-select {
    --el-select-width: 200px;
}
</style>
