<template>
  <div />
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute(); // /redirect/:path(.*) 是动态路由，所以有动态参数动态参数 params
const router = useRouter();
console.log(route);


const { params, query } = route;
const { path } = params; 

console.log(`访问"/redirect/${path}",经过了redirect组件重定向路由到"${path}"`);


router.replace({ path: '/' + path, query });
</script>
