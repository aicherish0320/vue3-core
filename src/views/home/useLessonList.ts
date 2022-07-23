import { computed, onMounted } from 'vue'
import { Store } from 'vuex'
import * as Types from '@/store/actionTypes'
import { IGlobalState } from '@/store'

const useLessonList = (store: Store<IGlobalState>) => {
  const lessonList = computed(() => store.state.home.lessons.list)
  onMounted(() => {
    if (!lessonList.value.length) {
      store.dispatch(`home/${Types.SET_LESSON_LIST}`)
    }
  })

  return {
    lessonList
  }
}

export default useLessonList
