<template>
  <div class="list-view">
    <van-card
      num="2"
      :price="item.price"
      :title="item.title"
      :thumb="item.poster"
      v-for="item in lessonList"
      :key="item.title"
    >
      <template #tags>
        <van-tag plain type="primary">
          {{ item.category && categoryMap.get(item.category) }}
        </van-tag>
      </template>
    </van-card>
  </div>
</template>

<script lang="ts">
import { ILesson, CATEGORY_TYPES } from '@/typings/home'
import { defineComponent, markRaw, PropType, reactive } from 'vue'

export default defineComponent({
  props: {
    lessonList: {
      type: Array as PropType<ILesson[]>
    }
  },
  setup() {
    const categoryMap = reactive(
      markRaw(
        new Map([
          [CATEGORY_TYPES.ALL, '全部课程'],
          [CATEGORY_TYPES.REACT, 'React 课程'],
          [CATEGORY_TYPES.VUE, 'Vue 课程'],
          [CATEGORY_TYPES.NODE, 'Node 课程']
        ])
      )
    )

    return {
      categoryMap
    }
  }
})
</script>

<style scoped lang="scss">
.list-view {
  padding-bottom: 50px;
}
</style>
