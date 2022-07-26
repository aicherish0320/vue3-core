import { isObject, isString, shapeFlags, isArray } from '../shared'
import { ShapeFlags } from '@vue/shared'

export function createVNode(type, props: any = {}, children = null) {
  const shapeFlag = isString(type)
    ? shapeFlags.ELEMENT
    : isObject(type)
    ? shapeFlags.STATEFUL_COMPONENT
    : 0

  const vNode: any = {
    type,
    props,
    children,
    component: null, // 组件实例
    el: null,
    key: props.key,
    shapeFlag: true // 表示虚拟节点的类型：元素、组件
  }

  if (isArray(children)) {
    vNode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  } else {
    vNode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  }
}
