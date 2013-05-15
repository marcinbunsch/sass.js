// --- Property

/**
 * Initialize property with _name_ and _val_.
 *
 * @param  {string} name
 * @param  {string} val
 * @api private
 */

function Property(parser, name, val) {
  this.parser = parser;
  this.name = name
  this.val = val
}

/**
 * Return a copy of this property.
 *
 * @return {Property}
 * @api private
 */

Property.prototype.copy = function() {
  return new Property(this.parser, this.name, this.val);
}

/**
 * Return CSS string representing a property.
 *
 * @return {string}
 * @api private
 */

Property.prototype.toString = function() {
  return '  ' + this.name + ': ' + this.getValue() + ';'
}

/**
 * Return CSS string representing a property.
 *
 * @return {string}
 * @api private
 */
Property.prototype.getValue = function() {
  return this.val;
}

module.exports = Property;

