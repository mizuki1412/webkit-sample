<template>
  <div class="w-full h-full" ref="container">
    <canvas :id="'fabric-canvas-'+id"></canvas>
  </div>
</template>

<script setup>
/***
 * fabric 展示组件
 */
import {fabric} from "fabric";
import {onMounted, ref, watch} from "vue";

const props = defineProps({
  id:{
    type: Number,
    default:0
  },
  objects: {
    type: Array,
    default: ()=>[],
  },
  backgroundColor:{
    type: String,
    default: '#d4e6ff'
  }
})
const canvas = ref({})
const panning = ref()
const container = ref()
const first = ref(false)

function initObjs(){
  let topMax=undefined, leftMax=undefined,topMin=undefined,leftMin = undefined
  let firstFlag = props.objects && props.objects.length>0 && !first.value
  if(firstFlag){
    // 画布长宽
    let width = window.getComputedStyle(container.value, null)["width"]
    let height = window.getComputedStyle(container.value, null)["height"]
    canvas.value.setWidth(parseInt(width))
    canvas.value.setHeight(parseInt(height))
  }
  for(let e of props.objects){
    // 元素不可选中
    e.selectable = false
    // 缩放自适应：取元素中最大left和top
    if(firstFlag){
      if(topMax===undefined){
        topMax = e["top"]+e["height"]
        leftMax = e["left"]+e["width"]
        topMin = e["top"]
        leftMin = e["left"]
        continue
      }
      if(e["top"]<topMin){
        topMin = e["top"]
      }
      if(e["left"]<leftMin){
        leftMin = e["left"]
      }
      if(e["top"]+e["height"]>topMax){
        topMax = e["top"]+e["height"]
      }
      if(e["left"]+e["width"]>leftMax){
        leftMax = e["left"]+e["width"]
      }
    }
  }
  // 图形所在的有效区域，包含边距 todo 按理应该是leftMin*2
  let objWidth = Math.abs(leftMax-leftMin)+Math.abs(leftMin*1/3)
  let objHeight = Math.abs(topMax-topMin)+Math.abs(topMin*1/3)

  canvas.value.loadFromJSON(JSON.stringify({
    version: "5.2.1",
    background: props.backgroundColor,
    objects: props.objects
  }), canvas.value.renderAll.bind(canvas.value), function (o, object) {
    object.toObject = (function (toObject) {
      return function () {
        return fabric.util.object.extend(toObject.call(this), {
          __id: o.__id,
          __type: o.__type
        })
      }
    })(object.toObject)
  })
  if(firstFlag) {
    // 根据宽高比
    if (objWidth * canvas.value.height > objHeight * canvas.value.width) {
      // 自适应-缩放
      canvas.value.zoomToPoint({x: 0, y: 0}, canvas.value.width / objWidth)
      // 自适应-移动中心点-y轴
      canvas.value.relativePan(new fabric.Point(0, canvas.value.height / 2 - (canvas.value.width * objHeight / objWidth) / 2));
    } else if (objWidth * canvas.value.height < objHeight * canvas.value.width) {
      // 自适应-缩放
      canvas.value.zoomToPoint({x: 0, y: 0}, canvas.value.height / objHeight)
      // todo 缩放的有点多
      // console.log(canvas.value.height/objHeight)
      // 自适应-移动中心点-x轴
      canvas.value.relativePan(new fabric.Point(canvas.value.width / 2 - (canvas.value.height * objWidth / objHeight) / 2, 0));
    } else {
      canvas.value.zoomToPoint({x: 0, y: 0}, canvas.value.width / objWidth)
    }
    first.value = true
  }
}

watch(()=>props.objects, initObjs)
onMounted(function (){
  canvas.value = new fabric.Canvas('fabric-canvas-'+props.id);
  canvas.value.on('mouse:wheel', function (opt) {
    let delta = opt.e.deltaY;
    let zoom = canvas.value.getZoom();
    zoom *= 0.999 ** delta;
    // 最大最小放大倍数
    if (zoom > 5) zoom = 5;
    if (zoom < 0.2) zoom = 0.2;
    canvas.value.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
  });
  canvas.value.on('mouse:down', function (e) {
    if (!canvas.value.getActiveObject()) {
      panning.value = true;
      canvas.value.selection = false;
    }
  });
  //鼠标抬起
  canvas.value.on('mouse:up', function (e) {
    panning.value = false;
    canvas.value.selection = true;
  });
  //鼠标移动
  canvas.value.on('mouse:move', function (e) {
    if (panning.value && e && e.e) {
      let delta = new fabric.Point(e.e.movementX, e.e.movementY);
      canvas.value.relativePan(delta);
    }
  });
  // group select
  canvas.value.selection = false
  initObjs()
})
</script>
