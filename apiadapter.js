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

// Just copy the extend function from Backbone. This will not harm anyone :)
APIAdapter.extend = Backbone.Model.extend;

_.extend(APIAdapter.prototype, Backbone.Events, {

});

function applyMixin(mixin) {
    _.extend(APIAdapter.prototype, mixin);
    return APIAdapter;
}

module.exports = applyMixin;