import Axios from 'axios';
import apiConfigs from './apiConfigs';
const {create} = Axios;

const useAxiosRequest = () => {
  const baseURL = `${apiConfigs.BASE_URL}`;

  const Request = create({
    baseURL,
  });
  Request.interceptors.request.use(config => {
    config.params = {...config.params, appId: apiConfigs.API_KEY};
    return config;
  });
  return {
    Request,
  };
};

export default useAxiosRequest;
