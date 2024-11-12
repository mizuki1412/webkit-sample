<template>
  <div class=".kit-color-picker" ref="picker"></div>
</template>

<script setup>
/***
 * 颜色选择组件
 * https://github.com/simonwep/pickr
 */
import {onMounted, watch, ref} from "vue";
import Pickr from "@simonwep/pickr";

const modelValue = defineModel()

const picker = ref()
const pickr = ref();
function init(){
  pickr.value = Pickr.create({
    el: picker.value,
    theme: 'nano', // or 'monolith', or 'nano'
    swatches: [
      'rgb(244,67,54)',
      'rgb(233,30,99)',
      'rgb(156,39,176)',
      'rgb(103,58,183)',
      'rgb(63,81,181)',
      'rgb(33,150,243)',
      'rgb(3,169,244)',
      'rgb(0,188,212)',
      'rgb(0,150,136)',
      'rgb(76,175,80)',
      'rgb(139,195,74)',
      'rgb(205,220,57)',
      'rgb(255,235,59)',
      'rgba(255, 193, 7, 1)'
    ],
    components: {
      // Main components
      preview: true,
      opacity: true,
      hue: true,
      // Input / output Options
      interaction: {
        hex: true,
        rgba: true,
        hsla: true,
        hsva: true,
        cmyk: true,
        input: true,
        clear: true,
        cancel: true,
        save: true
      }
    },
    i18n:{
      'btn:save': '保存',
      'btn:cancel': '取消',
      'btn:clear': '清空',
    }
  });
  pickr.value.options.default = modelValue.value
  pickr.value.on('init', instance => {
    // console.log('Event: "init"', instance);
  }).on('hide', instance => {
    // console.log('Event: "hide"', instance);
  }).on('show', (color, instance) => {
    // console.log('Event: "show"', color, instance);
    pickr.value.options.default = modelValue.value
  }).on('save', (color, instance) => {
    // console.log('Event: "save"', color, instance);
    modelValue.value = color?color.toHEXA().toString():null
    pickr.value.hide()
  }).on('clear', instance => {
    // console.log('Event: "clear"', instance);
  }).on('change', (color, source, instance) => {
    // console.log('Event: "change"', color, source, instance);
  }).on('changestop', (source, instance) => {
    // console.log('Event: "changestop"', source, instance);
  }).on('cancel', instance => {
    pickr.value.hide()
  }).on('swatchselect', (color, instance) => {
    // console.log('Event: "swatchselect"', color, instance);
  });
}

watch(modelValue, ()=>{
  if(pickr.value) {
    pickr.value.options.default = modelValue.value
    pickr.value.setColor(modelValue.value)
  }
})
onMounted(init)

</script>
