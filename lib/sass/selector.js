// --- Selector

/**
 * Initialize a selector with _string_ and
 * optional _parent_.
 *
 * @param  {string} string
 * @param  {Selector} parent
 * @param  {string} type
 * @api private
 */

function Selector(string, parent, type) {
  this.string = string
  if (parent) {
    parent.adopt(this)
  } else {
    parent = null
  }
  this.properties = []
  this.children = []
  this.type = type
  this.indents = 0;
  if (type) this[type] = true
}

/**
 * Return a copy of this selector.  Children and properties will be recursively
 * copied.
 *
 * @return {Selector}
 * @api private
 */

Selector.prototype.copy = function() {
  var copy = new Selector(this.string, this.parent, this.type)
  copy.properties = this.properties.map(function(property) {
    return property.copy()
  })
  this.children.map(function(child) {
    copy.adopt(child.copy())
  })
  return copy
}

/**
 * Sets this selector to have no parent.
 *
 * @api private
 */

Selector.prototype.orphan = function() {
  if (this.parent) {
    var index = this.parent.children.indexOf(this)
    if (index !== -1) {
      this.parent.children.splice(index, 1)
    }
  }
}

/**
 * Set another selector as one of this selector's children.
 *
 * @api private
 */

Selector.prototype.adopt = function(selector) {
  selector.orphan()
  selector.parent = this
  selector.indents = this.indents + 1
  this.children.push(selector)
}

Selector.prototype.mergeInto = function(selector) {
  this.properties.forEach(function(property) {
    selector.properties.push(property.copy());
  });
  this.children.forEach(function(child) {
    selector.adopt(child.copy());
  });
}


/**
 * Return selector string.
 *
 * @return {string}
 * @api private
 */

Selector.prototype.selector = function() {
  var selector = this.string
  if (this.parent)
    if (this.continuation) {
      var parent_selector = this.parent.selector();
      selector = selector.replace(/&/g, parent_selector);
    } else {
      selector = this.mixin
        ? this.parent.selector()
        : this.parent.selector() + ' ' + selector
    }
  return selector
}

/**
 * Return selector and nested selectors as CSS.
 *
 * @return {string}
 * @api private
 */

Selector.prototype.toString = function() {
  var stringified = (this.properties.length
      ? this.selector() + ' {\n' + this.properties.join('\n') + ' }\n'
      : '') + this.children.join('')
  if (stringified == '') return '';
  var indentation = '';
  if (this.indents > 1)
    indentation = '  '
  stringified =  stringified.replace(/^(.+)/gm, function(orig, name){
    return indentation + orig;
  })
  return stringified;

}

module.exports = Selector;

