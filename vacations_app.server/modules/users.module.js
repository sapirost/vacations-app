var myDbHlpr= require('../db/dbhelper');


var userModule={

    login:function(user, pass)
    {
       return myDbHlpr.pool.query(`SELECT * FROM users WHERE username='${user}' AND password='${pass}'  `)
    },

    signin:function(firstname,lastname, username,password)
    {
       return myDbHlpr.pool.query(`INSERT INTO users (firstname,lastname,username,password,access,favoriteVacations )  
       VALUES ('${firstname}' , '${lastname}', '${username}','${password}',${0},'[]' )  `)
    }, 

    usernameExist: function(username) {
      return myDbHlpr.pool.query(`SELECT * FROM users WHERE username='${username}' `)
    },

    findFavoritesArray: username => {
      return myDbHlpr.pool.query(`SELECT favoriteVacations FROM users WHERE username='${username}' `);
    },

    updateFavoritesArray: function(username, favoriteVacations) {
      return myDbHlpr.pool.query(`UPDATE users SET favoriteVacations = '${favoriteVacations}' WHERE username = '${username}' `);
    }

}

module.exports = userModule;