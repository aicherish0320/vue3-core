<template>
  <van-swipe
    v-if="sliders.length"
    :autoplay="3000"
    indicator-color="white"
    class="home-swiper"
  >
    <van-swipe-item v-for="slider in sliders" :key="slider.url">
      <img :src="slider.url" alt="img" />
    </van-swipe-item>
  </van-swipe>
</template>

<script lang="ts">
import { IGlobalState } from '@/store'
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import * as Types from '@/store/actionTypes'

export default defineComponent({
  async setup() {
    const store = useStore<IGlobalState>()
    const sliders = computed(() => store.state.home.sliders)
    if (!sliders.value.length) {
      await store.dispatch(`home/${Types.SET_SLIDER_LIST}`)
    }
    return {
      sliders
    }
  }
})
</script>

<style scoped lang="scss">
.home-swiper {
  height: 220px;
  img {
    height: 100%;
    width: 100%;
  }
}
</style>
