import axios from 'axios';

export default () => axios.create({
  baseURL: `https://${window.location.hostname}`,
  withCredentials: true,
});
