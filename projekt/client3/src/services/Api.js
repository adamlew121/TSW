import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: 'https://' + window.location.hostname,
    withCredentials: true
  })
}
