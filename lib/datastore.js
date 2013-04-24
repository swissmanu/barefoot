/** Class: Barefoot.DataStore
 * The DataStore is a core object and extends the <Barefoot.Model>.
 *
 * When rendering a <Barefoot.View> on the server, it will probably create,
 * read and modify <Model>s and <Collection>s. Delivering the views rendered
 * HTML  markup to the client is quite simple and straightforward, but never
 * enough: To set up and boot your application inside the users browser barefoot
 * needs to have the same information as it was present on the server after
 * finishing the rendering process.
 *
 * The DataStore hops in at exactly this point: It provides a centralized 
 * storage for <Model>s and <Collection>s which is serialized after rendering
 * a view on the server automatically. On the client, it checks for the presence
 * of such serialized data and deserializes it automatically if needed.
 *
 * This has one small, but important impact when developing your application 
 * with barefoot: All <Model>s and <Collection>s you need to transfer to the
 * client after a server side rendering needs to be stored inside the DataStore.
 *
 * For further information, please refer to the regarding environment specific
 * mixins.
 *
 * Environment Specific Mixins:
 *     - <Barefoot.DataStore.Client>
 *     - <Barefoot.DataStore.Server>
 *
 * In Depth:
 * You may wonder how the DataStore accomplishs the data transfer from the
 * server to the client.
 *
 * When rendering a <View>, the <Barefoot.Router.Server.render> function embeds
 * a script DOM element into the HTML body element containing a global function.
 * <Barefoot.Startup.Client> checks for the presence of this function and 
 * initiates the deserialization of the contained DataStore information if
 * needed.
 */
var _ = require('underscore');


/** Function: initialize
 * Ensures that an empty registeredModels instance variable is created for the
 * DataStore.
 */
function initialize() {
	this.registredModels = {};
}

/** Function: registerModel
 * Registers a specific <Barefoot.Model> or <Barefoot.Collection>
 * with the given identifier. This information is needed when serializing the
 * DataStore for transfering data to the client.
 *
 * You will not be able to serialize a store containing models which were not
 * registrered before!
 *
 * Important:
 * Do not register "instances" of a model. Instead, register its "class".
 *
 * Parameters:
 *     (String) identifier - A unique identifier for this model type
 *     (Barefoot.Model, Barefoot.Collection) model - Model/Collection type
 */
function registerModel(identifier, model) {
	this.registredModels[identifier] = model;
}

/** Function: registerCollection
 * An alias for <registerModel>.
 *
 * Parameters:
 *     (String) identifier - A unique identifier for this model type
 *     (Barefoot.Model, Barefoot.Collection) model - Model/Collection type
 */
function registerCollection(identifier, model) {
	this.registerModel(identifier, model);
}

/** Function: getRegisteredModels
 * Returns an object literal containing all currently registered models and
 * collections.
 *
 * Returns:
 *     (Object) an object containing all registered <Barefoot.Model> and 
 *              <Barefoot.Collection>
 */
function getRegisteredModels() {
	return this.registredModels;
}

/** Function: findRegistredModelIdentifier
 * Scans the registered models and collections for the given model. When found,
 * the identifier of the registration gets returned. Otherwise undefined is
 * returned.
 *
 * Parameters:
 *     (<Barefoot.Model>, <Barefoot.Collection>) model - Concrete instance of a
 *                                                       model or collection.
 *
 * Returns:
 *     (String, undefined) the identifier of model if found, undefined if no
 *                         match
 */
function findRegistredModelIdentifier(model) {
	var foundKey;

	for(var key in this.registredModels) {
		var registredModel = this.registredModels[key];

		if(model.constructor === registredModel) {
			foundKey = key;
			break;
		}
	}

	return foundKey;
}

module.exports = function(mixin, Model) {
	var DataStore = Model.extend();

	DataStore.prototype.initialize = initialize;
	DataStore.prototype.registerModel = registerModel;
	DataStore.prototype.registerCollection = registerCollection;
	DataStore.prototype.getRegisteredModels = getRegisteredModels;
	DataStore.prototype.findRegistredModelIdentifier =
		findRegistredModelIdentifier;
	DataStore.prototype.sync = function() {};
	DataStore.prototype.fetch = function() {};
	DataStore.prototype.save = function() {};

	_.extend(DataStore.prototype, mixin);

	return DataStore;
};