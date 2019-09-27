const initialState = {
  projects: [],
  clients: [],
  works: [],
  holidays: [],
  general: [],
  times: [],
  user: null,
  start_date: null,
};

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case 'SET_LIST':{
      return {
        ...action.payload,
        projects: action.payload.projects.sort((a,b) => a.name < b.name? -1: 1 ),
        clients: action.payload.clients.sort((a,b) => a.name < b.name? -1: 1 ),
        works: action.payload.works.sort((a,b) => a.name < b.name? -1: 1 ),
      };
    }
    default: return state;
  }
}