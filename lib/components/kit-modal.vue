<template>
  <el-dialog
      v-model="modal.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="showClose"
      :show-close="showClose"
      :before-close="cancel"
      :width="width">
    <template #title>
      <div class="flex justify-center items-center">
        <slot name="title" />
      </div>
    </template>
    <slot/>
    <template #footer v-if="!noFooter">
      <div class="flex justify-end gap-4">
        <el-button type="default" plain @click="cancel">取消</el-button>
        <el-button type="primary" @click="ok">确定</el-button>
      </div>
      <KitErrChannel class="mt-2" :id="id" />
    </template>
  </el-dialog>
</template>
<script setup>
import {submitErrChanel} from "../store";
import KitErrChannel from './kit-err-channel.vue'

// const vDrag = {
//   mounted(el) {
//     console.log(el)
//   }
// }

const props = defineProps({
  confirm: {
    type: Function,
    default: async () => { },
  },
  close: {
    type: Function,
    default: () => {},
  },
  modal: {
    type: Object,
    default: { visible: true, loading: false },
  },
  width: {
    type: String,
    default: '40%',
  },
  noFooter: {
    type: Boolean,
    default: false,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  id: {
    type: String,
    default: null,
  },
})

function cancel() {
  if (props.id) {
    // clearErrMsg(props.id);
    // 关闭后还原err channel
    submitErrChanel('');
  }
  props.close();
  props.modal.visible = false;
}
async function ok() {
  if (props.id) {
    submitErrChanel(props.id);
  }
  await props.confirm();
  props.modal.visible = false;
}

</script>
