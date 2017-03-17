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
  fetch(`${document.location}api/v1/folders/`,
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
  fetch(`${document.location}api/v1/folders`)
    .then(res => res.json())
    .then(payload => {
      payload.forEach(folder => {
        folders.foldersList.append(`<button id="${folder.id}" class="folder-button">
                              ${folder.name}
                            </button>
                            <hr/>`)
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
  $(this).addClass('active')
  $(this).siblings().removeClass('active')
  fetch(`${document.location}api/v1/folders/${Folders.activeFolder}/urls`)
    .then(res => res.json())
    .then(payload => {
      payload.forEach(link => {

        urlList.append(`<li class="url-item">
                          <a href="${document.location}${link.id}">${document.location}${link.id}</a>
                          <p> visits: ${link.visits} </p>
                          <p> created_at: ${link.created_at} </p>
                          <hr/>
                        </li>`)

    })
  })
})

sortDateButton.on('click', function(e){
  fetch(`${document.location}api/v1/folders/${Folders.activeFolder}/urls`)
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
                          <a href="${document.location}${link.id}">${document.location}${link.id}</a>
                          <p> visits: ${link.visits} </p>
                          <p> created_at: ${link.created_at} </p>
                          <hr/>
                        </li>`)
    })
  })
})

sortPopularityButton.on('click', function(e){
  fetch(`${document.location}api/v1/folders/${Folders.activeFolder}/urls`)
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
                          <a href="${document.location}${link.id}">${document.location}${link.id}</a>
                          <p> visits: ${link.visits} </p>
                          <p> created_at: ${link.created_at} </p>
                          <hr/>
                        </li>`)
    })
  })
})

function sortDateAscending(a,b) {
  return a.created_at - b.created_at
}

function sortDateDescending(a,b) {
  return b.created_at - a.created_at
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

  fetch(`${document.location}/api/v1/folders/${Folders.activeFolder}/urls`,
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
                        <a href="${document.location}${link.id}">${document.location}${link.id}</a>
                        <p> visits: ${link.visits} </p>
                        <p> created_at: ${link.created_at} </p>
                        <hr/>
                      </li>`)
    })
  })
})
