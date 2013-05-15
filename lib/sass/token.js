function Token(type, contents) {
  this.type = type;
  this.string = contents[0];
  this.parts = []
  for (var i = 1, len = contents.length; i < len; i++) {
    this.parts.push(contents[i])
  }
}

module.exports = Token;

