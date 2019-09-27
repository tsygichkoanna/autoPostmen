import axios from 'axios';
import {serverURI} from '../config/urls.config';

export const getProjectList = (date, user, loader) => dispatch => {
  return axios.get(serverURI + `/api/individual-lists/${date.year}/${date.month}/${user || ''}?token=` + localStorage.jwtToken)
    .then(res => {

      dispatch({type: 'SET_LIST', payload: res.data});

      //Loader (finish)
      loader(false);
    })
    .catch((e) => {
      console.error(e);
      loader(false);
    })
};

export const saveTime = (body) => {

  const url = serverURI + `/api/individual-lists/?token=${localStorage.jwtToken}`;
  return axios.post(url,
    body).catch(err => console.log(err));
};

export const getTotalTimeAndPercents = (userTime, times, param1, value1, param2, value2) => {
  let percent = 0;
  const totalTimeForRow = times.reduce((reducer, time) => {
    if (time[param1] === value1 && time[param2] === value2) {
      const mvalue = parseFloat(time.manager_data)

      if(mvalue >= 0){
        return reducer + mvalue;
      }else{
        return reducer + parseFloat(time.user_data) || 0;
      }
    }
    return reducer;
  }, 0);
  if (totalTimeForRow) {
    if(userTime === 0){
      percent = 0
    }else{
      percent = totalTimeForRow / (userTime / 100);      
    }
  }

  return {totalTimeForRow, percent: Math.round(percent)};
};
