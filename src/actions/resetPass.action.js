import axios from 'axios';
import { serverURI } from '../config/urls.config'

export function reset(email) {
    return axios.post(serverURI+'/api/reset-password', {email})
        .catch(err => console.log(err));
}
