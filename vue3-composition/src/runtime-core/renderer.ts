import { createAppAPI } from './apiCreateApp'

export function createRenderer(options) {
  return baseCreateRenderer(options)
}

function baseCreateRenderer(options) {
  const render = (vNode, container) => {}
  return {
    createApp: createAppAPI(render)
  }
}
