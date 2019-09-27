const InitialState = {
  clients: [],
  users: [],
  times: [],
  general: [],
  holidays: []
};

export default (state = InitialState, action) => {
  switch (action.type) {
    case 'SET_SLO_AND_USERS':
      return {
        clients: Object.values(action.payload.clients).sort((a,b) => a.name < b.name? -1: 1 ),
        users: action.payload.users.sort((a,b) => a.surname < b.surname? -1: 1 ),
        times: action.payload.times,
        holidays: action.payload.holidays,
        general: action.payload.general,
      };
    default:
      return state;

  }
}