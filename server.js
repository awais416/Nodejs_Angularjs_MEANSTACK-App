var express=require('express');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var stylus=require('stylus');
var app= express();
var logger=require('morgan');
var bodyParser=require('body-parser');
var mongoose = require('mongoose');
var path=require('path');

mongoose.Promise = require('bluebird');


function compile(str,path){
    return stylus(str).set('filename',path);
}

app.set('views', __dirname +'/server/views');
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(stylus.middleware(
    {
        src: __dirname+ '/public',
        compile: compile
    }

));
app.use(express.static(path.join(__dirname, '/public')));

app.get('/partials/:partialPath', function(req,res){
    res.render('partials/' + req.params.partialPath);
});
mongoose.connect('mongodb://localhost/angular_nodejs_meanstack');
var db=mongoose.connection;


db.on('error', console.error.bind(console,' connection error....'));
db.once('open', function callback(){
    console.log('angular and nodejs app open');
});


var messageSchema=mongoose.Schema({message:String});
var Message=mongoose.model('Message', messageSchema);

var mongoMessage;
Message.findOne().exec(function(err,messageDoc){
    mongoMessage=messageDoc.message;
});

app.get ('*', function (req,res){
    res.render('index',{mongomessage:mongoMessage}
    );
});


var port=3000;
app.listen(port);



