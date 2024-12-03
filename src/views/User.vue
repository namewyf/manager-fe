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
                    <el-button @click="handleReset('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="base-table">
            <div class="action">
                <el-button type="primary" @click="handleCreate">新增</el-button>
                <el-button type="danger" @click="handlePatchDel">批量删除</el-button>
            </div>
            <el-table :data="userList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
                    :width="item.width" :formatter="item.formatter" />
                <el-table-column label="操作" width="130">
                    <template #default="scope">
                        <!-- scope 是一个特殊的插槽属性（slot prop），它包含了当前行的数据信息 -->
                        <el-button @click="handleClick(scope.row)" size="small">编辑</el-button>
                        <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pagination" background layout="prev, pager, next" :total="pager.total" :page-size="pager.pageSize" :current-page="pager.pageNum" @current-change="handleCurrentChange"></el-pagination>
        </div>
        <el-dialog title="用户新增" v-model="showModal">
            <el-form ref="dialogForm" :model="userForm" label-width="100px" :rules="rules">
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="userForm.userName" placeholder="请输入用户名"/>
                </el-form-item>
                <el-form-item label="邮箱" prop="userEmail">
                    <el-input v-model="userForm.userEmail" placeholder="请输入用户邮箱">
                        <template #append>@imooc.com</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="userForm.mobile" placeholder="请输入手机号"/>
                </el-form-item>
                <el-form-item label="岗位" prop="job">
                    <el-input v-model="userForm.job" placeholder="请输入岗位"/>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="userForm.state">
                        <el-option :value="1" label="在职"></el-option>
                        <el-option :value="2" label="离职"></el-option>
                        <el-option :value="3" label="试用期"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="系统角色" prop="roleList">
                    <el-select v-model="userForm.roleList" placeholder="请选择用户系统角色" multiple style="width: 100%;">
                        <el-option v-for="role in roleList" :key="role._id" :label="role.roleName" :value="role._id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部门" prop="deptId">
                    <el-cascader
                    v-model="userForm.deptId"
                    placeholder="请选择所属部门"
                    :options="deptList"
                    :props="{checkStrictly: true,value:'_id',label:'deptName'}"
                    :show-all-levels="true"
                    :style="{width: '100%'}"
                    clearable />
                </el-form-item>
            </el-form>
            <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleSubmit">确定</el-button>
            </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
//这里使用的是composition api
import { getCurrentInstance,onMounted, reactive, ref,toRaw } from 'vue'
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
        //初始化选中用户ID
        const checkedUserIds = ref([])
        //单框显示对象
        const showModal = ref(false)
        //定义用户表单对象
        const userForm = reactive({
            userName: '',
            userEmail: '',
            mobile: '',
            job: '',
            state: 3,
            roleList: [],
            deptId: []
        })
        //所有角色列表
        const roleList = ref([])
        //所有部门列表
        const deptList = ref([])
        //定义用户操作行为
        const action = ref('add')
        //定义动态表格格式
        const rules = reactive({
            userName:[
                {
                    required: true,
                    message: '用户名不能为空',
                    trigger: 'blur'
                }
            ],
            userEmail:[
                {
                    required:true,
                    message:'邮箱不能为空',
                    trigger:'blur'
                }
            ],
            mobile:[
                {
                    required:true,
                    message:'手机号不能为空',
                    trigger:'blur'
                },{
                    pattern:/1\d{10}/,
                    message:'请输入正确格式的手机号',
                    trigger:'blur'
                }
            ],
            deptId:[
                {
                    required:true,
                    message:'部门不能为空',
                    trigger:'blur'
                }
            ]
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
                formatter(row,column,value){
                    //这里是一个对象字典
                    return {
                        0:'管理员',
                        1:'普通用户',
                    }[value]
                }
            },
            {
                label: '用户状态',
                prop: 'state',
                formatter(row,column,value){
                    //这里是一个对象字典
                    return {
                        1:'在职',
                        2:'离职',
                        3:'试用期'
                    }[value]
                }
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
            getDeptList()
            getRoleList()
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
        const handleReset = (form) => {
            proxy.$refs[form].resetFields()
            // resetFields() 通过 prop 来识别要重置哪些字段
        }
        //分页事件处理
        const handleCurrentChange = (current) => {
            pager.pageNum = current
            getUserList();
        }
        //用户单个删除
        const handleDelete = async (row) => {
            await proxy.$api.userDel({
                userIds: [row.userId]
            })
            proxy.$message.success('删除成功')
            getUserList()
        }
        //批量删除
        const handlePatchDel = async () => {
            if(checkedUserIds.value.length === 0) {
                proxy.$message.error('请选择要删除的用户')
                return
            }
            const res = await proxy.$api.userDel({
                userIds: checkedUserIds.value
            })
            if(res.nModified>0){
                proxy.$message.success('删除成功')
                getUserList()
            }else{
                proxy.$message.error('删除失败')
            }
        }
        //表格多选
        const handleSelectionChange=(list)=>{
            let arr = []
            list.map(item=>{
                arr.push(item.userId)
            })
            checkedUserIds.value = arr
        }
        //用户新增
        const handleCreate = () => {
            showModal.value = true
        }
        const getDeptList = async () => {
            let list = await proxy.$api.getDeptList()
            console.log("deptList=",list);
            deptList.value = list
        }
        const getRoleList = async () => {
            let list = await proxy.$api.getRoleList()
            console.log("roleList=",list);
            roleList.value = list.list
        }
        //用户弹窗关闭
        const handleClose = ()=>{
            showModal.value = false
            handleReset('dialogForm')
        }
        //用户弹窗确定
        const handleSubmit = ()=>{
            console.log("userForm=",userForm);
            proxy.$refs.dialogForm.validate(async (valid)=>{
                if(valid){
                    let params = toRaw(userForm)
                    //这里使用toRaw，将响应式对象转换为普通对象，这样我们对这个普通对象的修改就不会影响到userForm对象了
                    params.userEmail += "@imooc.com"
                    params.action = action.value
                    console.log("params=",params);
                    let res = await proxy.$api.userSubmit(params)
                    if(res){
                        showModal.value = false
                        proxy.$message.success('用户创建成功')
                        handleReset('dialogForm')
                        getUserList()
                    }
                }
            })
        }
        return {
            user,
            showModal,
            userForm,
            rules,
            userList,
            columns,
            pager,
            checkedUserIds,
            getUserList,
            handleCurrentChange,
            handleQuery,
            handleReset,
            handleDelete,
            handlePatchDel,
            handleSelectionChange,
            handleCreate,
            getDeptList,
            getRoleList,
            roleList,
            deptList,
            handleClose,
            handleSubmit
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
