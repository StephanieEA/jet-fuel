const folderInput = $('.folder-input')
const foldersList = $('.folders-list')
const addFolderButton = $('.add-folder-button')

const urlList = $('.url-list')
const urlInput = $('.url-input')
const addUrlButton = $('.add-url-button')

let activeFolder = undefined
let folders = null
let urls = null

$(function() {
  fetch('http://localhost:3000/api/v1/folders')
    .then(res => res.json())
    .then(payload => {
      payload.forEach(folder => {
        foldersList.append(`<button id="${folder.id}" class="folder-button">
                              ${folder.name}
                            </button>`)
      })
    })
})

foldersList.on('click', '.folder-button', function(e) {
  urlList.empty()
  activeFolder = e.target.id
  fetch(`http://localhost:3000/api/v1/folders/${activeFolder}/urls`)
    .then(res => res.json())
    .then(payload => {
      payload.forEach(link => {
        urlList.append(`<li class="url-item">
                          <a href="${link.short}">${link.short}</a>
                        </li>`)
    })
  })
})

addFolderButton.on('click', function(e) {
  e.preventDefault()
  // post that folder name to the server
  fetch('http://localhost:3000/api/v1/folders/',
    {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: folderInput.val()
      })
    })
  .then(res => res.json())
  .then(payload => {
    foldersList.empty()
    payload.forEach(folder => {
      foldersList.append(`<button id="${folder.id}" class="folder-button">
                            ${folder.name}
                          </button>`)
    })
  })
})

addUrlButton.on('click', function(e) {
  e.preventDefault()

  fetch(`http://localhost:3000/api/v1/folders/${activeFolder}/urls`,
    {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: urlInput.val()
      })
    })
  .then(res => res.json())
  .then(payload => {
    urlList.empty()
    payload.forEach(link => {
      urlList.append(`<li class="url-item">
                        <a href="${link.short}">${link.short}</a>
                      </li>`)
    })
  })
})
