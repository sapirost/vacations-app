var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan'); 
var vacationsApiRouter = require('./routes/vacations.api');
var usersApiRouter = require('./routes/users.api');
var DbHelper= require('./db/dbhelper');
var socketHelper =require('./utils/sockethelper');
var session = require('express-session');
var cors = require('cors');
var app = express();
app.use(cors());


var server = require('http').createServer(app);
var io = require('socket.io')(server);

socketHelper.startSockets(io);
server.listen(8888, () => console.log(`Listening on port 8888`));



DbHelper.connectToDb(); 

app.use(session({
    secret: 'dndjkbh hb,kb ',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/vacations', vacationsApiRouter); 
app.use('/api/users', usersApiRouter); 

module.exports = app;
