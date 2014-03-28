// http://open.bekk.no/integration-testing-backbone-js
var sinon = require('sinon');
var jasmine-node = require('jasmine-node');
var jasmine-jquery = require('jasmine-jquery');

it("should list the wind speed at Hood River", function () {

  // fetch an Ajax response
  var response = readFixtures("fixtures/example.json");
  var options = {};

  // create our view, sending in an empty collection
  var view = new WindView({ collection: new Wind() });
  view.render();

  // mock out all requests (this is our core test abstraction),
  // i.e. what this function does is responding to all Ajax requests in
  // the callback with the same response and with the same options.
  // Thus, when `fakeResponse` is finished, all Ajax requests will have
  // responded, and as we listen for finished Ajax requests in our view,
  // we will then have properly set up our PersonsView.
  fakeRespone(response, options, function () {
    view.collection.fetch(); // trigger Ajax request
  });

  // ensure all data is present
  expect(view.$('.wind li').length).toEqual(20);

});
