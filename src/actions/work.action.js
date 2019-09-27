import axios from 'axios';
import {serverURI} from '../config/urls.config';

export const getWorks = () => 
  axios.get(serverURI + '/api/works?token=' + localStorage.jwtToken)
  .catch(err => console.log(err));

export const saveOrUpdateWork = (data) => 
  axios.post(serverURI + '/api/works?token=' + localStorage.jwtToken, data)
      .catch(err => console.log(err));
      
export const deleteWork = (id) => 
  axios.delete(serverURI + `/api/works/${id}?token=` + localStorage.jwtToken)
      .catch(err => console.log(err));
