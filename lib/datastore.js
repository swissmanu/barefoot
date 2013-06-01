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
 * You may wonder how the DataStore accomplishes the data transfer from the
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
 * Ensures that an empty registeredModelsAndCollections instance variable is
 * created for the DataStore.
 */
function initialize() {
	this.registeredModelsAndCollections = {};
}

/** Function: registerModel
 * Registers a specific <Barefoot.Model> with the given identifier. This
 * information is needed when serializing the DataStore for transferring data to
 * the client.
 *
 * You will not be able to serialize a store containing models which were not
 * registered before!
 *
 * Important:
 * Do not register "instances" of a model. Instead, register its "class".
 *
 * Parameters:
 *     (String) identifier - A unique identifier for this model type
 *     (Barefoot.Model) model - Model type
 */
function registerModel(identifier, model) {
	this.registeredModelsAndCollections[identifier] = model;
}

/** Function: registerCollection
 * Registers a specific <Barefoot.Collection> and the <Barefoot.Model>s which
 * are contained in it with the given identifier. This information is needed
 * when serializing the DataStore for transferring data to the client.
 *
 * You will not be able to serialize a store containing collections which were
 * not registered before!
 *
 * Important:
 * Do not register "instances" of a collection. Instead, register its "class".
 *
 * Parameters:
 *     (String) identifier - A unique identifier for this collection type
 *     (Barefoot.Collection) collection - Collection type
 *     (Barefoot.Model) model - Model type contained in the collection
 */
function registerCollection(identifier, collection, model) {
	this.registeredModelsAndCollections[identifier] = {
		collectionClass: collection
		, modelClass: model
	};
}

/** Function: getRegisteredModelsAndCollections
 * Returns an object literal containing all currently registered models and
 * collections.
 *
 * Returns:
 *     (Object) an object containing all registered <Barefoot.Model> and
 *              <Barefoot.Collection>.
 */
function getRegisteredModelsAndCollections() {
	return this.registeredModelsAndCollections;
}

/** Function: findRegisteredIdentifier
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
function findRegisteredIdentifier(modelOrCollection) {
	var foundKey;

	for(var key in this.registeredModelsAndCollections) {
		var registeredModelOrCollection =
			this.registeredModelsAndCollections[key];

		if(modelOrCollection.constructor === registeredModelOrCollection) {
			foundKey = key;
			break;
		} else {
			if(_.has(registeredModelOrCollection, 'collectionClass') &&
				modelOrCollection.constructor ===
				registeredModelOrCollection.collectionClass) {

				foundKey = key;
				break;
			}
		}
	}

	return foundKey;
}

module.exports = function(mixin, Model) {
	var DataStore = Model.extend();

	DataStore.prototype.initialize = initialize;
	DataStore.prototype.registerModel = registerModel;
	DataStore.prototype.registerCollection = registerCollection;
	DataStore.prototype.getRegisteredModelsAndCollections =
		getRegisteredModelsAndCollections;
	DataStore.prototype.findRegisteredIdentifier =
		findRegisteredIdentifier;
	DataStore.prototype.sync = function() {};
	DataStore.prototype.fetch = function() {};
	DataStore.prototype.save = function() {};

	_.extend(DataStore.prototype, mixin);

	return DataStore;
};