import { SET_CURRENT_USER } from '../actions/types';

const initialState = {
  isAuthenticated: false,
  user: {}
};

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case SET_CURRENT_USER:{
        return {
            isAuthenticated: !!action.payload.isSuccess,
            user: action.payload.user
        };
    }
    case "LOGOUT":{
      return initialState;
    }
    default: return state;
  }
}
 
