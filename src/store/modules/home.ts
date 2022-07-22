import { Module } from 'vuex'
import { IGlobalState } from '@/store/index'
import { CATEGORY_TYPES, IHomeState } from '@/typings/home'
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
    }
  }
}

export default home
