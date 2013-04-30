/** Class: Barefoot.CookieAdapter
 * 
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