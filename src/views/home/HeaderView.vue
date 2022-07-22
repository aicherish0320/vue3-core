<template>
  <div class="header-view">
    <img src="@/assets/logo.png" alt="Logo" />
    <van-dropdown-menu>
      <van-dropdown-item
        :model-value="category"
        :options="options"
        @change="change"
      ></van-dropdown-item>
    </van-dropdown-menu>
  </div>
</template>

<script lang="ts">
import { CATEGORY_TYPES } from '@/typings/home'
import { defineComponent, PropType, reactive, toRefs } from 'vue'

export default defineComponent({
  props: {
    category: {
      type: Number as PropType<CATEGORY_TYPES>
    }
  },
  emits: ['setCurrentCategory'],
  setup(pros, { emit }) {
    const state = reactive({
      options: [
        {
          text: '全部课程',
          value: CATEGORY_TYPES.ALL
        },
        {
          text: 'React 课程',
          value: CATEGORY_TYPES.REACT
        },
        {
          text: 'Vue 课程',
          value: CATEGORY_TYPES.VUE
        },
        {
          text: 'Node 课程',
          value: CATEGORY_TYPES.NODE
        }
      ]
    })
    const change = (value: CATEGORY_TYPES) => {
      emit('setCurrentCategory', value)
    }
    return {
      ...toRefs(state),
      change
    }
  }
})
</script>

<style lang="scss">
.header-view {
  height: 48px;
  background: #2a2a2a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  img {
    height: 40px;
  }
  .van-dropdown-menu__title {
    color: #fff;
  }
  .van-dropdown-menu__bar {
    background: #2a2a2a;
    box-shadow: none;
  }
}
</style>
