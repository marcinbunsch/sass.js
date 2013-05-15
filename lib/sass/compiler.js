function Compiler() {}

Compiler.prototype.compile = function(selectors) {
  return selectors.join('\n')
}

module.exports = Compiler;

