import { IGlobalState } from '@/store'
import { Store } from 'vuex'
import _ from 'lodash'
import { onMounted, Ref } from 'vue'

const useLoadMore = (
  refreshElm: Ref<HTMLElement | null>,
  store?: Store<IGlobalState>,
  type?: string
) => {
  function loadMore() {
    const refreshElmVal = refreshElm.value
    if (refreshElmVal) {
      const containerHeight = refreshElmVal.clientHeight
      const scrollTop = refreshElmVal.scrollTop
      const scrollHeight = refreshElmVal.scrollHeight
      if (containerHeight + scrollTop + 20 > scrollHeight) {
        console.log('触底了 >>> ', containerHeight, scrollTop, scrollHeight)
      }
    }
  }

  onMounted(() => {
    refreshElm.value?.addEventListener('scroll', _.debounce(loadMore))
  })
}

export default useLoadMore
