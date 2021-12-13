<template>
  <div class="flex flex-col items-center p-4">
    <el-empty :image="img">
      <template #description>
        <div class="text-lg text-gray-700">
          <slot></slot>
        </div>
      </template>
<!--      <template #default></template>-->
    </el-empty>
  </div>
</template>
<script setup>
// 可以传入图片地址
defineProps({
  img: {
    type: String,
    default: null
  },
})

</script>
