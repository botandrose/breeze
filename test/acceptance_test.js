process.env.NODE_ENV = 'test';
var app = require('../server_backbone');
var assert = require('assert');
var Browser = require('zombie');
var http = require('http');


describe('homepage', function () {
  
  before(function() {
    this.server = http.createServer(app).listen(3000);
    // initialize the browser using the same port as the test application
    this.browser = new Browser({ site: 'http://localhost:3000' });
  });  
 
  beforeEach(function(done) {
    this.browser.visit('/', done);
  });

  it("should show a table of locations accompanies by wind speed and wind direction", function () {
    //Ensure that index.html shows a table of the locations with wind speed and wind direction
    assert.ok(this.browser.success);
  });
});

/* EXAMPLE TESTS

process.env.NODE_ENV = 'test';
var app = require('../../server');
var assert = require('assert');
var Browser = require('zombie');
 
describe('contact page', function() {
 
  before(function() {
    this.server = http.createServer(app).listen(3000);
    this.browser = new Browser({ site: 'http://localhost:3000' });
  });
 
  // load the contact page before each test
  beforeEach(function(done) {
    this.browser.visit('/contact', done);
  });
 
  it('should show contact a form', function() {
    assert.ok(this.browser.success);
    assert.equal(this.browser.text('h1'), 'Contact');
    assert.equal(this.browser.text('form label'), 'First NameLast NameEmailMessage');
  });
 
  it('should refuse empty submissions', function(done) {
    var browser = this.browser;
    browser.pressButton('Send').then(function() {
      assert.ok(browser.success);
      assert.equal(browser.text('h1'), 'Contact');
      assert.equal(browser.text('div.alert'), 'Please fill in all the fields');
    }).then(done, done);
  });
 
  it('should refuse partial submissions', function(done) {
    var browser = this.browser;
    browser.fill('first_name', 'John');
    browser.pressButton('Send').then(function() {
      assert.ok(browser.success);
      assert.equal(browser.text('h1'), 'Contact');
      assert.equal(browser.text('div.alert'), 'Please fill in all the fields');
    }).then(done, done);
  });
 
  it('should keep values on partial submissions', function(done) {
    var browser = this.browser;
    browser.fill('first_name', 'John');
    browser.pressButton('Send').then(function() {
      assert.equal(browser.field('first_name').value, 'John');
    }).then(done, done);
  });
 
  it('should refuse invalid emails', function(done) {
    var browser = this.browser;
    browser.fill('first_name', 'John');
    browser.fill('last_name', 'Doe');
    browser.fill('email', 'incorrect email');
    browser.fill('message', 'Lorem ipsum');
    browser.pressButton('Send').then(function() {
      assert.ok(browser.success);
      assert.equal(browser.text('h1'), 'Contact');
      assert.equal(browser.text('div.alert'), 'Please check the email address format');
    }).then(done, done);
  });
 
  it('should accept complete submissions', function(done) {
    var browser = this.browser;
    browser.fill('first_name', 'John');
    browser.fill('last_name', 'Doe');
    browser.fill('email', 'test@example.com');
    browser.fill('message', 'Lorem ipsum');
    browser.pressButton('Send').then(function() {
      assert.ok(browser.success);
      assert.equal(browser.text('h1'), 'Message Sent');
      assert.equal(browser.text('p'), 'Thank you for your message. We\'ll answer you shortly.'');
    }).then(done, done);
  });
  after(function(done) {
    this.server.close(done);
  });
});



EXAMPLE 2

var Browser = require('zombie'),
    app = require('../../app'),
    sinon = require('sinon'),
    _ = require('underscore');

Load JSON Fixture
fs.readFile(testData, 'utf8', function (err, data) {
    if (err) {
        console.log('Error: ' + err);
        return;
    }

    data = JSON.parse(data);
});

describe('Adding a todo and completing it', function() {
  
  var browser, $, ajaxSpy;
  
  before(function(done) {
    app.listen('5000', function() {
      console.log('Test server listening on 5000');
      Browser.visit('http://localhost:5000', function(err, b) {
        browser = b;
        $ = browser.window.$;
        ajaxSpy = sinon.spy($, 'ajax');
        browser.wait(function(){
          browser.window.$(function(){
            done();
          });
        });
      });
    });
  });
  
  it('Adds the todo, renders the todos, and crosses it out when done', function(done) {
    $('#add-todo').val('Foo').change();
    browser.wait(function() {
      $('#todos li').length.should.be.above(2);
      $('#todos li:last-child .complete-todo').click();
      JSON.parse(_.last(ajaxSpy.args)[0].data).completed.should.be.ok;
      $('#todos li:last-child').hasClass('completed').should.be.ok
      done()
    });
  });
});
*/
