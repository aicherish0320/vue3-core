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
      ({
          type,
          props,
          children,
          component: null,
          el: null,
          key: props.key,
          shapeFlag: true // 表示虚拟节点的类型：元素、组件
      });
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

  function createRenderer(options) {
      return baseCreateRenderer();
  }
  function baseCreateRenderer(options) {
      const render = (vNode, container) => { };
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

  Object.assign(Object.assign({}, nodeOps), { patchProp });
  function ensureRenderer() {
      return createRenderer();
  }
  function createApp(rootComponent) {
      console.log(rootComponent);
      // 根据组件创建一个渲染器
      const app = ensureRenderer().createApp(rootComponent);
      const { mount } = app;
      app.mount = function (container) {
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
