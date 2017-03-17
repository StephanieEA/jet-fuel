describe('Folders', function() {
  let form
  let display
  const setupStub = sinon.stub(window, 'setup')
  window.setup = function () {
    // form = $('
    //   <input placeholder="add folder" class="input folder-input"/>
    //   <button class="button add-folder-button">Submit</button>');
    display = $('<section class="folders-list"></section>');
  }
  const folderStub = sinon.stub(Folders.prototype, 'loadFolders' )

  it('is an Object', function(){
    chai.assert.isObject(folders);
  });

  it('should have a property of folderInput that is an object', function(){
    chai.assert.isObject(folders.folderInput);
  });

  it('should have a property of foldersList that is an object', function(){
    chai.assert.isObject(folders.foldersList);
  });

  it('should have a property of addFolderButton that is an object', function(){
    chai.assert.isObject(folders.addFolderButton);
  });

  it('should have a property of activeFolder that has a default value of undefined', function(){
    chai.assert.isNotOk(folders.activeFolder);
  });

  it('should have a property of folderInput that is an object', function(){
    chai.assert.isObject(folders.folderInput);
  });

  it('should have a method called addFolders', function(){
    chai.assert.isFunction(folders.addFolders);
  });

  it('should have a method called loadFolders', function(){
    chai.assert.isFunction(folders.loadFolders);
  });

  xit('should render folders correctly', function () {
    console.log(folders.foldersList)
  });

  xit('should update the active Folder to the folder that has been clicked on', function(){
  });

  xit('should render database folders', function(){
  });
})
