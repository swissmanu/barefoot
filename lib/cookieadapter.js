/** Class: Barefoot.CookieAdapter
 * The <CookieAdapter> gives generalized access to cookies on the client and
 * server side. You'll never have to create it by yourself. Barefoot makes it
 * available with the <Barefoot.Router>.
 *
 * Environment Specific Mixins:
 * * <Barefoot.CookieAdapter.Client>
 * * <Barefoot.CookieAdapter.Server>
 */
var _ = require('underscore')
	, Backbone = require('backbone');

var CookieAdapter = function(options) {
	if(_.isUndefined(options)) { options = {}; }
	if(options.cookies) { this.cookies = options.cookies; }

	this.initialize.apply(this, arguments);
};

_.extend(CookieAdapter.prototype, Backbone.Events, {
	initialize: function initialize() { }
});

function applyMixin(mixin) {
	_.extend(CookieAdapter.prototype, mixin);

	return CookieAdapter;
}

module.exports = applyMixin;