import axios from 'axios'
import { serverURI } from '../config/urls.config'
// import setAuthorizationToken from '../utils/setAuthorizationToken';
import { SET_CURRENT_USER } from './types'

export function logout () {
  return dispatch => {
    if (localStorage.jwtToken) {
      localStorage.removeItem('jwtToken')
      console.log('remove Token')
      dispatch({type: 'LOGOUT'})

    } else {
      dispatch({type: 'LOGOUT'})
      localStorage.removeItem('jwtToken')
      console.log('you are Not Auth')
    }
  }
}

export function login (data) {
  return axios.post(serverURI + '/api/login', data)
    .then(res => {
      const isSuccess = res.data.success
      if (!isSuccess) {
        localStorage.removeItem('jwtToken')
        throw new Error(res.data.error)
      }
      const token = res.data.data.token
      const user = res.data.data.user_info
      localStorage.setItem('jwtToken', token)

      return {
        type: SET_CURRENT_USER,
        payload: {isSuccess, user}
      }
    })
}

export function getCurrentUser () {
  return axios.get(serverURI + '/api/me?token=' + localStorage.jwtToken)
    .then(res => {
      if (res.statusText !== 'OK') {
        throw new Error('Пользователь не авторизован')
      }
      const user = res.data
      return {type: SET_CURRENT_USER, payload: {isSuccess: true, user}}
    })
}
