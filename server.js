const express = require('express')
const md5 = require('md5')
const bodyParser =require('body-parser')
const app = express()

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.locals.folders = [{
  id: md5('animals'),
  name: 'animals'
}, {
  id: md5('reptiles'),
  name: 'reptiles'
}]

app.locals.urls = [{
  id: md5('animals.com'),
  folderId: md5('animals'),
  source: 'http://animals.com',
  short: `localhost:3000/${md5('animals.com')}`,
  visits: 0,
  createdAt: Date.now()
}, {
  id: md5('reptiles.com'),
  folderId: md5('reptiles'),
  source: 'http://reptiles.com',
  short: `localhost:3000/${md5('reptiles.com')}`,
  visits: 0,
  createdAt: Date.now()
}]

// get all folders
app.get('/api/v1/folders', (req, res) => {
  res.json(app.locals.folders)
})

// get all urls
app.get('/api/v1/urls', (req, res) => {
  res.json(app.locals.urls)
})

// get a specific folder
app.get('/api/v1/folders/:id', (req, res) => {
  const { id } = req.params
  const folder = app.locals.folders.find(folder => folder.id === id)

  if (!folder) return response.sendStatus(404)
  res.json(folder)
})

// get all of the urls for a specific folder
app.get('/api/v1/folders/:id/urls', (req, res) => {
  const { id } = req.params
  const urls = app.locals.urls.filter(url => url.folderId === id)

  if (!urls) return response.sendStatus(404)
  res.json(urls)
})

// add a folder
app.post('/api/v1/folders', (req,res) => {
  const { name } = req.body
  const id = md5(name)

  app.locals.folders.push({ id, name })
  res.json({ id, name })
})

// add a url to a specific folders
app.post('/api/v1/folders/:id/urls', (req,res) => {
  const { source } = req.body
  const folderId = req.params.id
  const id = md5(source)
  const short = `localhost:3000/${id}`
  const createdAt = Date.now()
  const visits = 0

  app.locals.urls.push({ id, folderId, source, short})
  res.json({ id, folderId, source, short })
})

// redirects to the source of a shortened url
app.get('/:id', (req, res) => {
  const { id } = req.params
  const url = app.locals.urls.find(url => url.id === id)
  url.visits += 1
  res.redirect(url.source)
})

app.listen(3000, function(){console.log('listening on port 3000')})
