import {Modal} from "antdv-next";
import {createVNode} from "vue";
import {ExclamationCircleOutlined} from "@antdv-next/icons";

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