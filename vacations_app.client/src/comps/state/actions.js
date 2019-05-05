export var Log = user => {
    return ({ type: "LOG", data: user });
}

export var Logout = () => {
    return async function (dispatch) {
        await fetch('/api/users/logout')
        .then(res=>{
            dispatch({
            type: "LOGOUT",
            data: null
            });  
        })
        .catch(err =>{
            console.log(err)
        })
    }
}

export var Loadvac = () => {
    return async function (dispatch) {
        let resp= await fetch('/api/vacations/getallvac');
        let resp2= await resp.json(); 
        let dataToSend;
        if (resp2 instanceof Array) 
            dataToSend = resp2;
            else
            dataToSend = [];
            dispatch({
                type: "LOAD_VAC",
                data: dataToSend
            });
        }
}

export var Session = () => {
    return async function (dispatch) {
        let resp= await fetch('/api/users/checksession');
        let resp2= await resp.json(); 
            dispatch({
                type: "UPDATE_SESSION",
                data: resp2
            });
        }
}

export var GetFavorites = () => {
    return async function (dispatch) {
        try {
            let resp= await fetch('/api/users/getfavorites');
            let resp2= await resp.json();  
            dispatch({
                type: "GET_FAVORITES",
                data: resp2.data
            });
        }
        catch (err) {
            dispatch({
                type: "GET_FAVORITES",
                data: []
            });
        }
    }
}