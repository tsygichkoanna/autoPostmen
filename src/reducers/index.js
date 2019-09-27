import user from './user.reducer';
import auth from './auth.reducer';
import client from './client.reducer';
import position from './position.reducer';
import list from './lists.reducer';
import slo from './slo.reducer';
import projectsList from './projectsList.reducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    user,
    auth,
    client,
    position,
    list,
    slo,
    projectsList
});

export default rootReducer
