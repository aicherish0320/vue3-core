import { Module } from 'vuex'
import { IGlobalState } from '@/store/index'
import { CATEGORY_TYPES, IHomeState, ISlider } from '@/typings/home'
import * as Types from '@/store/actionTypes'

const state: IHomeState = {
  currentCategory: CATEGORY_TYPES.ALL,
  sliders: [],
  lessons: {
    hasMore: true,
    loading: false,
    offset: 0,
    limit: 5,
    list: []
  }
}

const home: Module<IHomeState, IGlobalState> = {
  namespaced: true,
  state,
  mutations: {
    [Types.SET_CATEGORY](state, payload: CATEGORY_TYPES) {
      state.currentCategory = payload
    },
    [Types.SET_SLIDER_LIST](state, payload: ISlider[]) {
      state.sliders = payload
    }
  },
  actions: {
    [Types.SET_SLIDER_LIST]({ commit }) {
      const sliders: ISlider[] = [
        {
          url: 'https://scpic.chinaz.net/files/pic/pic9/202009/apic27858.jpg'
        },
        {
          url: 'https://www.keaidian.com/uploads/allimg/190424/24110307_8.jpg'
        }
      ]
      commit(Types.SET_SLIDER_LIST, sliders)
    }
  }
}

export default home
