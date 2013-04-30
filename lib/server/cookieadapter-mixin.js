/** Mixin: Barefoot.CookieAdapter.Server
 * This mixin contains client specific code for the <Barefoot.CookieAdapter>
 * component.
 *
 * See also:
 * * <Barefoot.CookieAdapter>
 * * <Barefoot.CookieAdapter.Client>
 */
var _ = require('underscore');

function get(key) {
	var value;
	if(this.cookies && _.has(this.cookies, key)) {
		value = this.cookies[key];
	}

	return value;
}

function set(key, value) {
	if(_.isUndefined(this.cookies)) {
		this.cookies = {};
	}

	this.cookies[key] = value;
}

module.exports = {
	get: get
	, set: set
};