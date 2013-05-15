var Token = require('./token');

function Lexer(string) {
  this.string = string;
  this.removeEmptyLines();
}

Lexer.prototype.tokenize = function() {
  var token, captures, stack = []
  var str = this.string;
  var tokens = Lexer.tokens;
  while (str.length) {
    for (var i = 0, len = tokens.length; i < len; ++i)
      if (captures = tokens[i][1].exec(str)) {
        token = [tokens[i][0], captures],
        token = new Token(tokens[i][0], captures)
        str = str.replace(tokens[i][1], '')
        break
      }
    if (token)
      stack.push(token),
      token = null
    else 
      throw new Error("SyntaxError: near `" + str.slice(0, 25).replace('\n', '\\n') + "'")
  }
  return stack
}

/**
 * Cleanup the given _str_.
 *
 * @param  {string} str
 * @return {string}
 * @api private
 */
Lexer.prototype.removeEmptyLines = function() {
  this.string = this.string.replace(/^\s*\n/gim, '')
}

Lexer.tokens = [
  ['indent',                (/^\n +/) ],
  ['space',                 (/^ +/) ],
  ['newline',               (/^\n/) ],
  ['comment',               (/^\/\/(.*)/) ],
  ['selector',              (/^(.*(:link|:visited|:active|:hover|:focus|first|:lang|:nth|:last|:only|:root|:empty|:target|:enabled|:disabled|:checked|:not).*)/) ],
  ['string',                (/^(?:'(.*?)'|"(.*?)")/) ],
  ['variable',              (/^\$([\w\-]+)\s*:\s*([^\n]+)/) ],
  ['property',              (/^([\w\-\*]+) *: *([^\n]+)/) ],
  ['mixin',                 (/^(\@include)\s+([\w\-]+)/) ],
  ['mixin',                 (/^(\+)\s*([\w\-]+)/) ],
  ['mixin.definition',      (/^(\@mixin|\=)\s+([\w\-]+)/) ],
  ['mixin.definition',      (/^(\=)\s*([\w\-]+)/) ],
  ['selector',              (/^(.+)/) ]
]

module.exports = Lexer;

