var Lexer = require('./sass/lexer')
var Parser = require('./sass/parser')
var Compiler = require('./sass/compiler')

exports.render = function(sass, options) {
  var lexer = new Lexer(sass);
  var tokens = lexer.tokenize();

  var parser = new Parser(tokens);
  var tree = parser.parse()

  var compiler = new Compiler();
  var compiled = compiler.compile(tree.selectors);
  return compiled;
}

exports.version = '0.6.0'

