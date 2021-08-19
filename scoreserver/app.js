const express = require('express')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')
const cors = require('cors');

app.use(morgan('combined'))
app.use(cors());

const connection = mysql.createConnection({
    user: "root",
    host: "127.0.0.1",
    password: "password",
    database: "hangman_database",
});

app.get('/get_score', (req, res)=> {
    console.log('fetching scores ' + req.params.id);

   
    connection.query('SELECT  sum(score_player1)as total_player1, sum(score_player2) as total_player2 FROM hangman_database.scores', (err, rows, fields)=> {
        console.log('I think we fetched scores successfully.');
        res.json(rows);
    })


})

app.post('/', (req, res) => {
    const params = req.body

     connection.query('INSERT INTO hangman_database.scores (score_player1, score_player2) VALUES (?, ?)', params, (err, rows, fields) => {
         console.log("I think we inserted some data successfully.");
     })

     console.log(req.body);
})





app.get('/', (req, res)=> {
    console.log('Responding to root route');
    res.send('Helllo from rooot.')
})



app.listen(5000, ()=> {
    console.log('server is listenning on port 5000');
});