import axios from 'axios';
import { serverURI } from '../config/urls.config';

export const getSLO = ({month, year}, loader, department = null) => dispatch => {

    const url = `${serverURI}/api/tables/slo/${year}/${month}?token=` + localStorage.jwtToken;

    return axios.get(url, {
      params: {
        department: department
      }
    })
    .then((res) => {
      dispatch({type: 'SET_SLO_AND_USERS', payload: res.data});

      //Loader (finish)
        loader(false)
    })
    .catch((e) => {
      console.error(e);
    })
};

