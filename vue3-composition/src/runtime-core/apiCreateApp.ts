import { createVNode } from './vNode'

export function createAppAPI(render) {
  return (rootComponent) => {
    const app = {
      mount(container) {
        const vNode = createVNode(rootComponent)
        render(vNode, container)
      }
    }
    return app
  }
}
