
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
const morgan = require('morgan');
var path = require('path');
var app = express();
const cheerio = require('cheerio');
// app.use("/assets",express.static("assets"));

const connection = mysql.createConnection({
    user: "root",
    host: "127.0.0.1",
    password: "password",
    database: "hangman_database",
});
app.use(morgan('short'))
app.use(express.static(__dirname + '/views'));
app.use(express.static(path.join(__dirname, '/views')));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
var ulencodedParsr = bodyParser.urlencoded({extended : true})
app.use(ulencodedParsr);
app.use(bodyParser.json());

// connect to the database
connection.connect(function(error){
    if (error) throw error
    else console.log("connected to the database successfully!")
});


app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/index.html'));
});
app.post('/add_score', (req, res) => {
    console.log('Got body:', req.body);
    res.sendStatus(200);
});

app.post('/gamepage', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if ((username && password)) {
		connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/gamepage');
             
			} else {
				
				// const $ = cheerio.load(html);
				// // response.flash('info', 'Flashed message')
				// const messageError  =  $('.player-passcode')
				// messageError.text().replaceWith('Error'); 
				response.redirect('back');
				// response.render('view', {errormessage: 'error!!'});
				


			}	
			// $.html();
				
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

// app.post('/add_score', (req, res) => {
// 	console.log('Trying to create a new user');
// 	console.log('Trying to create a new user');
// 	res.end();
// });







// app.get('/gamepage', function(request, response) {
// 	if (request.session.loggedin) {

// 		response.send('Welcome back, ' + request.session.username + '!');
//         	// response.redirect('/welcome');
// 	} else {
// 		response.send('Please login to view this page!');
// 	}
// 	response.end();
// });

// when login is success
app.get("/gamepage",function(req,res){
    res.sendFile(__dirname + "/gamepage.html")
})


// set app port 
app.listen(4000);