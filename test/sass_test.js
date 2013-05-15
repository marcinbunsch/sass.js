var fs = require("fs");
var should = require('should');
var glob = require("glob");
var Sass = require("../lib/sass.js");

var fixture = function(filename) {
  return fs.readFileSync("test/fixtures/" + filename).toString();
};

var clean = function(str) {
  return str.replace(/^\s*/gm, '');
};

var testFixture = function(name) {
  var css = fixture("" + name + ".css");
  var rendered = renderFixture(name);
  css = clean(css);
  rendered = clean(rendered);
  return css.should.eql(rendered);
};

var renderFixture = function(name) {
  var sass = fixture("" + name + ".sass");
  return Sass.render(sass);
};

var createFixtureSpec = function(filename) {
  return describe("(" + filename + ".sass -> " + filename + ".css)", function() {
    return it("works", function() {
      return testFixture(filename);
    });
  });
};

describe("Fixture rendering", function() {
  var file, filename, _i, _len, _ref, _results;
  var files = glob.sync("test/fixtures/*.sass");
  files.forEach(function(file) {
    filename = file.split('/').pop().replace('.sass', '');
    if (fs.existsSync("test/fixtures/" + filename + ".css")) {
      createFixtureSpec(filename);
    }
  })
});

