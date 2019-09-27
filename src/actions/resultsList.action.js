import axios from 'axios';
import { serverURI } from '../config/urls.config.json';

export const getResults = ({month, year}, values) => {
  const body = {
    year,
    month,
    ...values
  }
  return axios.post(`${serverURI}/api/tables/results/${year}/${month}?token=` + localStorage.jwtToken, body)
    .then((res) => res.data)
    .catch((e) => {
      console.error(e)
    })
}