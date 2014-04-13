var app = require('../app');
var assert = require('assert');
var Browser = require('zombie');
var http = require('http');

describe('homepage', function () {
  before(function() {
    this.server = http.createServer(app).listen(6666);
    this.browser = new Browser({ site: 'http://localhost:6666' });
  });
 
  it("should show a table of locations with wind speed and wind direction", function(done) {
    var browser = this.browser;
    browser.visit('/', function() {
      tableLength = browser.document.querySelectorAll("tbody tr").length;
      assert.strictEqual(tableLength, 10);
      done();
    });
  });
});

