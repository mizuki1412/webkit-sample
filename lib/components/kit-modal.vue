<template>
  <el-dialog
      v-model="modal.visible"
      draggable
      :close-on-click-modal="closeOnClickModal"
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
    <KitErrChannel class="mt-2" :id="id" />
    <template #footer v-if="!noFooter">
      <div class="flex justify-end">
        <el-button type="default" plain @click="cancel" :loading="Object.keys(modal).indexOf('loading')>-1?modal.loading:false">取消</el-button>
        <el-button type="primary" @click="ok" :loading="Object.keys(modal).indexOf('loading')>-1?modal.loading:false">确定</el-button>
      </div>
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
  closeOnClickModal:{
    type: Boolean,
    default: false
  }
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
