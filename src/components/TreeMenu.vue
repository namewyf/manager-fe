<template>
    <template v-for="menu in userMenu">
        <el-sub-menu v-if="menu.children && menu.children.length > 0 && menu.children[0].menuType == 1" :key="menu._id"
            :index="menu.path">
            <!-- 这个地方的template是插槽语法，#title是v-slot的缩写，表示将内容插入到父组件中名为 title 的插槽中。 -->
            <template #title>
                <el-icon>
                    <setting />
                </el-icon>
                <span>{{ menu.menuName }}</span>
            </template>
            <tree-menu :userMenu="menu.children" />
        </el-sub-menu>
        <el-menu-item v-else-if="menu.menuType == 1" :index="menu.path" :key="`item-${menu._id}`">{{ menu.menuName
            }}</el-menu-item>
    </template>
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
