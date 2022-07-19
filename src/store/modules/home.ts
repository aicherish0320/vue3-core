import { IGlobalState } from './../index'
import { CATEGORY_TYPES } from '@/typings/home'
import { Module } from 'vuex'

interface ISlider {
  url: string
}

interface ILesson {
  title: string
  video: string
  poster: string
  price: number
  category?: string
}

interface ILessons {
  hasMore: boolean
  loading: boolean
  offset: number
  limit: number
  list: ILesson[]
}

export interface IHomeState {
  currentCategory: CATEGORY_TYPES
  sliders: ISlider[]
  lessons: ILessons
}

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
  state
}

export default home
