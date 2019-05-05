var mysql= require('promise-mysql');
var mysecretvar="abc123";

var myDbHelper={
    pool:null,
    connectToDb:function()
    {
        this.pool= mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: '',
            database:'vacation_app',
            connectionLimit: 10
          }); 
          console.log('pool created');
    }
}
module.exports = myDbHelper;



