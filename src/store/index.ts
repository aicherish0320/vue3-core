import { createStore } from 'vuex'
import { IHomeState } from '@/typings/home'
import home from './modules/home'

export interface IGlobalState {
  home: IHomeState
}

export default createStore<IGlobalState>({
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    home
  }
})
