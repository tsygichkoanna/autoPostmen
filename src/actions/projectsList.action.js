import axios from 'axios'
import { serverURI } from '../config/urls.config'

export const getProjectsList = (loader) => dispatch => {
  return axios.get(serverURI + '/api/tables/projects?token=' + localStorage.jwtToken)
    .then((res) => {
      dispatch({type: 'SET_PROJECTS', payload: res.data});
        //Loader (finish)
        loader(false)
    })
    .catch((e) => {
      console.error(e)
    })
}

export const getProjectList = (project, selectedType, selectedNumber) => {
  return axios.get(serverURI + `/api/tables/project/${project}/${selectedType}/${selectedNumber}?token=` +
    localStorage.jwtToken)
    .then((res) => res.data)
    .catch((e) => {
      console.error(e)
    })
}

export const setTimes = (payload) => dispatch => {
    dispatch({type: 'SET_TIMES', payload})
}