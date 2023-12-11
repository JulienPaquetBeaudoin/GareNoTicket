<template>
    <div class="bg-rose-50 py-[15px] flex justify-center text-white font-bold">
        <h2 class="text-lg border-2 rounded-md bg-rose-600 p-[12px]">{{ title }}</h2>
    </div>
    </template>
    
    <script>
    export default {
        name: 'SecondTitle',
        props: {
            title: {
            type: String,
            
            }
        }
    }
    </script>
    
    <style scoped>
    </style>