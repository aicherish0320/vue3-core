import { createStore } from 'vuex'

import home, { IHomeState } from './modules/home'

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
