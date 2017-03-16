process.env.NODE_ENV = 'test';
const config = require('../knexfile.js')['test'];
const knex = require('knex')(config);
const chai = require('chai');
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
    const folders = [{name: 'Animals', id: 1, created_at: '2017-03-16 09:41:52.248438-06', updated_at: '2017-03-16 09:41:52.248438-06'}]
    knex.migrate.rollback()
    .then(function() {
      knex.migrate.latest()
      .then(function() {
        knex('folders').insert(folders)
//        return knex.seed.run()
        .then(function() {
          done();
        });
      });
    });
  });

  afterEach(function(done) {
    knex.migrate.rollback()
      .then(function() {
        done();
      });
  });

  describe('Get all folders', function() {
    it('should return all folders', function(done){
    chai.request(app)
      .get('/api/v1/folders')
      .end(function (err, res) {
        res.should.have.status(200);
          res.should.be.json; // jshint ignore:line
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
});
