(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.VueReactivity = {}));
})(this, (function (exports) { 'use strict';

  function computed() { }

  function effect() { }

  const isObject = (val) => typeof val === 'object' && val !== null;
  const isArray = (val) => Array.isArray(val);
  const isInteger = (key) => parseInt(key, 10) + '' === key;
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty.call(val, key);
  const hasChanged = (value, oldValue) => value !== oldValue;

  function createGetter() {
      return function get(target, key, receiver) {
          const ret = Reflect.get(target, key, receiver);
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
              console.log('新增');
          }
          else if (hasChanged(value, oldValue)) {
              console.log('修改属性');
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

  exports.computed = computed;
  exports.effect = effect;
  exports.reactive = reactive;
  exports.ref = ref;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=vue.js.map
