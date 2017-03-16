const express = require('express')
const md5 = require('md5')
const bodyParser =require('body-parser')
const morgan = require('morgan')
const chalk = require('chalk')
const path = require('path')

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

console.log(chalk.cyan.bold('ENV: ', environment))

const app = express()

app.set('port', process.env.PORT || 3000)
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))

// get all folders
app.get('/api/v1/folders', (req, res) => {
  database('folders').select()
    .then(function(folders) {
      res.status(200).json(folders);
    })
    .catch(function(error) {
      console.error(chalk.red('somethings wrong with db'))
      res.sendStatus(500)
    });
})

// get all urls
app.get('/api/v1/urls', (req, res) => {
  database('urls').select()
    .then(function(urls) {
      res.status(200).json(urls);
    })
    .catch(function(error) {
      console.error(chalk.red('somethings wrong with db'))
      res.sendStatus(500)
    });
})

// get a specific folder
app.get('/api/v1/folders/:id', (req, res) => {
  const { id } = req.params
  database('folders').where('id', id)
    .then(function(folders) {
      res.status(200).json(folders);
    })
    .catch(function(error) {
      console.error(chalk.red('somethings wrong with db'))
      res.sendStatus(500)
    });
})

// get all of the urls for a specific folder
app.get('/api/v1/folders/:id/urls', (req, res) => {
  const { id } = req.params
  database('urls').where('folder_id', id)
    .then(function(folders) {
      res.status(200).json(folders);
    })
    .catch(function(error) {
      console.error(chalk.red('somethings wrong with db'))
      res.sendStatus(500)
    });
})

// add a folder
app.post('/api/v1/folders', (req, res) => {
  const { name } = req.body
  const folder = { name }
  database('folders').insert(folder)
    .then(function() {
      database('folders').select()
        .then(function(folders) {
          res.status(200).json(folders);
        })
        .catch(function(error) {
          console.error(chalk.red('error adding a folder to db: ', JSON.stringify(error)))
        });
     })
})

// add a url to a specific folder
app.post('/api/v1/folders/:id/urls', (req, res) => {
  const { long_url } = req.body
  const folder_id = req.params.id
  const url = { folder_id, long_url, visits: 0 }

  database('urls').insert(url)
    .then(function() {
      database('urls').where('folder_id', folder_id)
        .then(function(urls) {
          res.status(200).json(urls);
        })
        .catch(function(error) {
          console.error(chalk.red('error adding a folder to db: ', JSON.stringify(error)))
        })
     })

})

// redirect to the long_url of a shortened url
app.get('/:id', (req, res) => {
  const { id } = req.params
  if (id === 'favicon.ico') {
    return
  }

  database('urls').where('id', id).increment('visits', 1)
  .then(function() {
    database('urls').where('id', id)
      .then(function(urls) {
        if (urls[0].long_url === null) {
          res.sendStatus(404)
        }
        res.redirect(`http://${urls[0].long_url}`)
      })
      .catch(function(error) {
        console.error(chalk.red('error redirecting to shortend url', JSON.stringify(error)))
      })
  })


  // TODO: url.visits += 1
})

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(chalk.blue(`${app.get('host')}`))
    console.log(chalk.yellow(`Jet-Fuel is running on ${app.get('port')}.`))
  })
}

module.exports = app
