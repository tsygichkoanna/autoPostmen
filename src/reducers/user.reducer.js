const InitialState = {
  user: {},
  users: [],
  directions: [],
  options: {
    clients: [],
    directions: [],
    roles: [],
    positions: [],
    projects: [],
    departments: [],
    works: [],
  },
  worksection:{
    users_time: {},
    wsUsers: [],
    worksection_time:[],
    worksection_clients: [],
    postman_projects:[],
    postman_users: [],
    associations: [],
    directions:[],
    worksection_products: [],
  },
  config: {
    works: [],
    holiday: [],
    products: [],
  }
}

export default (state = InitialState, action) => {
  switch (action.type) {
    case 'GET_ALL_USERS':
      return {
        ...state,
        users: action.payload.users.sort((a,b) => a.surname < b.surname? -1: 1 ),
        directions: action.payload.directions
      }
    case 'GET_OPTIONS': {

      return {
        ...state,
        options: {
          directions: action.payload.directions.map((i) => ({value: i.id, label: i.name})),
          positions: action.payload.positions.map((i) => ({value: i.id, label: i.name, department: i.department})),
          roles: action.payload.roles.map((i) => ({value: i.id, label: i.name})),
          departments: action.payload.departments.map((i) => ({value: i.id, label: i.name})),
          clients:  action.payload.clients.map((i) => ({value: i.id, label: i.name})),
          projects: action.payload.projects.map((i) => ({value: i.id, label: i.name, client: i.client})),
          works: action.payload.works
        }
      }
    }
    case 'GET_USER_INFO':
      return {
        ...state,
        user: action.payload
      }

    case 'SET_WORKSECTION_INFORMATION':
      return {
        ...state,
        clients: action.payload.clients.sort((a,b) => a.name < b.name? -1: 1 ),
        config: {
          products: action.payload.products,
          holiday: action.payload.holiday,
          work: action.payload.work,
        },
        worksection:{
          users_time: action.payload.users_time,
          wsUsers: action.payload.wsUsers,
          worksection_time: action.payload.worksection_time,
          worksection_clients: action.payload.worksection_clients,
          worksection_products: action.payload.worksection_products,
          postmen_projects: action.payload.projects,
          postmen_users: action.payload.users.map((i) => (
            {
              value: i.id,
              label: `${i.name} ${i.surname}`,
              email: i.email,
              direction: i.direction
            }
          )).sort((a,b) => a.label < b.label? -1: 1 ),
          associations: action.payload.associations,
          directions: action.payload.directions
        }
      }

    case 'CLEAR_WORKSECTION_INFORMATION':
      return {
        ...state,
        worksection:{
          users_time: {},
          wsUsers: [],
          worksection_time:[],
          worksection_clients: [],
          worksection_products: [],
          postman_projects:[],
          postman_users: [],
          associations: [],
          directions: []
        }
      }
    default:
      return state

  }
}
