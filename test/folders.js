const assert = require('assert');

const folders = require('../../jet-fuel/public/app.js');

describe('Folders', function() {
    it('is an Object', function(){
      const folders = new Folders();
      assert.isObject(folders);
    });
});
