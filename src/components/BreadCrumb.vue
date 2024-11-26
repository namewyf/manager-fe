<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item v-for="(item,index) in breadList" :index="item.path">
            <router-link to="/welcome" v-if="index == 0">{{ item.meta.title }}</router-link>
            <span v-else>{{ item.meta.title }}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
import { ArrowRight } from '@element-plus/icons-vue'
import { markRaw } from 'vue'
export default {
    name: 'BreadCrumb',
    components: {},
    data() {
        return {
            ArrowRight:markRaw(ArrowRight)
        }
    },
    computed: {
        //这里必须使用计算属性，否则无法监听到路由的变化
        breadList(){
            return this.$route.matched
        }
    },
    methods: {},
    mounted() { }
}
</script>

<style lang="scss" scoped></style>
