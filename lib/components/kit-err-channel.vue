<template>
  <div v-if="storeErrMsg.submitId===id && storeErrMsg.msg && storeErrMsg.msg!==''">
    <el-alert
          :title="storeErrMsg.msg"
          type="error"
          show-icon>
    </el-alert>
  </div>
</template>
<script setup>
import {storeErrMsg} from "../store";

defineProps({
  id: {
    type: String,
    default: null,
  },
})

// watch(() => storeErrMsg.time, () => {
//   console.log(storeErrMsg.submitId)
//   if (storeErrMsg.submitId === props.id) {
//     console.log(msg.value)
//     msg.value = storeErrMsg.msg;
//   }
// });
</script>
