describe('Url', function() {
  const url = new Url
  it('is an Object', function(){
    chai.assert.isObject(url);
  });

  it('should have a property of urlList that is an object', function(){
    chai.assert.isObject(url.urlList);
  });

  it('should have a property of urlInput that is an object', function(){
    chai.assert.isObject(url.urlInput);
  });

  it('should have a property of addUrlButton that is an object', function(){
    chai.assert.isObject(url.addUrlButton);
  });

  it('should have a property of sortPopularityButton that is an object', function(){
    chai.assert.isObject(url.sortPopularityButton);
  });

  it('should have a property of sortDateButton that is an object', function(){
    chai.assert.isObject(url.sortDateButton);
  });

  it('should have a property of sortOrder with a default value {date: "desc", popularity: "desc"}', function(){
    chai.assert(url.sortOrder.date, 'desc');
    chai.assert(url.sortOrder.popularity, 'desc');
  });

  it('should have a method called sortDateAscending', function(){
    chai.assert.isFunction(url.sortDateAscending);
  });

  it('sortDateAscending should sort data by its created_at property in ascending order', function () {
    const fakeUrl1 = {source: 'yo', created_at: 9876543}
    const fakeUrl2 = {source: 'mama', created_at: 8765432}
    const expectResponse = url.sortDateAscending(fakeUrl2, fakeUrl1)
    chai.assert(expectResponse, -1111111)
  });

  it('should have a method called sortDateDescending', function(){
    chai.assert.isFunction(url.sortDateDescending);
  });

  it('sortDateDescending should return the value of of the second argument created_at property minus the first arguments created_at property', function () {
    const fakeUrl1 = {source: 'yo', created_at: 9876543}
    const fakeUrl2 = {source: 'mama', created_at: 8765432}
    const expectResponse = url.sortDateDescending(fakeUrl2, fakeUrl1)
    chai.assert(expectResponse, 1111111)
  });

  it('should have a method called sortPopularityAscending', function(){
    chai.assert.isFunction(url.sortPopularityAscending);
  });

  it('sortPopularityAscending should return the value of of the first argument visits property minus the second arguments visits', function () {
    const fakeUrl1 = {source: 'yo', visits: 3}
    const fakeUrl2 = {source: 'mama', visits: 2}
    const expectResponse = url.sortPopularityAscending(fakeUrl2, fakeUrl1)
    chai.assert(expectResponse, 1)
  });

  it('should have a method called sortPopularityDescending', function(){
    chai.assert.isFunction(url.sortPopularityDescending);
  });

  it('sortPopularityDescending should return the value of of the second argument visits property minus the first arguments visits property', function () {
    const fakeUrl1 = {source: 'yo', visits: 4}
    const fakeUrl2 = {source: 'mama', visits: 8}
    const expectResponse = url.sortPopularityDescending(fakeUrl2, fakeUrl1)
    chai.assert(expectResponse, 4)
  });

  it('should have a method called toggleSortByDate', function(){
    chai.assert.isFunction(url.toggleSortByDate);
  });

  xit('toggleSortByDate should sort the payload array based on the sortOrder.date and reassign sortOrder.date to be its opposite', function () {
    const payload = [{},]
    console.log(url.toggleSortByDate({}))
  });

  it('should have a method called toggleSortByPopularity', function(){
    chai.assert.isFunction(url.toggleSortByPopularity);
  });

  xit('toggleSortByPopularity should sort the payload array based on sortOrder.popularity and reassign sortOrder.popularity to be its opposite', function () {
  });

  it('should have a method called emptyUrls', function(){
    chai.assert.isFunction(url.emptyUrls);
  });

  xit('emptyUrls should remove all child elements of urlList', function () {
  });

  it('should have a method called renderUrls', function(){
    chai.assert.isFunction(url.renderUrls);
  });

  xit('should render urls correctly', function () {
    console.log(url.urlList)
  });

  xit('should render database urls', function(){
  });
})
