<template>
    <div class="user-manage">
        <div class="query-form">
            <el-form ref="form" :inline="true" :model="queryForm" class="form-inline">
                <el-form-item label="菜单名称" prop="menuName">
                    <el-input v-model="queryForm.userId" placeholder="请输入菜单名称"></el-input>
                </el-form-item>
                <el-form-item label="菜单状态" prop="menuState">
                    <el-select v-model="queryForm.menuState">
                        <el-option :value="1" label="正常"></el-option>
                        <el-option :value="2" label="停用"></el-option>
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
            <el-table :data="menuList" row-key="_id" :tree-props="{children: 'children'}">
                <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
                    :width="item.width" :formatter="item.formatter"></el-table-column>
                <el-table-column label="操作" width="190">
                    <template #default="scope">
                        <!-- scope 是一个特殊的插槽属性（slot prop），它包含了当前行的数据信息 -->
                        <el-button @click="handleAdd(scope.row)" size="small">新增</el-button>
                        <el-button @click="handleEdit(scope.row)" size="small">编辑</el-button>
                        <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pagination" background layout="prev, pager, next" :total="pager.total" :page-size="pager.pageSize" :current-page="pager.pageNum" @current-change="handleCurrentChange"></el-pagination>
        </div>
        <!-- <el-dialog title="用户新增" v-model="showModal">
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
        </el-dialog> -->
    </div>
</template>

<script>
//这里使用的是composition api
export default{
    name: 'menu',
    data(){
        return {
            menuList: [],
            columns: [{
                label: '菜单名称',
                prop: 'menuName',
                width: 150,
            },{
                label: '图标',
                prop: 'icon',
            },{
                label:'菜单类型',
                prop: 'menuType',
                formatter: (row, column, value) => {
                    return {
                        '1':'菜单',
                        '2':'按钮'
                    }[value]
                }
            },{
                label:'权限标识',
                prop:'menuCode'
            },{
                label:'路由地址',
                prop:'path',

            },{
                label:'组件路径',
                prop:'component',
            },{
                label:'菜单状态',
                prop:'menuState',
                width:90,
                formatter: (row, column, value) => {
                    return {
                        '1':'正常',
                        '2':'停用'
                    }[value]
                }
            },{
                label:'创建时间',
                prop:'createTime'
            }],
            queryForm: {
                menuState: 1
            },
            pager: {}
        }
    },
    mounted(){
        this.getMenuList()
    },
    methods:{
        async getMenuList(){
            try{
                let list = await this.$api.getMenuList(this.queryForm)
                console.log("list=",list);
                
                this.menuList = list
            }catch(err){
                throw new Error(err)
            }
        },
        handleQuery(){

        },
        handleReset(){

        },
        handleAdd(){

        },
        handleEdit(){

        },
        handleDelete(){

        }

    }
}
</script>

<style lang="scss" scoped>
</style>
