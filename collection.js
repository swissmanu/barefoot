/** Class: Barefoot.Collection
 * For the moment, barefoots collection does not introduce any new 
 * functionalities to Bacbkones collection. But to keep things straight when 
 * buildung your application with barefoot, <Barefoot.Collection> is also 
 * available anyway :)
 *
 * If you are interested into how a collection is synced on the server, have a
 * look at <Barefoot.APIAdapter.Server.sync>
 */
var Backbone = require('backbone')
	, _ = require('underscore');


var Collection = Backbone.Collection.extend({});

module.exports = function(mixin) {
    _.extend(Collection.prototype, mixin);
    return Collection;
};