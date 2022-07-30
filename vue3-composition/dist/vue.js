(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Vue = {}));
})(this, (function (exports) { 'use strict';

  function computed() { }

  const isObject = (val) => typeof val === 'object' && val !== null;
  const isArray = (val) => Array.isArray(val);
  const isInteger = (key) => parseInt(key, 10) + '' === key;
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty.call(val, key);
  const hasChanged = (value, oldValue) => value !== oldValue;
  const isString = (val) => typeof val === 'string';
  const isFunction = (val) => typeof val === 'function';

  function effect(fn, options = {}) {
      const effect = createReactiveEffect(fn, options);
      if (!options.lazy) {
          effect();
      }
      return effect;
  }
  let activeEffect;
  let uid = 0;
  const effectStack = [];
  function createReactiveEffect(fn, options) {
      const effect = function () {
          if (!effectStack.includes(effect)) {
              try {
                  activeEffect = effect;
                  effectStack.push(activeEffect);
                  return fn();
              }
              catch (error) {
              }
              finally {
                  effectStack.pop();
                  activeEffect = effectStack[effectStack.length - 1];
              }
          }
      };
      effect.id = uid++;
      effect.deps = [];
      effect.options = options;
      return effect;
  }
  // { object: { key: [effect1, effect2] } }
  const targetMap = new WeakMap();
  function track(target, key) {
      if (!activeEffect)
          return;
      let depsMap = targetMap.get(target);
      if (!depsMap) {
          targetMap.set(target, (depsMap = new Map()));
      }
      let dep = depsMap.get(key);
      if (!dep) {
          depsMap.set(key, (dep = new Set()));
      }
      if (!dep.has(activeEffect)) {
          dep.add(activeEffect);
          activeEffect.deps.push(key);
      }
  }
  function trigger(target, type, key, value, oldValue) {
      const depsMap = targetMap.get(target);
      if (!depsMap)
          return;
      const run = (effects) => {
          if (effects) {
              effects.forEach((effect) => effect());
          }
      };
      if (key === 'length' && isArray(target)) {
          depsMap.forEach((dep, key) => {
              if (key === 'length' || key >= value) {
                  run(dep);
              }
          });
      }
      else {
          if (key) {
              run(depsMap.get(key));
          }
          switch (type) {
              case 'add':
                  if (isArray(target)) {
                      if (isInteger(key)) {
                          run(depsMap.get('length'));
                      }
                  }
                  break;
          }
      }
  }

  function createGetter() {
      return function get(target, key, receiver) {
          console.log('key >>> ', key);
          const ret = Reflect.get(target, key, receiver);
          track(target, key);
          if (isObject(ret)) {
              return reactive(ret);
          }
          return ret;
      };
  }
  function createSetter() {
      return function set(target, key, value, receiver) {
          const oldValue = target[key];
          // 数组新增、对象新增
          const hadKey = isArray(target) && isInteger(key)
              ? Number(key) < target.length
              : hasOwn(target, key);
          const ret = Reflect.set(target, key, value, receiver);
          if (!hadKey) {
              trigger(target, 'add', key, value);
          }
          else if (hasChanged(value, oldValue)) {
              trigger(target, 'set', key, value);
          }
          return ret;
      };
  }
  const get = createGetter();
  const set = createSetter();
  const mutableHandlers = {
      get,
      set
  };

  function reactive(target) {
      // 核心的操作就是当读取数据时进行依赖收集，修改数据的时候让effect重新执行
      return createReactiveObject(target, mutableHandlers);
  }
  const proxyMap = new WeakMap();
  function createReactiveObject(target, baseHandlers) {
      if (!isObject(target))
          return target;
      const existingProxy = proxyMap.get(target);
      if (existingProxy) {
          return existingProxy;
      }
      const proxy = new Proxy(target, baseHandlers);
      proxyMap.set(target, proxy);
      return proxy;
  }

  function ref() { }

  function createVNode(type, props = {}, children = null) {
      const shapeFlag = isString(type)
          ? 1 /* shapeFlags.ELEMENT */
          : isObject(type)
              ? 4 /* shapeFlags.STATEFUL_COMPONENT */
              : 0;
      const vNode = {
          type,
          props,
          children,
          component: null,
          el: null,
          key: props.key,
          shapeFlag // 表示虚拟节点的类型：元素、组件
      };
      if (isArray(children)) {
          vNode.shapeFlag |= 16 /* ShapeFlags.ARRAY_CHILDREN */;
      }
      else {
          vNode.shapeFlag |= 8 /* ShapeFlags.TEXT_CHILDREN */;
      }
      return vNode;
  }

  function createAppAPI(render) {
      return (rootComponent) => {
          const app = {
              mount(container) {
                  const vNode = createVNode(rootComponent);
                  render(vNode, container);
              }
          };
          return app;
      };
  }

  function createComponentInstance(vNode) {
      const instance = {
          type: vNode.type,
          props: {},
          vNode,
          render: null,
          setupState: null,
          isMounted: false // 默认组件没有挂载
      };
      return instance;
  }
  const setupComponent = (instance) => {
      setupStatefulComponent(instance);
  };
  function setupStatefulComponent(instance) {
      const Component = instance.type;
      const { setup } = Component;
      if (setup) {
          const setupResult = setup();
          handleSetupResult(instance, setupResult);
      }
  }
  function handleSetupResult(instance, setupResult) {
      if (isFunction(setupResult)) {
          instance.render = setupResult;
      }
      else {
          instance.setupState = setupResult;
      }
      finishComponentSetup(instance);
  }
  function finishComponentSetup(instance) {
      const Component = instance.type;
      if (Component.render) {
          instance.render = Component.render;
      }
      else if (!instance.render) ;
  }

  function createRenderer(options) {
      return baseCreateRenderer(options);
  }
  function baseCreateRenderer(options) {
      const render = (vNode, container) => {
          patch(null, vNode, container);
      };
      const mountElement = (vNode, container) => {
          const { createElement: hostCreateElement, patchProp: hostPatchProp, setElementText: hostSetElementText, insert: hostInsert, remove: hostRemove } = options;
          const { shapeFlag, props } = vNode;
          let el = (vNode.el = hostCreateElement(vNode.type));
          // 创建儿子
          if (shapeFlag & 8 /* ShapeFlags.TEXT_CHILDREN */) {
              hostSetElementText(el, vNode.children);
          }
          else if (shapeFlag & 16 /* ShapeFlags.ARRAY_CHILDREN */) {
              mountChildren(vNode.children, el);
          }
          if (props) {
              for (const key in props) {
                  hostPatchProp(el, key, null, props[key]);
              }
          }
          hostInsert(el, container);
      };
      const mountChildren = (children, container) => {
          for (let i = 0; i < children.length; i++) {
              patch(null, children[i], container);
          }
      };
      // 组件的挂载逻辑
      const mountComponent = (initialVNode, container) => {
          // 1. 创建组件实例 2. 找到组件的 render 方法 3. 执行 render
          const instance = (initialVNode.component =
              createComponentInstance(initialVNode));
          //  找到组件的 setup 方法
          setupComponent(instance);
          // 给组件创建一个 effect
          setupRenderEffect(instance, initialVNode, container);
      };
      function setupRenderEffect(instance, initialVNode, container) {
          effect(() => {
              if (!instance.isMounted) {
                  // 渲染
                  const subTree = (instance.subTree = instance.render());
                  patch(null, subTree, container);
                  instance.isMounted = true;
              }
              else {
                  // 更新
                  const prev = instance.subTree;
                  let next = instance.render();
                  console.log('prev >>> ', prev, next);
              }
          });
      }
      const processElement = (n1, n2, container) => {
          if (!n1) {
              mountElement(n2, container);
          }
      };
      const processComponent = (n1, n2, container) => {
          if (!n1) {
              mountComponent(n2, container);
          }
      };
      const patch = (n1, n2, container) => {
          const { shapeFlag } = n2;
          if (shapeFlag & 1 /* ShapeFlags.ELEMENT */) {
              processElement(n1, n2, container);
          }
          else if (shapeFlag & 4 /* ShapeFlags.STATEFUL_COMPONENT */) {
              processComponent(n1, n2, container);
          }
      };
      return {
          createApp: createAppAPI(render)
      };
  }

  function h(type, props = {}, children = null) {
      return createVNode(type, props, children);
  }

  const nodeOps = {
      createElement(type) {
          return document.createElement(type);
      },
      setElementText(el, text) {
          el.textContent = text;
      },
      insert(child, parent, anchor = null) {
          parent.insertBefore(child, anchor);
      },
      remove(child) {
          const parent = child.parentNode;
          if (parent) {
              parent.removeChild(child);
          }
      }
  };

  function patchClass(el, value) {
      if (!value) {
          value = '';
      }
      el.className = value;
  }
  function patchStyle(el, prev, next) {
      const style = el.style;
      if (!next) {
          el.removeAttribute('style');
      }
      else {
          for (const key in next) {
              style[key] = next[key];
          }
          if (prev) {
              for (const key in prev) {
                  if (!next[key]) {
                      style[key] = '';
                  }
              }
          }
      }
      // el.setAttribute('style', style)
  }
  function patchAttr(el, key, value) {
      if (!value) {
          el.removeAttribute(key);
      }
      else {
          el.setAttribute(key, value);
      }
  }
  function patchProp(el, key, prevVal, nextVal) {
      switch (key) {
          case 'class':
              patchClass(el, nextVal);
              break;
          case 'style':
              patchStyle(el, prevVal, nextVal);
              break;
          default:
              patchAttr(el, key, nextVal);
              break;
      }
  }

  const renderOptions = Object.assign(Object.assign({}, nodeOps), { patchProp });
  function ensureRenderer() {
      return createRenderer(renderOptions);
  }
  function createApp(rootComponent) {
      // 根据组件创建一个渲染器
      const app = ensureRenderer().createApp(rootComponent);
      const { mount } = app;
      app.mount = function (container) {
          container = document.querySelector(container);
          container.innerHTML = '';
          mount(container);
      };
      return app;
  }

  exports.computed = computed;
  exports.createApp = createApp;
  exports.createRenderer = createRenderer;
  exports.effect = effect;
  exports.h = h;
  exports.reactive = reactive;
  exports.ref = ref;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=vue.js.map
