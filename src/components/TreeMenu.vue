<template>
    <el-sub-menu index="1">
        <!-- 这个地方的template是插槽语法，#title是v-slot的缩写，表示将内容插入到父组件中名为 title 的插槽中。 -->
        <template #title>
            <el-icon>
                <setting />
            </el-icon>
            <span>系统管理</span>
        </template>
        <el-menu-item index="1-1">用户管理</el-menu-item>
        <el-menu-item index="1-2">菜单管理</el-menu-item>
        <el-menu-item index="1-3">角色管理</el-menu-item>
        <el-menu-item index="1-4">部门管理</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
        <template #title>
            <el-icon>
                <setting />
            </el-icon>
            <span>审批管理</span>
        </template>
        <el-menu-item index="2-1">休假审批</el-menu-item>
        <el-menu-item index="2-2">待我审批</el-menu-item>
    </el-sub-menu>
</template>

<script>
export default {
    name: 'TreeMenu',
    components: {},
    props: {
        userMenu: {
            type: Array,
            // 直接使用 default: [] 会导致所有实例共享同一个数组引用，要用函数形式返回默认值
            default() {
                return []
            }
        }
    },
    data() {
        return {}
    },
    methods: {},
    mounted() { }
}
</script>

<style lang="scss" scoped></style>
