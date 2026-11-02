<template>
    <div>
        test rich text
        <kit-rich-text v-model="content" style="width: 100%"></kit-rich-text>
    </div>
</template>
<script setup>
import { ref } from "vue"
// tinymce 体积大，仅本页引入
import KitRichText from "/lib/components/kit-rich-text.vue"

const content = ref('demo')
</script>
