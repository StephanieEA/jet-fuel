const urlList = $('.url-list')
const urlInput = $('.url-input')
const addUrlButton = $('.add-url-button')

const sortPopularityButton = $('.sort-popularity-button')
const sortDateButton = $('.sort-date-button')

let sortOrder = {date: 'desc', popularity: 'desc'}
let urls = null

const Folders = function () {
  this.folderInput = $('.folder-input')
  this.foldersList = $('.folders-list')
  this.addFolderButton = $('.add-folder-button')
  this.activeFolder = undefined
  return this
}

Folders.prototype.addFolders = function (name) {
  fetch('http://localhost:3000/api/v1/folders/',
  {
    method:'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name
    })
  })
  .then(res => res.json())
  .then(payload => {
    folders.foldersList.empty()
    payload.forEach(folder => {
      folders.foldersList.append(`<button id="${folder.id}" class="folder-button">
        ${folder.name}
      </button>`)
    })
  })
}

Folders.prototype.loadFolders = function () {
  fetch('http://localhost:3000/api/v1/folders')
    .then(res => res.json())
    .then(payload => {
      payload.forEach(folder => {
        folders.foldersList.append(`<button id="${folder.id}" class="folder-button">
                              ${folder.name}
                            </button>`)
      })
    })
  }

const folders = new Folders()

$(function() {
  folders.loadFolders()
})

folders.foldersList.on('click', '.folder-button', function(e) {
  urlList.empty()
  Folders.activeFolder = e.target.id
  fetch(`http://localhost:3000/api/v1/folders/${Folders.activeFolder}/urls`)
    .then(res => res.json())
    .then(payload => {
      payload.forEach(link => {
        urlList.append(`<li class="url-item">
                          <a href="http://localhost:3000/${link.id}">link #${link.id}</a>
                        </li>`)
    })
  })
})

sortDateButton.on('click', function(e){
  fetch(`http://localhost:3000/api/v1/folders/${Folders.activeFolder}/urls`)
    .then(res => res.json())
    .then(payload => {
      urlList.empty()
      if (sortOrder.date === 'desc') {
        payload.sort(sortDateAscending)
        sortOrder.date = 'asc'
      } else {
        payload.sort(sortDateDescending)
        sortOrder.date = 'desc'
      }
      payload.forEach(link => {
        urlList.append(`<li class="url-item">
                          <a href="http://localhost:3000/${link.id}">link #${link.id}</a>
                        </li>`)
    })
  })
})

sortPopularityButton.on('click', function(e){
  fetch(`http://localhost:3000/api/v1/folders/${Folders.activeFolder}/urls`)
    .then(res => res.json())
    .then(payload => {
      urlList.empty()
      if (sortOrder.popularity === 'desc') {
        payload.sort(sortPopularityAscending)
        sortOrder.popularity = 'asc'
      } else {
        payload.sort(sortPopularityDescending)
        sortOrder.popularity = 'desc'
      }
      payload.forEach(link => {
        urlList.append(`<li class="url-item">
                          <a href="http://localhost:3000/${link.id}">link #${link.id}</a>
                        </li>`)
    })
  })
})

function sortDateAscending(a,b) {
  return a.createdAt - b.createdAt
}

function sortDateDescending(a,b) {
  return b.createdAt - a.createdAt
}

function sortPopularityAscending(a,b) {
  return a.visits - b.visits
}

function sortPopularityDescending(a,b) {
  return b.visits - a.visits
}

folders.addFolderButton.on('click', function(e) {
  e.preventDefault()
  const name = folders.folderInput.val()
  folders.addFolders(name)
})

addUrlButton.on('click', function(e) {
  e.preventDefault()

  fetch(`http://localhost:3000/api/v1/folders/${Folders.activeFolder}/urls`,
    {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        long_url: urlInput.val()
      })
    })
  .then(res => res.json())
  .then(payload => {
    urlList.empty()
    payload.forEach(link => {
      urlList.append(`<li class="url-item">
                        <a href="http://localhost:3000/${link.id}">link #${link.id}</a>
                      </li>`)
    })
  })
})
