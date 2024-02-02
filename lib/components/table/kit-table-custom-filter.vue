<template>
  <div class="flex flex-col gap-1 p-1">
    <a-input
        ref="searchInput"
        :placeholder="`搜索 ${params.column.title}`"
        :value="params.selectedKeys[0]"
        style="width: 240px; display: block"
        @change="e => params.setSelectedKeys(e.target.value ? [e.target.value] : [])"
        @pressEnter="handleSearch(params.selectedKeys, params.confirm, params.column.dataIndex)"
    />
    <div class="flex gap-1">
      <a-button size="small" class="grow" @click="handleReset(params.clearFilters)">
        重置
      </a-button>
      <a-button
          type="primary"
          size="small"
          class="grow"
          @click="handleSearch(params.selectedKeys, params.confirm, params.column.dataIndex)"
      >
        <template #icon><SearchOutlined /></template>
        搜索
      </a-button>
    </div>
  </div>
</template>
<script setup>
import {SearchOutlined} from '@ant-design/icons-vue';
import {ref, onMounted} from 'vue';

const props = defineProps({
  params:{
    default: ()=>{
      return {
        setSelectedKeys: ()=>{},
        selectedKeys:[],
        confirm:()=>{},
        clearFilters:()=>{},
        column:{}
      }
    },
    type: Object
  }

})

const searchInput = ref();
const searchText = ref();
const searchedColumn = ref();

const handleSearch = (selectedKeys, confirm, dataIndex) => {
  props.params.confirm();
  searchText.value = selectedKeys[0];
  searchedColumn.value = dataIndex;
};

const handleReset = clearFilters => {
  clearFilters({ confirm: true });
  searchText.value = '';
};

onMounted(()=>{
  // searchInput.value.focus();
})
</script>