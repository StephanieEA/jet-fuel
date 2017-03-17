describe('Folders', function() {
  const stub = sinon.stub(Folders.prototype, 'loadFolders' )

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

  it('should update the active Folder to the folder that has been clicked on', function(){

  });

});
