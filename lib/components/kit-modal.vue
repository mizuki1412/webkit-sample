<template>
  <a-modal
      :open="visible"
      @update:open="handleOpenUpdate"
      :width="width"
      :ok-text="confirmText"
      :cancel-text="cancelText"
      :confirm-loading="loading"
      :mask-closable="maskClosable"
      :keyboard="closable"
      :closable="closable"
      :mask-style="maskStyle"
      :modal-style="modalStyle"
      :after-close="handleCancel"
      :panel-ref="setPanelRef"
      v-bind="$attrs"
      @cancel="handleCancel"
      @ok="handleOk">
    <template #title>
      <div ref="modalTitleRef" class="flex items-center justify-center w-full cursor-move">
        <slot name="title"/>
      </div>
    </template>
    <a-spin :spinning="loading">
      <div class="max-h-[71vh] w-full overflow-auto">
        <slot/>
      </div>
    </a-spin>
    <KitErrChannel v-if="channelId" class="mt-2" :id="channelId"/>
    <template v-if="footer === false" #footer/>
    <template v-else-if="footer" #footer>
      <slot name="footer"/>
    </template>
  </a-modal>
</template>

<script setup>
import {ref, watch} from "vue"
import {submitErrChanel} from "../store"
import KitErrChannel from "./kit-err-channel.vue"
import {useDraggable} from "@vueuse/core"

const props = defineProps({
  visible: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  width: { type: String, default: '40%' },
  confirm: { type: Function, default: async () => {} },
  close: { type: Function, default: () => {} },
  closable: { type: Boolean, default: true },
  maskClosable: { type: Boolean, default: false },
  confirmText: { type: String, default: '确定' },
  cancelText: { type: String, default: '取消' },
  footer: { type: [Boolean, Object], default: undefined },
  channelId: { type: String, default: null },
  maskStyle: {
    type: Object,
    default: () => ({ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }),
  },
  modalStyle: {
    type: Object,
    default: () => ({
      borderRadius: '14px',
      border: '1px solid rgba(0, 0, 0, 0.06)',
      boxShadow: '0 16px 48px rgba(0, 0, 0, 0.16)',
      overflow: 'hidden',
    }),
  },
})

const emit = defineEmits(['update:visible', 'update:loading'])

const modalTitleRef = ref()
const panelEl = ref()
const { x, y, isDragging } = useDraggable(modalTitleRef)

watch(isDragging, (val) => { if (!val) startedDrag.value = false })

const startX = ref(0)
const startY = ref(0)
const startedDrag = ref(false)
const offsetX = ref(0)
const offsetY = ref(0)
const prevX = ref(0)
const prevY = ref(0)
const bounds = ref({ right: 0, bottom: 0 })

watch([x, y], () => {
  if (!startedDrag.value) {
    startX.value = x.value
    startY.value = y.value
    const bodyRect = document.body.getBoundingClientRect()
    const titleRect = modalTitleRef.value.getBoundingClientRect()
    bounds.value.right = bodyRect.width - titleRect.width
    bounds.value.bottom = bodyRect.height - titleRect.height
    prevX.value = offsetX.value
    prevY.value = offsetY.value
  }
  startedDrag.value = true
  offsetX.value = prevX.value + Math.min(Math.max(0, x.value), bounds.value.right) - startX.value
  offsetY.value = prevY.value + Math.min(Math.max(0, y.value), bounds.value.bottom) - startY.value
  if (panelEl.value) {
    panelEl.value.style.transform = `translate(${offsetX.value}px, ${offsetY.value}px)`
  }
})

function setPanelRef(el) {
  panelEl.value = el
  if (el && (offsetX.value || offsetY.value)) {
    el.style.transform = `translate(${offsetX.value}px, ${offsetY.value}px)`
  }
}

function handleCancel() {
  if (props.channelId) submitErrChanel('')
  props.close()
}

function handleOpenUpdate(val) {
  if (!val) {
    if (props.channelId) submitErrChanel('')
    props.close()
  }
  emit('update:visible', val)
}

async function handleOk() {
  if (props.channelId) submitErrChanel(props.channelId)
  emit('update:loading', true)
  let shouldClose = true
  try {
    const result = await props.confirm()
    if (result === false) shouldClose = false
  } catch {
    shouldClose = false
  } finally {
    emit('update:loading', false)
  }
  if (shouldClose) emit('update:visible', false)
}
</script>