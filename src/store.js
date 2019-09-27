import { createStore } from 'redux';
import rootReducer from './reducers';

const Store = (initialState) => {
    return createStore(rootReducer, initialState);
}
export default Store
