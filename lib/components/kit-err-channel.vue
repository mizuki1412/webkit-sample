<template>
  <div
      v-if="
      storeErrMsg.submitId === id && storeErrMsg.msg && storeErrMsg.msg !== ''
    "
  >
    <a-alert :message="storeErrMsg.msg" type="error" show-icon></a-alert>
  </div>
</template>
<script setup>
import {storeErrMsg} from "../store"

defineProps({
  id: {
    type: String,
    default: null,
  },
})
</script>
