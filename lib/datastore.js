/** Class: Barefoot.DataStore
 * For the moment, barefoots collection does not introduce any new 
 * functionalities to Bacbkones collection. But to keep things straight when 
 * buildung your application with barefoot, <Barefoot.Model> is also 
 * available anyway :)
 *
 * If you are interested into how a model is synced on the server, have a look
 * at <Barefoot.APIAdapter.Server.sync>.
 */
var _ = require('underscore');

module.exports = function(mixin, Model) {
	var DataStore = Model.extend({});
	DataStore.prototype.sync = function() {};
	DataStore.prototype.fetch = function() {};
	DataStore.prototype.save = function() {};

	_.extend(DataStore.prototype, mixin);

	return DataStore;
};