# Vue3 核心应用
## Vue2 VS Vue3
- Vue2.0 采用 flow 进行编写，而 3.0 源码全部采用 TypeScript 进行开发，对 TypeScript 支持友好
- 源码体积优化：移除部分 API，使用 tree-shaking
- 数据劫持优化：Vue3采用 Proxy，性能大大提升
- 编译优化：Vue3 实现了静态模板分析，重写 diff 算法
- Composition API：整合业务代码的逻辑，提取公共逻辑（Vue2 采用 mixin，命名冲突、来源不清晰）
- 自定义渲染器：可以用来创建自定义的渲染器，改写 Vue 底层渲染逻辑
- 新增 Fragment Teleport Suspense 组件
