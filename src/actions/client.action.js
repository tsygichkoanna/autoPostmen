import axios from 'axios';
import {serverURI} from '../config/urls.config';

export const getAllClients = (loader) => dispatch =>
    axios.get(serverURI + '/api/clients?token=' + localStorage.jwtToken)
        .then(
            (res) => {
                dispatch({type: 'GET_ALL_CLIENTS', payload: res.data});
                loader(false);
            }
        )
        .catch(err => console.log(err));

export const getDirectionsAndDepartments = (loader) => dispatch =>
    axios.get(serverURI + '/api/clients/create?token=' + localStorage.jwtToken)
        .then((res) => {
                dispatch({type: 'GET_DIRECTIONS_DEPARTMENTS', payload: res.data, cache_dd: true});
                loader(false);
            }
        )
        .catch(err => console.log(err));

export const addProject = (data) => dispatch => dispatch({type: 'ADD_PROJECT', payload: data});
export const setProjects = (data) => dispatch => dispatch({type: 'SET_PROJECTS_CLIENTS', payload: data});
export const addNewProject = (data) => dispatch => dispatch({type: 'ADD_NEW_PROJECT', payload: data});
export const delProject = (data) => dispatch => dispatch({type: 'DEL_PROJECT', payload: data});
export const clearProjList = () => dispatch => dispatch({type: 'CLEAR_PROJLIST', payload: []});

export const addNewClient = (client) => dispatch => axios.post(serverURI + '/api/clients/?token=' + localStorage.jwtToken, client);
export const delClient = (data) => dispatch => axios.delete(serverURI + '/api/clients/' + data + '?token=' + localStorage.jwtToken);

export const getClientInfo = (id) => 
    axios.get(serverURI + '/api/clients/' + id + '?token=' + localStorage.jwtToken)
        .then(res => res.data)
        .catch(err => console.log(err));
