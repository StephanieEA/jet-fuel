const express = require('express')
const bodyParser =require('body-parser')
const morgan = require('morgan')
const chalk = require('chalk')
const path = require('path')
const moment = require('moment')

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const knex = require('knex')(configuration);

console.log(chalk.cyan.bold('ENV: ', environment))

const app = express()

app.set('port', process.env.PORT || 3000)
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))

// get all folders
app.get('/api/v1/folders', (req, res) => {
  knex('folders').select()
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
  knex('urls').select()
    .then(function(urls) {
      convertTimestamps(urls)
      //TODO: encode ids here
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
  knex('folders').where('id', id)
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
  knex('urls').where('folder_id', id)
    .then(function(urls) {
      convertTimestamps(urls)
      //encode urls
      res.status(200).json(urls);
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
  knex('folders').insert(folder)
    .then(function() {
      knex('folders').select()
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

  knex('urls').insert(url)
    .then(function() {
      knex('urls').where('folder_id', folder_id)
        .then(function(urls) {
          //TODO: encode urls
          convertTimestamps(urls)
          res.status(200).json(urls);
        })
        .catch(function(error) {
          console.error(chalk.red('error adding a folder to db: ', JSON.stringify(error)))
        })
     })
})

// redirect to the long_url of a shortened url
  //TODO: change to encoded id
app.get('/:id', (req, res) => {
  let { id } = req.params
  if (id === 'favicon.ico') {
    return
  }

  const decodedId = shortener.decode(id)
  knex('urls').where('id', decodedId).increment('visits', 1)
  .then(function() {
    // decode base58 to base10 id

    knex('urls').where('id', decodedId)
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
})

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(chalk.blue(`${app.get('host')}`))
    console.log(chalk.yellow(`Jet-Fuel is running on ${app.get('port')}.`))
  })
}

function convertTimestamps(urls) {
  urls.map(url => {
    const created_at = moment(url.created_at).unix()
    const updated_at = moment(url.updated_at).unix()
    const id = shortener.encode(url.id)
    return Object.assign(url, { created_at, updated_at, id })
  })
}

let shortener = (() => {
  let alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
  let base = 58

  return {
    encode: (num) => {
      var encoded = '';
      while (num) {
        var remainder = num % base;
        num = Math.floor(num / base);
        encoded = alphabet[remainder].toString() + encoded;
      }
      return encoded;
    },
    decode: (str) => {
      var decoded = 0;
      while (str){
        var index = alphabet.indexOf(str[0]);
        var power = str.length - 1;
        decoded += index * (Math.pow(base, power));
        str = str.substring(1);
      }
      return decoded;
    },
  }
})()


module.exports = app
