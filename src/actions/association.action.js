import axios from 'axios';
import {serverURI} from '../config/urls.config';

export const saveAssociations = async (data) => {
    return await axios.post(serverURI + '/api/associations?token=' + localStorage.jwtToken, data)
    .then(({data}) => data)
    .catch(err => console.log(err));
}