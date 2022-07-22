import { Store } from 'vuex'
import { IGlobalState } from '@/store'
import { CATEGORY_TYPES } from '@/typings/home'
import * as Types from '@/store/actionTypes'
import { computed } from 'vue'

const useCategory = (store: Store<IGlobalState>) => {
  const category = computed(() => store.state.home.currentCategory)
  const setCurrentCategory = (category: CATEGORY_TYPES) => {
    store.commit(`home/${Types.SET_CATEGORY}`, category)
  }

  return {
    category,
    setCurrentCategory
  }
}

export default useCategory
