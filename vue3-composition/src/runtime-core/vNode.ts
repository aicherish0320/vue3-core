export function createVNode(type, props: any = {}, children = null) {
  const vNode = {
    type,
    props,
    children,
    component: null, // 组件实例
    el: null,
    key: props.key,
    shapeFlag: true
  }
}
