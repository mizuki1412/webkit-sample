<template>
  <a-modal
      v-model:open="modal.visible"
      :width="width"
      :ok-text="confirmText"
      :cancel-text="cancelText"
      :confirm-loading="Object.keys(modal).indexOf('loading') > -1 ? modal.loading : false"
      :footer="noFooter?null:true"
      :mask-closable="closeOnClickModal"
      :keyboard="showClose"
      :closable="showClose"
      :after-close="cancel"
      @close="cancel"
      @ok="ok"
  >
    <template #title>
      <div ref="modalTitleRef" class="flex items-center justify-center w-full cursor-pointer">
        <slot name="title"/>
      </div>
    </template>
    <template #modalRender="{ originVNode }">
      <div :style="transformStyle">
        <component :is="originVNode" />
      </div>
    </template>
    <a-spin :spinning="modal.loading">
      <div class="max-h-[71vh] w-full">
        {{renderSlot()}}
      </div>
    </a-spin>
    <KitErrChannel class="mt-2" :id="id"/>
<!--    <template #footer v-if="!noFooter">-->
<!--      <div class="flex justify-end">-->
<!--        <a-button-->
<!--            type="default"-->
<!--            @click="cancel"-->
<!--            :loading="Object.keys(modal).indexOf('loading') > -1 ? modal.loading : false"-->
<!--        >{{ cancelText }}-->
<!--        </a-button>-->
<!--        <a-button-->
<!--            type="primary"-->
<!--            @click="ok"-->
<!--            :loading="-->
<!--            Object.keys(modal).indexOf('loading') > -1 ? modal.loading : false-->
<!--          "-->
<!--        >-->
<!--          {{ confirmText }}-->
<!--        </a-button>-->
<!--      </div>-->
<!--    </template>-->
  </a-modal>
</template>
<script setup>
import {ref, watch, computed, watchEffect, renderSlot} from "vue"
import {submitErrChanel} from "../store"
import KitErrChannel from "./kit-err-channel.vue"
import {useLoadingObject} from "../service"
import {useDraggable} from "@vueuse/core";
const props = defineProps({
  confirm: {
    type: Function,
    default: async () => {
    },
  },
  close: {
    type: Function,
    default: () => {
    },
  },
  modal: {
    type: Object,
    default: {visible: true, loading: false},
  },
  width: {
    type: String,
    default: "40%",
  },
  noFooter: {
    type: Boolean,
    default: false,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  draggable:{
    type: Boolean,
    default:true
  },
  id: {
    type: String,
    default: null,
  },
  closeOnClickModal: {
    type: Boolean,
    default: false,
  },
  confirmText: {
    type: String,
    default: "确定",
  },
  cancelText: {
    type: String,
    default: "取消",
  },
})

// 拖拽部分
const modalTitleRef = ref();
const { x, y, isDragging } = useDraggable(modalTitleRef);
const startX = ref(0);
const startY = ref(0);
const startedDrag = ref(false);
const transformX = ref(0);
const transformY = ref(0);
const preTransformX = ref(0);
const preTransformY = ref(0);
const dragRect = ref({ left: 0, right: 0, top: 0, bottom: 0 });
watch([x, y], () => {
  if (!startedDrag.value) {
    startX.value = x.value;
    startY.value = y.value;
    const bodyRect = document.body.getBoundingClientRect();
    const titleRect = modalTitleRef.value.getBoundingClientRect();
    dragRect.value.right = bodyRect.width - titleRect.width;
    dragRect.value.bottom = bodyRect.height - titleRect.height;
    preTransformX.value = transformX.value;
    preTransformY.value = transformY.value;
  }
  startedDrag.value = true;
});
watch(isDragging, () => {
  if (!isDragging) {
    startedDrag.value = false;
  }
});

watchEffect(() => {
  if (startedDrag.value) {
    transformX.value =
        preTransformX.value +
        Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right) -
        startX.value;
    transformY.value =
        preTransformY.value +
        Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom) -
        startY.value;
  }
});
const transformStyle = computed(() => {
  return {
    transform: `translate(${transformX.value}px, ${transformY.value}px)`,
  };
});

function cancel() {
  if (props.id) {
    // clearErrMsg(props.id);
    // 关闭后还原err channel
    submitErrChanel("")
  }
  props.close()
  props.modal.visible = false
}

async function ok() {
  if (props.id) {
    submitErrChanel(props.id)
  }
  try{
    await useLoadingObject(props.modal, props.confirm)()
  }finally {
    submitErrChanel("")
  }
  props.modal.visible = false
}
</script>
