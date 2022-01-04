<template>
  <el-empty :image="img" :image-size="size">
    <template #description>
      <div class="text-gray-700">
        <slot></slot>
      </div>
    </template>
    <!--      <template #default></template>-->
  </el-empty>
</template>
<script setup>
// 可以传入图片地址
defineProps({
  img: {
    type: String,
    default: null
  },
  size:{
    type: Number,
    default: 100
  }
})

</script>
