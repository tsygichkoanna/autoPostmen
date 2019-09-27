const InitialState = {
    positions: [],
    position: {},
    jobs: [],
    departments: [],
};

export default(state = InitialState, action) => {
    switch (action.type) {
      case 'GET_ALL_POSITIONS':
          return {...state,
              positions: action.payload.sort((a,b) => a.name < b.name? -1: 1 )};
      case 'ADD_JOB':
          return {...state,
              jobs: state.jobs.concat(action.payload)};
      case 'SET_JOB':
        return {...state,
          jobs: action.payload};
      case 'DEL_JOB':
          return {...state,
              jobs: state.jobs.filter(el => el.name !== action.payload)};
      case 'CLEAR_JOBLIST':
          return {...state,
              jobs: action.payload};
      case 'GET_POS_INFO':
          return {...state,
              position: action.payload};
      case 'SET_DEPARTMENTS':
        return {...state,
          departments: action.payload.map(i=> ({ value: i.id, label: i.name }))};
      default:
          return state;

    }
}
