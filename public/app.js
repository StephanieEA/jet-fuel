const folderInput = $('.folder-input')
const foldersList = $('.folders-list')
const addFolderButton = $('.add-folder-button')

const urlList = $('.url-list')
const urlInput = $('.url-input')
const addUrlButton = $('.add-url-button')

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
  console.log('clicked!', e.target.id)

  urlList.deleteEverything

  fetch(`http://localhost:3000/api/v1/folders/${e.target.id}/urls`)
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
  console.log(folders)
  //
  // foldersList.append(folderInput.val())
})

addUrlButton.on('click', function(e) {
  e.preventDefault()
  urlList.append(urlInput.val())
})
