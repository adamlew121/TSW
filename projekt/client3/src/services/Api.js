import axios from 'axios'
import store from '@/store/store'

export default () => {
  return axios.create({
    baseURL: 'https://' + window.location.hostname + ':8081',
    headers: {
      Authorization: `Bearer ${store.state.token}`
    }
  })
}
