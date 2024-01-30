import {Modal} from "ant-design-vue";
import {createVNode} from "vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";

export function useConfirm(title="", okFunc=async function (){}){
  Modal.confirm({
    title,
    icon: createVNode(ExclamationCircleOutlined),
    onOk() {
      return okFunc()
    },
    onCancel() {},
  });
}