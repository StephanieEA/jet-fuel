var express = require('express')
var app = express()

app.use(express.static('public'))
// respond with "hello world" when a GET request is made to the homepage
// app.get('/', function (req, res) {
//   res.send('hello world')
// })

app.listen(3000, function(){console.log('listening on port 3000')})
