import { createVNode } from './vNode'

export function h(type, props = {}, children = null) {
  return createVNode(type, props, children)
}
