import axios from 'axios';
import { serverURI } from '../config/urls.config'

export const getAllPositions = (loader) => dispatch => {
    return axios.get(serverURI + '/api/position?token=' + localStorage.jwtToken)
        .then((res) => {
            dispatch({type: 'GET_ALL_POSITIONS', payload: res.data});
            loader(false);
        })
        .catch(err => console.log(err));
};

export const editPosition = (data) => {
  return axios.post(serverURI+'/api/position/store?token=' + localStorage.jwtToken, data)
    .catch(err => console.log(err));
};
export const delPos = (data) => dispatch => {
  return axios.delete(serverURI+'/api/position/'+data+'?token=' + localStorage.jwtToken)
    .catch(err => console.log(err));
};

export const getAllDepartments = (loader) => dispatch => {
  return axios.get(serverURI+'/api/department/?token=' + localStorage.jwtToken)
    .then(
      (res) =>{
        loader(false);
        dispatch({type: 'SET_DEPARTMENTS', payload: res.data});
      },
      (err) => {
        loader(false);
        console.error(err);
      }
    );
}

export const getPositionInfo = (id) =>
 axios.get(serverURI+'/api/position/'+id+'?token=' + localStorage.jwtToken)
  .then(res => res.data)
  .catch((err)=> console.error(err));


export const savePosition = (data, id) => dispatch => {
  return axios.post(serverURI+'/api/position/update/'+id+'?token=' + localStorage.jwtToken, data)
  .catch(err => console.log(err));
}
