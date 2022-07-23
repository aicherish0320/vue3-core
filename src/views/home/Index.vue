<template>
  <HeaderView
    :category="category"
    @setCurrentCategory="setCurrentCategory"
  ></HeaderView>
  <Suspense>
    <template #default>
      <SwiperView></SwiperView>
    </template>
    <template #fallback> loading </template>
  </Suspense>
  <ListView :lessonList="lessonList"></ListView>
</template>

<script lang="ts">
import { IGlobalState } from '@/store'
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import HeaderView from './HeaderView.vue'
import ListView from './ListView.vue'
import SwiperView from './SwiperView.vue'
import useCategory from './useCategory'
import useLessonList from './useLessonList'

export default defineComponent({
  components: {
    HeaderView,
    ListView,
    SwiperView
  },
  setup() {
    const store = useStore<IGlobalState>()

    const { category, setCurrentCategory } = useCategory(store)
    const { lessonList } = useLessonList(store)

    return {
      category,
      setCurrentCategory,
      lessonList
    }
  }
})
</script>

<style scoped></style>
