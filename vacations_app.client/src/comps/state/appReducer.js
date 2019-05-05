const initialState = {
    session: true, 
    allVac: [], 
    admin: false,
    username: "",
    favoritesArray: []
};

const appReducer = (state = initialState, action) => {
    let newState = {};
    switch (action.type) {
        case 'LOG': 
        let userObj = {session: true, username:action.data.username};
        if(action.data.access)
            userObj = {session: true, username:action.data.username, admin: true};

            newState = Object.assign({}, state, userObj);
        return newState;

        case 'LOGOUT': 
        let clearUser = {session: false, username:"", admin: false};
            newState = Object.assign({}, state, clearUser);
        return newState;

        case 'LOAD_VAC': 
        newState = Object.assign({}, state, {
            allVac: action.data
        });
        return newState;

        case 'UPDATE_SESSION': 
        let sessionObj;
            if (action.data.logged) {
                sessionObj = {session:true, username:action.data.username};
                if (action.data.access === 1)
                    sessionObj = {session:true, username:action.data.username,admin:true};
            }
            else 
                sessionObj = {session:false, username:"", admin:false};
            
                newState = Object.assign({}, state, sessionObj);
        return newState;

        case 'GET_FAVORITES': 
            newState = Object.assign({}, state, {
            favoritesArray: action.data 
        });  
    return newState;

    default:
    return state;
    }
}
export default appReducer;