<template>
  <div v-loading="loading">
    <div class="flex gap-1">
      <el-upload
          action=""
          :show-file-list="false"
          :http-request="importJson">
        <el-button type="primary">导入JSON</el-button>
      </el-upload>
      <el-button @click="download">下载json</el-button>
      <el-button @click="print">打印json</el-button>
      <el-button @click="initCanvas">重置</el-button>
      <el-button type="success" @click="showAdd">增加元素</el-button>
      <el-button type="warning" @click="del">删除</el-button>
      <el-button type="success" @click="display">展示</el-button>
    </div>
    <canvas id="c" width="900" height="300" class="mt-2"></canvas>
    <el-divider>展示区</el-divider>
    <div class="w-[900px] h-[300px]">
      <kit-fabric-show v-if="displayObjs" :objects="displayObjs"></kit-fabric-show>
    </div>
    <kit-modal :modal="addModal" :confirm="add">
      <template #title>增加元素</template>
      <el-form ref="form" label-width="100px" :model="addModal.data">
        <el-form-item label="类型：" prop="type">
          <el-select v-model="addModal.data.type" filterable>
            <el-option label="图片" :value="1"></el-option>
            <el-option label="文字" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <el-input v-model="addModal.data.content"></el-input>
        </el-form-item>
        <el-form-item label="大小：" prop="content" v-if="addModal.data.type===2">
          <el-input-number v-model="addModal.data.size"></el-input-number>
        </el-form-item>
      </el-form>
    </kit-modal>
  </div>
</template>

<script setup>
/**
 * fabric 编辑器
 * http://fabricjs.com/docs/global.html
 */
import {fabric} from 'fabric'
import {onMounted, ref} from "vue";
import {useLoading} from "../../../lib/service";
import {ElMessage} from "element-plus";

const canvas = ref({})
const loading = ref(false);
const panning = ref(false);
const rect = ref({})
const addModal = ref({
  visible:false,
  loading: false,
  data: undefined
})
// 展示用的objects
const displayObjs = ref()

onMounted(useLoading(loading, async () => {
  //画布初始化
  canvas.value = new fabric.Canvas('c', {
    backgroundColor: '#ffffff',
  });
  initCanvas()
  //绕鼠标放缩
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
    // 未选中任何对象时，点击画布可以移动。但此时会和放大缩小冲突?，在显示的时候可以使用 todo 元素放大拉伸失败，需要多选后才行？
    // !canvas.value.getActiveObject()
    // ctr键按下后才有效果
    if (e.e.ctrlKey) {
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

}))

function initCanvas(){
  for(let e of canvas.value.getObjects()) {
    canvas.value.remove(e)
  }
  //画线
  const axios = [
    {x:50,y:100},
    {x:200,y:200},
    {x:250,y:100}
  ]
  for(let i =0 ;i<2;i++){
    let e = new fabric.Line([axios[i].x,axios[i].y,axios[i+1].x,axios[i+1].y],{
      stroke: 'red',
      // selectable:false,//无法选中
    })
    canvas.value.add(e)
  }
  var red = new fabric.Rect({
    top: 100, left: 0, width: 80, height: 50, fill: 'red' });
  var blue = new fabric.Rect({
    top: 0, left: 100, width: 50, height: 70, fill: 'blue' });
  var green = new fabric.Rect({
    top: 100, left: 100, width: 60, height: 60, fill: 'green' });
  canvas.value.add(red, blue, green)
}

function download() {
  //创建元素
  let ele = document.createElement('a');
  //设置下载文件名
  ele.download = "fabric.json";
  //隐藏元素
  ele.style.display = "none";
  //字符内容转变成blob地址
  let blob = new Blob([JSON.stringify(canvas.value.toDatalessJSON())]);
  //如果是链接，这里也可以直接设置链接地址
  ele.href = URL.createObjectURL(blob);
  document.body.appendChild(ele);
  //模拟点击
  ele.click();
  //移除元素
  document.body.removeChild(ele);
}

/**
 * 格式为： {objects:[]}
 */
async function importJson(option) {
  const reader = new FileReader()
  reader.readAsText(option.file,'utf8')
  reader.onload = ()=>{
    let data = JSON.parse(reader.result.toString())
    if(!data || !data.objects){
      ElMessage.error("json解析错误，未包含objects")
      return
    }
    canvas.value.loadFromJSON(JSON.stringify({
      version: "5.2.0",
      background: '#f4f9ff',
      objects: data.objects
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
    canvas.value.setZoom(canvas.value.width / 1500)
  }
}

function print() {
  console.log(canvas.value.getObjects())
}

function del() {
  canvas.value.remove(canvas.value.getActiveObject())
}

function display(){
  displayObjs.value = canvas.value.toDatalessJSON().objects
}

function move() {
  rect.value.animate('left', '+=50', {
    duration: 1000,
    onChange: canvas.value.renderAll.bind(canvas.value),
    onComplete: function () {
      console.log("播放结束!");
    },
    easing: fabric.util.ease.easeInCubic
  });
}

async function light() {
  function white() {
    rect.value.animate('opacity', 0.1, {
      duration: 1000,
      onChange: canvas.value.renderAll.bind(canvas.value),
      onComplete: function () {
        console.log("透明!")
        black()
      },
      easing: fabric.util.ease.easeInCubic,
    })
  }

  function black() {
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(
            rect.value.animate('opacity', 1, {
              duration: 1000,
              onChange: canvas.value.renderAll.bind(canvas.value),
              easing: fabric.util.ease.easeInCubic,
              onComplete: function () {
                console.log("恢复!");
                white()
              },
            })
        )
      }, 1000);
    })
  }

  white()
}

async function showAdd(){
  addModal.value = {
    visible:true,
    data: {}
  }
}

async function add(){
  if(!addModal.value.data.type){
    ElMessage.error("请填写完整")
    return
  }
  switch (addModal.value.data.type){
    case 1:
      fabric.Image.fromURL(addModal.value.data.content, function(oImg) {

        canvas.value.add(oImg);
      });
        // imgInstance.scale(0.5)
        // imgInstance.selectable =false
      break
    case 2:
      let o={fontSize:15}
      if(addModal.value.data.size){
        o.fontSize=addModal.value.data.size
      }
      canvas.value.add(new fabric.IText(addModal.value.data.content,o))
      break
  }
  addModal.value.visible = false
}

</script>
