<template>
  {{ category }}
  <HeaderView></HeaderView>
  <SwiperView></SwiperView>
  <ListView></ListView>
</template>

<script lang="ts">
import { IGlobalState } from '@/store'
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import HeaderView from './HeaderView.vue'
import ListView from './ListView.vue'
import SwiperView from './SwiperView.vue'
export default defineComponent({
  components: {
    HeaderView,
    ListView,
    SwiperView
  },
  setup() {
    const store = useStore<IGlobalState>()
    const category = computed(() => store.state.home.currentCategory)

    return {
      category
    }
  }
})
</script>

<style scoped></style>
