const InitialState = {
    client: {},
    clients:[],
    projects:[],
    newProjects:[],
    departmens_directions:{}
};

export default(state = InitialState, action) => {
    switch (action.type) {
      case 'GET_ALL_CLIENTS':
            return {...state,
                clients: action.payload.sort((a,b) => a.name < b.name? -1: 1 )};
        case 'GET_DIRECTIONS_DEPARTMENTS':
            return {...state,
                departmens_directions: action.payload};
        case 'ADD_PROJECT':
            return {...state,
                projects: state.projects.concat(action.payload)};
        case 'SET_PROJECTS_CLIENTS':
          return {...state,
            projects: action.payload.sort((a,b) => a.name < b.name? -1: 1 )};
        case 'ADD_NEW_PROJECT':
            return {...state,
                newProjects: state.newProjects.concat(action.payload)};
        case 'DEL_PROJECT':
            return {...state,
                projects: state.projects.filter(el => el.name !== action.payload),
                newProjects: state.newProjects.filter(el => el.name !== action.payload),
              };
        case 'CLEAR_PROJLIST':
            return {...state,
                projects: action.payload};
        case 'GET_CLIENT_INFO':
            return {...state,
                client: action.payload};
        default:
            return state;

    }
}
