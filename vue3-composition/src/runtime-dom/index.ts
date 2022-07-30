import { createRenderer } from '../runtime-core'
import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'

const renderOptions = { ...nodeOps, patchProp }

function ensureRenderer() {
  return createRenderer(renderOptions)
}

export function createApp(rootComponent) {
  // 根据组件创建一个渲染器
  const app = ensureRenderer().createApp(rootComponent)
  const { mount } = app
  app.mount = function (container) {
    container = document.querySelector(container)
    container.innerHTML = ''
    mount(container)
  }

  return app
}
