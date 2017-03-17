const Folders = function () {
  this.folderInput = $('.folder-input')
  this.foldersList = $('.folders-list')
  this.addFolderButton = $('.add-folder-button')
  this.activeFolder = undefined
  return this
}

Folders.prototype.addFolders = function (name) {
  fetch('/api/v1/folders/',
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
  fetch('/api/v1/folders')
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

const Url = function () {
  this.urlList = $('.url-list')
  this.urlInput = $('.url-input')
  this.addUrlButton = $('.add-url-button')
  this.sortPopularityButton = $('.sort-popularity-button')
  this.sortDateButton = $('.sort-date-button')
  this.sortOrder = {date: 'desc', popularity: 'desc'}
  return this
}

Url.prototype.sortDateAscending = function (a,b) {
  return a.created_at - b.created_at
}

Url.prototype.sortDateDescending = function (a,b) {
  return b.created_at - a.created_at
}

Url.prototype.sortPopularityAscending = function (a,b) {
  return a.visits - b.visits
}

Url.prototype.sortPopularityDescending = function (a,b) {
  return b.visits - a.visits
}

Url.prototype.toggleSortByDate = function (payload) {
  if (url.sortOrder.date === 'desc') {
    payload.sort(url.sortDateAscending)
    url.sortOrder.date = 'asc'
  } else {
    payload.sort(url.sortDateDescending)
    url.sortOrder.date = 'desc'
  }
}

Url.prototype.toggleSortByPopularity = function (payload) {
  if (url.sortOrder.popularity === 'desc') {
    payload.sort(url.sortPopularityAscending)
    url.sortOrder.popularity = 'asc'
  } else {
    payload.sort(url.sortPopularityDescending)
    url.sortOrder.popularity = 'desc'
  }
}

Url.prototype.emptyUrls = function () {
  url.urlList.empty()
}

Url.prototype.renderUrls = function (payload) {
  payload.forEach(link => {
    url.urlList.append(`<li class="url-item">
                      <a href="/${link.id}">${link.id}</a>
                      <p> visits: ${link.visits} </p>
                      <p> created_at: ${link.created_at} </p>
                      <hr/>
                    </li>`)
  })
}

const url = new Url()

folders.foldersList.on('click', '.folder-button', function(e) {
  url.emptyUrls()
  Folders.activeFolder = e.target.id
  $(this).addClass('active')
  $(this).siblings().removeClass('active')
  fetch(`/api/v1/folders/${Folders.activeFolder}/urls`)
    .then(res => res.json())
    .then(payload => {
      url.renderUrls(payload)
  })
})

folders.addFolderButton.on('click', function(e) {
  e.preventDefault()
  folders.addFolders(folders.folderInput.val())
})


url.sortDateButton.on('click', function(e){
  fetch(`/api/v1/folders/${Folders.activeFolder}/urls`)
    .then(res => res.json())
    .then(payload => {
      url.emptyUrls()
      url.toggleSortByDate(payload)
      url.renderUrls(payload)
  })
})

url.sortPopularityButton.on('click', function(e){
  fetch(`/api/v1/folders/${Folders.activeFolder}/urls`)
    .then(res => res.json())
    .then(payload => {
      url.emptyUrls()
      url.toggleSortByPopularity(payload)
      url.renderUrls(payload)
  })
})

url.addUrlButton.on('click', function(e) {
  e.preventDefault()
  fetch(`/api/v1/folders/${Folders.activeFolder}/urls`,
    {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        long_url: url.urlInput.val()
      })
    })
    .then(res => res.json())
    .then(payload => {
      url.emptyUrls()
      url.renderUrls(payload)
    })
})

$(function() {
  folders.loadFolders()
})
