/** Class: APIAdapter
 */

var _ = require('underscore')
	, Backbone = require('backbone');

var APIAdapter = function(options) {
	if(_.isUndefined(options)) {
		options = {};
	}

	this.initialize.apply(this, arguments);
};

// To make APIAdapter looking and behave like any backbone object, kidnap the
// extend function from any other Backbone object. Does not harm anyone :)
APIAdapter.extend = Backbone.Model.extend;

_.extend(APIAdapter.prototype, Backbone.Events, {

});

function applyMixin(mixin) {
    _.extend(APIAdapter.prototype, mixin);
    return APIAdapter;
}

module.exports = applyMixin;