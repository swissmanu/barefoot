var Backbone = require('backbone')
	, _ = require('underscore');


function sync() {
	
}



var Collection = Backbone.Collection.extend({});
Collection.prototype.sync = sync;

module.exports = function(mixin) {
    _.extend(Collection.prototype, mixin);
    return Collection;
}