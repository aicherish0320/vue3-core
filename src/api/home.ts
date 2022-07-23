import axios from 'axios'

export function getSlider<T>() {
  return axios.get<T, T>('/slider/list')
}
