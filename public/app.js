const folderInput = $('.folder-input')
const foldersList = $('.folders-list')
const addFolderButton = $('.add-folder-button')

const urlList = $('.url-list')
const urlInput = $('.url-input')
const addUrlButton = $('.add-url-button')

addFolderButton.on('click', function(e) {
  e.preventDefault()
  foldersList.append(folderInput.val())
})

addUrlButton.on('click', function(e) {
  e.preventDefault()
  urlList.append(urlInput.val())
})
