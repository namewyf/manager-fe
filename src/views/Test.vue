<template>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="Activity zone">
            <el-select v-model="formInline.region" placeholder="Activity zone" clearable>
                <el-option label="Zone one" value="shanghai" />
                <el-option label="Zone two" value="beijing" />
            </el-select>
        </el-form-item>
    </el-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const formInline = reactive({
    user: '',
    region: '',
    date: '',
})

const onSubmit = () => {
    console.log('submit!')
}
</script>

<style>
.demo-form-inline {
    --el-input-width: 220px;
}

.demo-form-inline {
    --el-select-width: 220px;
}
</style>