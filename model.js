var Backbone = require('backbone')
	, _ = require('underscore');


function sync() {
	
}



var Model = Backbone.Model.extend({});
Model.prototype.sync = sync;

module.exports = function(mixin) {
    _.extend(Model.prototype, mixin);
    return Model;
}