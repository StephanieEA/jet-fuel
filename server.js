var express = require('express')
var md5 = require('md5')
var app = express()

app.use(express.static('public'))

app.locals.folders = [{
  id: md5('animals'),
  name: 'animals'
}]

app.locals.urls = [{
  id: md5('animals.com'),
  source: 'animals.com',
  short: `localhost:3000/${md5('animals.com')}`
}]

app.get('/api/v1/folders', (req, res) => {
  res.json(app.locals.folders)
})

app.get('/api/v1/urls', (req, res) => {
  res.json(app.locals.urls)
})
// respond with "hello world" when a GET request is made to the homepage
// app.get('/', function (req, res) {
//   res.send('hello world')
// })

app.listen(3000, function(){console.log('listening on port 3000')})
