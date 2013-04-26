/** Mixin: Barefoot.DataStore.Server
 * This mixin contains client specific code for the <Barefoot.DataStore>
 * component.
 *
 * Code for serializing the <DataStore> on the server is contained here.
 *
 * See also:
 * * <Barefoot.DataStore>
 * * <Barefoot.DataStore.Client>
 */
var _ = require('underscore');

/** Function: toJSON
 * Serializes all models and collections of this DataStore into a plain
 * JavaScript object.
 *
 * Beside the actual data, this object contains meta information to accomplish
 * a proper deserialisation with <Barefoot.DataStore.Client.parse>. This means,
 * the DataStore can completly restore its content from a given serialized
 * version of itself, including correct model and collection types.
 *
 * Please make sure you registered all model and collection types with
 * <Barefoot.DataStore.registerModel> and
 * <Barefoot.DataStore.registerCollection>. Otherwise parse will throw an  error
 * as soon as i tries to deserialize such an object.
 *
 * Returns:
 *     (Object) A serialized version of this DataStore
 */
function toJSON() {
	var self = this
		, keys = self.keys()
		, serializedStore = {};

	_.each(keys, function(key) {
		var model = self.get(key)
			, jsonRepresentation = model.toJSON()
			, identifier = self.findRegisteredModelIdentifier.call(self, model);

		if(identifier) {
				var serializedData = {
					dataStoreModelIdentifier: identifier
					, data: jsonRepresentation
				};

			serializedStore[key] = serializedData;
		} else {
			throw new Error('Could not serialize DataStore because ' +
				'a required model was not registered before!');
		}

	});

	return serializedStore;
}


module.exports = {
	toJSON: toJSON
	, parse: function(){}
};