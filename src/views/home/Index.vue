<template>
  <div class="home-container" ref="homeViewRef">
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
  </div>
</template>

<script lang="ts">
import useLoadMore from '@/hooks/useLoadMore'
import { IGlobalState } from '@/store'
import { defineComponent, ref } from 'vue'
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

    const homeViewRef = ref<null | HTMLElement>(null)
    useLoadMore(homeViewRef)

    return {
      category,
      setCurrentCategory,
      lessonList,
      homeViewRef
    }
  }
})
</script>

<style scoped>
.home-container {
  overflow-y: auto;
  height: calc(100vh - 50px);
}
</style>
