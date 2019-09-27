import axios from 'axios';
import { serverURI } from '../config/urls.config';

export const getAllUsers = (loader) => (dispatch) => {
  fetch(serverURI + '/api/user?token=' + localStorage.jwtToken)
    .then((res) => res.json())
    .then((data) => {
      dispatch({type: 'GET_ALL_USERS', payload: data})

        //Loader (finish)
        if(loader !== undefined) {
            loader(false)
        }
    })
    .catch(err => console.log(err));
}

export const getOptions = (loader) => dispatch => {
  return axios.get(serverURI + '/api/user/options?token=' + localStorage.jwtToken)
    .then((res) => {
        dispatch({type: 'GET_OPTIONS', payload: res.data});

        //Loader (finish)
            loader(false)
      },
      (err) => {console.error(err)}
    )
}

export const addOrUpdateUser = (data) => {
  return axios.post(serverURI + '/api/user/?token=' + localStorage.jwtToken, data)
    .catch(err => console.log(err));
}

export const getUserInfo = (id) => {
  return axios.get(serverURI + '/api/user/' + id + '?token=' + localStorage.jwtToken)
    .catch(err => console.log(err));
}
export const updateUser = (data, id) => dispatch => {
  return axios.post(serverURI + '/api/user/update/' + id + '?token=' + localStorage.jwtToken, data)
    .catch(err => console.log(err));
}
export const archiveUser = (data) => dispatch => {
  return axios.post(serverURI + '/api/user/archive/' + data + '?token=' + localStorage.jwtToken, data)
    .catch(err => console.log(err));
}
export const delUser = (data) => dispatch => {
  return axios.delete(serverURI + '/api/user/' + data + '?token=' + localStorage.jwtToken)
    .catch(err => console.log(err));
}
export const updateInfo = (data)  => {
  return axios.post(serverURI + '/api/user/info?token=' + localStorage.jwtToken, data)
    .catch(err => console.log(err));
}

export const uploadFile = (data) =>{
  data.headers =  {'X-Requested-With': 'multipart/form-data'};
  return axios.post(serverURI + '/api/integration/salary?token=' + localStorage.jwtToken, data)
    .then((res)=> res.data)
    .catch(err => console.log(err));
}

export const importWorksectionInformation = async (data) => {
  return axios.get(serverURI + '/api/user/import-time-from-worksection?token=' + localStorage.jwtToken, {
    params: data
  })
  .then(({data}) => data)
  .catch(err => console.log(err));
}

export const saveWorksectionTime = async (data) => {
  return await axios.post(serverURI + '/api/integration/worksection/time/save?token=' + localStorage.jwtToken, data)
  .then(({data}) => data)
  .catch(err => console.log(err));
}

