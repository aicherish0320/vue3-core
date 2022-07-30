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

  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    setElementText: hostSetElementText,
    insert: hostInsert,
    remove: hostRemove
  } = options

  const mountElement = (vNode, container) => {
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

  const patchProps = (oldProps, newProps, el) => {
    if (oldProps !== newProps) {
      // 新的属性 需要覆盖老的
      for (const key in newProps) {
        const prev = oldProps[key]
        const next = newProps[key]
        if (prev !== next) {
          hostPatchProp(el, key, prev, next)
        }
      }
      // 老的有属性 新的没有 将老的删掉
      for (const key in oldProps) {
        if (!(key in newProps)) {
          hostPatchProp(el, key, oldProps[key], null)
        }
      }
    }
  }

  const patchChildren = (n1, n2, el) => {
    const c1 = n1.children
    const c2 = n2.children

    const prevShapeFlag = n1.shapeFlag
    const shapeFlag = n2.shapeFlag

    // 文本元素
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 老的是文本 新的是文本 -> 新的覆盖老的
      // 老的是数组 新的是文本 -> 覆盖掉老的
      if (c2 !== c1) {
        hostSetElementText(el, c2)
      }
    } else {
      // 新的是数组
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 老的是数组 -> diff 算法
      } else {
        // 老的可能是文本
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          // 移除老文本
          hostSetElementText(el, '')
        }
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 去把新的元素进行挂载
          for (let i = 0; i < c2.length; i++) {
            patch(null, c2[i], el)
          }
        }
      }
    }

    // 老的是文本 新的是数组 -> 移除老的文本 生成新的节点塞进去
    // 老的是数组 新的是数组 -> diff 算法
  }

  const patchElement = (n1, n2, container) => {
    let el = (n2.el = n1.el)
    const oldProps = n1.props || {}
    const newProps = n2.props || {}

    patchProps(oldProps, newProps, el)
    // 比较children
    patchChildren(n1, n2, el)
  }
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
        patch(prev, next, container)
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

  const isSameVNodeType = (n1, n2) => n1.type === n2.type && n1.key === n2.key

  const patch = (n1, n2, container) => {
    const { shapeFlag } = n2

    if (n1 && !isSameVNodeType(n1, n2)) {
      hostRemove(n1.el)
      n1 = null
    }
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
