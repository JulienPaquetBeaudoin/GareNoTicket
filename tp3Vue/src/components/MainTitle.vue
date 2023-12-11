<template>
<div class="bg-rose-100 py-[15px] flex justify-center text-white font-bold">
    <h1 class="text-2xl border-2 rounded-md bg-rose-600 p-[12px]">{{ title }}</h1>
</div>
</template>

<script>
export default {
    name: 'MainTitle',
    props: {
        title: {
        type: String,
        
        }
    }
}
</script>

<style scoped>
</style>