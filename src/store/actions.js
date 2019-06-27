import axios from 'axios';

const glResource = axios.create({
  baseURL: 'https://datacollector.com/api/v4/',
});

glResource.interceptors.request.use(
  config => {
    return config;
  },
  error => Promise.reject(error)
);

export default {
  updateSelectedElementId({
    commit
  }, id) {
    commit('setSelectedElementId', id);
  },
};
