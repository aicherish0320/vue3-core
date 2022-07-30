import { ShapeFlags } from '@vue/shared'
import { effect } from '../reactivity'
import { createAppAPI } from './apiCreateApp'
import { createComponentInstance, setupComponent } from './component'

export function createRenderer(options) {
  return baseCreateRenderer(options)
}

function baseCreateRenderer(options) {
  const render = (vNode, container) => {
    patch(null, vNode, container)
  }

  const mountElement = (vNode, container) => {
    const {
      createElement: hostCreateElement,
      patchProp: hostPatchProp,
      setElementText: hostSetElementText,
      insert: hostInsert,
      remove: hostRemove
    } = options
    const { shapeFlag, props } = vNode
    let el = (vNode.el = hostCreateElement(vNode.type))

    // 创建儿子
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, vNode.children)
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vNode.children, el)
    }

    if (props) {
      for (const key in props) {
        hostPatchProp(el, key, null, props[key])
      }
    }

    hostInsert(el, container)
  }
  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      patch(null, children[i], container)
    }
  }
  const patchElement = (n1, n2, container) => {}
  // 组件的挂载逻辑
  const mountComponent = (initialVNode, container) => {
    // 1. 创建组件实例 2. 找到组件的 render 方法 3. 执行 render
    const instance = (initialVNode.component =
      createComponentInstance(initialVNode))
    //  找到组件的 setup 方法
    setupComponent(instance)
    // 给组件创建一个 effect
    setupRenderEffect(instance, initialVNode, container)
  }
  function setupRenderEffect(instance, initialVNode, container) {
    effect(() => {
      if (!instance.isMounted) {
        // 渲染
        const subTree = (instance.subTree = instance.render())
        patch(null, subTree, container)
        instance.isMounted = true
      } else {
        // 更新
        const prev = instance.subTree
        let next = instance.render()
        console.log('prev >>> ', prev, next)
      }
    })
  }
  const updateComponent = (n1, n2, container) => {}

  const processElement = (n1, n2, container) => {
    if (!n1) {
      mountElement(n2, container)
    } else {
      patchElement(n1, n2, container)
    }
  }
  const processComponent = (n1, n2, container) => {
    if (!n1) {
      mountComponent(n2, container)
    } else {
      updateComponent(n1, n2, container)
    }
  }

  const patch = (n1, n2, container) => {
    const { shapeFlag } = n2

    if (shapeFlag & ShapeFlags.ELEMENT) {
      processElement(n1, n2, container)
    } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      processComponent(n1, n2, container)
    }
  }

  return {
    createApp: createAppAPI(render)
  }
}
