const InitialState = {
  projects: [],
  users: [],
  times: []
};

export default (state = InitialState, action) => {
  switch (action.type) {
    case 'SET_PROJECTS':
      return {
        projects: action.payload.projects.sort((a,b) => a.name < b.name? -1: 1 ),
        users: action.payload.users.sort((a,b) => a.surname < b.surname? -1: 1 ),
        times: []
      };
    case 'SET_TIMES':
      return {
        ...state,
        times: action.payload,};
    default:
      return state;
  }
}