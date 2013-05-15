var Selector = require('./selector');
var Property = require('./property');

function Parser(tokens) {
  this.tokens = tokens;
  this.line = 1;
  this.data = { variables: {}, mixins: {}, selectors: [] }
  this.selector = null;
  this.lastIndents = 0;
  this.indents = 0;
}


/**
 * Output error _msg_ in context to the current line.
 */
Parser.prototype.error = function(msg) {
  throw new Error('ParseError: on line ' + this.line + '; ' + msg)
}

Parser.prototype.reset = function() {
  if (this.indents === 0) 
    return this.selector = null
  while (this.lastIndents-- > this.indents)
    this.selector = this.selector.parent
}

/**
 * Replaces variables in the input.
 */
Parser.prototype.performSubstitutions = function(input) {
  var self = this;
  return input.replace(/\$([\w\-]+)/g, function(orig, name){
    return self.data.variables[name] || orig
  })

}

Parser.prototype.process = function(token) {
  var func = this.findProcessorFunction(token.type);
  func.call(this, token);
}

Parser.prototype.findProcessorFunction = function(type) {
  var name = "process" + type.split('.').map(function(str) { 
    return str[0].toUpperCase() + str.slice(1) 
  }).join('')
  var func = this[name];
  if (func) {
    return func;
  } else {
    this.error("missing processor method: " + name) 
  }
}


/**
 * Parse the given _tokens_, returning
 * and hash containing the properties below:
 *
 *   selectors: array of top-level selectors
 *   variables: hash of variables defined
 *
 * @param  {array} tokens
 * @return {hash}
 * @api private
 */
Parser.prototype.parse = function() {
  var token;
  
  while (token = this.tokens.shift()) {
    this.process(token);
  }

  return this.data;
}

Parser.prototype.processMixinDefinition = function(token) {
  this.data.mixins[token.parts[1]] = this.selector = new Selector(token.parts[1], null, 'mixin')
}

Parser.prototype.processComment = function(token) {
}

Parser.prototype.processMixin = function(token) {
  if (this.indents) {
    var name = token.parts[1];
    var mixin = this.data.mixins[name]
    if (!mixin) this.error("mixin `" + name + "' does not exist")
    mixin.mergeInto(this.selector);
  }
}

Parser.prototype.processSelector = function(token) {
  if (this.isContinuation(token))
    return this.processContinuation(token) 
  this.reset()
  this.selector = new Selector(token.string, this.selector)
  this.selector.indents = this.indents * 1;
  if (!this.selector.parent) 
    this.data.selectors.push(this.selector)
}

Parser.prototype.isContinuation = function(token) {
  var is_continuation = /\&/;
  return is_continuation.test(token.string)
}

Parser.prototype.processContinuation = function(token) {
  this.reset()
  this.selector = new Selector(token.parts[0], this.selector, 'continuation')
  this.selector.indents = this.indents * 1;
}

Parser.prototype.processVariable = function(token) {
  var val = this.performSubstitutions(token.parts[1])
  this.data.variables[token.parts[0]] = val
}

Parser.prototype.processNewline = function(token) {
  ++this.line, this.indents = 0
}

Parser.prototype.processIndent = function(token) {
  ++this.line
  this.lastIndents = this.indents,
  this.indents = (token.string.length - 1) / 2
  if (this.indents > this.lastIndents &&
      this.indents - 1 > this.lastIndents)
        self.error('invalid indentation, too much nesting')

}

Parser.prototype.processProperty = function(token) {
  this.reset()
  if (!this.selector) this.error('properties must be nested within a selector')
  var val = this.performSubstitutions(token.parts[1])
  this.selector.properties.push(new Property(this, token.parts[0], val))
}


module.exports = Parser;

