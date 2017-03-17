process.env.NODE_ENV = 'test'
const config = require('../knexfile.js')['test']
const knex = require('knex')(config)
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const assert = chai.assert
const should = chai.should()
const app = require('../server.js')

chai.use(chaiHttp)

describe('Server', function() {
  it('should exist', function() {
    expect(app).to.exist;
  });
});

describe('API Routes', function() {
  beforeEach(function(done) {
    const folders = [
      { name: 'Animals' },
      { name: 'Reptiles' },
    ]

    const urls = [
      { long_url: 'www.animals.com', folder_id: '1' },
      { long_url: 'www.reptiles.com', folder_id: '2' },
    ]

    knex.migrate.rollback()
    .then(function() {
      knex.migrate.latest()
      .then(function() {
        knex('folders').insert(folders)
        .then(_ => knex('urls').insert(urls))
        .then(function() {
          done();
        })
      });
    });
  });

  afterEach(function(done) {
    knex.migrate.rollback()
      .then(function() {
        done();
      });
  });

  describe('GET /api/v1/folders', function() {
    it('should return all folders', function(done){
    chai.request(app)
      .get('/api/v1/folders')
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.equal(2);
        res.body[0].should.have.property('name');
        res.body[0].should.have.property('id');
        res.body[0].should.have.property('created_at');
        res.body[0].should.have.property('updated_at');
        done()
      })
    })
  })

  describe('GET /api/v1/urls', function() {
    it('should return all urls', function(done){
    chai.request(app)
      .get('/api/v1/urls')
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.equal(2);
        res.body[0].should.have.property('visits');
        res.body[0].should.have.property('id');
        res.body[0].should.have.property('long_url');
        res.body[0].should.have.property('created_at');
        res.body[0].should.have.property('updated_at');
        done()
      })
    })
  })

  describe('GET /api/v1/folders/:id', function() {
    it('should return a specific folder', function(done){
    chai.request(app)
      .get(`/api/v1/folders/${1}`)
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.equal(1);
        res.body[0].should.have.property('name');
        res.body[0].should.have.property('id');
        res.body[0].should.have.property('created_at');
        res.body[0].should.have.property('updated_at');
        done()
      })
    })
  })

  describe('GET /api/v1/folders/:id/urls', function() {
    it('should return all urls belonging to a specific folder', function(done){
    chai.request(app)
      .get(`/api/v1/folders/${1}/urls`)
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.equal(1);
        res.body[0].should.have.property('visits');
        res.body[0].should.have.property('id');
        res.body[0].should.have.property('long_url');
        res.body[0].should.have.property('created_at');
        res.body[0].should.have.property('updated_at');
        done()
      })
    })
  })

  describe('POST /api/v1/folders', function() {
    it('should return all folders with the added folder', function(done){
    chai.request(app)
      .post(`/api/v1/folders/`)
      .send({ name: 'Aliens',
      })
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.equal(3);
        res.body[2].should.have.property('name');
        res.body[2].should.have.property('id');
        res.body[2].should.have.property('name', 'Aliens');
        res.body[2].should.have.property('created_at');
        res.body[2].should.have.property('updated_at');
        done()
      })
    })
  })

  describe('POST /api/v1/folders/:id/urls', function() {
    it('should return all urls belonging to the specifed folder, including the added url', function(done){
    chai.request(app)
      .post(`/api/v1/folders/${1}/urls`)
      .send({ long_url: 'www.turing.io' })
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.equal(2);
        res.body[0].should.have.property('visits');
        res.body[0].should.have.property('id');
        res.body[0].should.have.property('long_url');
        res.body[0].should.have.property('created_at');
        res.body[0].should.have.property('updated_at');
        done()
      })
    })
  })

  describe('GET /:id', function() {
    it('should redirect to the long_url associated with that id', function(done){
    chai.request(app)
      .get(`/1`)
      .end(function (err, res) {
        res.should.have.status(200);
        expect(res).to.redirect;
        expect(res).to.redirectTo('http://www.animals.com/')
        res.should.be.html;
        done()
      })
    })
  })
});
