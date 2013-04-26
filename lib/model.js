/** Class: Barefoot.Model
 * For the moment, barefoots model does not introduce any new
 * functionalities to Backbones model. But to keep things straight when
 * buildung your application with barefoot, <Barefoot.Model> is also
 * available :)
 *
 * If you are interested into how a model is synced on the server, have a look
 * at <Barefoot.APIAdapter.Server.sync>.
 */
var Backbone = require('backbone')
	, _ = require('underscore');

var Model = Backbone.Model.extend({});

module.exports = function(mixin) {
    _.extend(Model.prototype, mixin);
    return Model;
};