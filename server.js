var express = require('express');
var app = express();

var formidable = require('express-formidable');
app.use(formidable());

var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectId;

var http = require('http').createServer(app);
var path = require('path');

var bcrypt = require('bcrypt');
var filesystem = require('fs');
var accessTokensecret = "181216040217S&M";

var router = require('./router/index');
const router = require('./router/route');
//routes
app.use('/signup',route);

//testing server or route path (homepage)
app.get('/',function(request , result){
  result.send('Welcome To JPSTech');
});

app.listen(Port,()=>{
  console.log('server started at port:'+Port);
});                                            

//view engine 
app.use('/public', (path.join(__dirname + '/public')));
app.set('View engine', 'ejs');
app.get('/', function(request, result){
    result.render('signup');
});

app.listen(3000, function(){
  console.log('heard on 3000');
});

var socketIO = require('socket.io')(http);
var socketID = "";
var users = [];

var mainURL = 'http://localhost:3000';

socketIO.on('connection', function(socket)
    {
      console.log('User Connected', socket.id);
      socketID = socket.id;
    });

http.listen(3000, function(){
   console.log('Server Started');
    
   mongoClient.connect("mongodb://localhost:27017", function(error, client){
   var database = client.db('Social_Network');
   console.log('Database Connected.');

   app.get('/signup', function(request, result){
   result.render('signup');
                  });

                  app.post('/signup', function(request, result){
                       var name = request.fields.name;
                       var username = request.fields.username;
                       var email = request.fields.email;
                       var password = request.fields.password;
                       var gender = request.fields.gender;

                       database.collection('users').findOne({
                        $or: [{
                           "email": username
                        }, {
                          'username': username
                        }]
                  }, function(error, user) {
                    if (user == null){
                       bcrypt.hash(password, 10, function(error, hash) {
                             database.collection('users').insertOne({
                                   "name": name,
                                   "username": username,
                                   "email": email,
                                   "password": password,
                                   "gender": gender,
                                   "profileImage": "",
                                   "coverPhoto": "",
                                   "dob": "",
                                   "city": "",
                                   "country": "",
                                   "aboutMe": "",
                                   "friends": [],
                                   "pages": [],
                                   "notifications": [],
                                   "groups": [],
                                   "posts": [],
                                   //"status": "",
                             }, function (error, data) {
                                result.json({
                                  "status": "success",
                                  "message": "Signed up successfully. You can login now."
                                });
                             });
                       });
} else {
  result.json({
     "status": "error",
     "message": "Email or username already exits."
  });
}
});
});
});
});