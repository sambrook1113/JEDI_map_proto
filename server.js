require('dotenv').config()

const express = require('express')
const app = express()
var http = require('http').createServer(app)
var io = require('socket.io')(3001) //http

const expressLayouts = require('express-ejs-layouts')

const indexRouter = require('./routes/index')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.use('/public',express.static('public'))
app.use(express.urlencoded());
app.use(express.json());

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', ()=> console.log('Connected to Database'))
app.use('/', indexRouter)

http.listen(process.env.PORT || 3000, ()=>{console.log('Server Started')})

io.on('connection',(socket)=>{
	console.log('new client')
	socket.emit('server-side-greeting', 'greetings from the server side!')
})

//var io = require('socket.io').listen(server)
// var http = require('http');
// var server = http.createServer(app);
// var io = require('socket.io').listen(server);


module.exports = {io: io}

