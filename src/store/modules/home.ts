import { Module } from 'vuex'
import { IGlobalState } from '@/store/index'
import { CATEGORY_TYPES, IHomeState, ISlider, ILessons } from '@/typings/home'
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
    },
    [Types.SET_LOADING](state, payload: boolean) {
      state.lessons.loading = payload
    },
    [Types.SET_LESSON_LIST](state, payload: ILessons) {
      state.lessons.list = [...state.lessons.list, ...payload.list]
      state.lessons.hasMore = payload.hasMore
      state.lessons.offset = state.lessons.offset + payload.list.length
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
    },
    [Types.SET_LESSON_LIST]({ commit }) {
      if (state.lessons.loading) {
        return
      }
      if (!state.lessons.hasMore) {
        return
      }
      commit(Types.SET_LOADING, true)
      const lessons: ILessons = {
        hasMore: true,
        loading: false,
        offset: 0,
        limit: 5,
        list: [
          {
            title: 'React全栈架构',
            video: 'http://img.zhufengpeixun.cn/gee2.mp4',
            poster: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
            price: 100,
            category: 1
          },
          {
            title: 'Vue全栈架构',
            video: 'http://img.zhufengpeixun.cn/gee2.mp4',
            poster:
              'https://www.keaidian.com/uploads/allimg/190424/24110307_8.jpg',
            price: 200,
            category: 2
          },
          {
            title: 'Node全栈架构',
            video: 'http://img.zhufengpeixun.cn/gee2.mp4',
            poster:
              'https://www.keaidian.com/uploads/allimg/190424/24110307_8.jpg',
            price: 300,
            category: 3
          },
          {
            title: 'React全栈架构',
            video: 'http://img.zhufengpeixun.cn/gee2.mp4',
            poster:
              'https://www.keaidian.com/uploads/allimg/190424/24110307_8.jpg',
            price: 100,
            category: 1
          }
        ]
      }
      commit(Types.SET_LESSON_LIST, lessons)
      commit(Types.SET_LOADING, false)
    }
  }
}

export default home
