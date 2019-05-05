var myDbHlpr= require('../db/dbhelper');


var vacModule={

    getAllVac: () => {
        return myDbHlpr.pool.query(`SELECT * FROM vacations`);
    },

    addVac: (destination,description,startDate,endDate, price, image) => {
        return myDbHlpr.pool.query(`INSERT INTO vacations (destination,description,startDate,endDate, price,followers, image )  
        VALUES ('${destination}' , '${description}', '${startDate}','${endDate}',${price} , ${0}, '${image}' ) `)
    },

    deleteVac: id => {
        return myDbHlpr.pool.query(`DELETE FROM vacations WHERE ID=${id}`);
    },

    updateVac: (destination,description,startDate,endDate, price, image, vacationID) => {
        return myDbHlpr.pool.query(`UPDATE vacations SET destination = '${destination}', description = '${description}',
        startDate = '${startDate}', endDate = '${endDate}', price = ${price}, image = '${image}'
        WHERE ID = ${vacationID} `)
    },

    updateVacFollow: (following, vacationID) => {
        if (following === "decrease")
            return myDbHlpr.pool.query(`UPDATE vacations SET followers = followers - ${1} WHERE ID = ${vacationID} `)
        return myDbHlpr.pool.query(`UPDATE vacations SET followers = followers + ${1} WHERE ID = ${vacationID} `)
    }

}

module.exports = vacModule;
