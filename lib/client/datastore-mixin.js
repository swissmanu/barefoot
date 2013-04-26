/** Mixin: Barefoot.DataStore.Client
 * This mixin contains client specific code for the <Barefoot.DataStore>
 * component.
 *
 * Code for deserializing a <DataStore> is placed here.
 *
 * See also:
 * * <Barefoot.DataStore>
 * * <Barefoot.DataStore.Server>
 */
var _ = require('underscore');

/** Function: parse
 * Takes serialized DataStore information (most commonly created with
 * <Barefoot.DataStore.Server.toJSON>) and tries to restore the described
 * datastructure.
 *
 * Please make sure you registered all model and collection types with
 * <Barefoot.DataStore.registerModel> and
 * <Barefoot.DataStore.registerCollection>. Otherwise parse will throw an  error
 * as soon as i tries to deserialize such an object.
 *
 * Parameters:
 *     (Object) serializedStore - An object contained the serialized
 *                                representation of a DataStore
 */
function parse(serializedStore) {
	var self = this
		, keys = _.keys(serializedStore);

	_.each(keys, function(key) {
		var serializedData = serializedStore[key]
			, identifier = serializedData.dataStoreModelIdentifier;

		if(!_.has(self.registeredModels, identifier)) {
			throw new Error('Could not deserialize DataStore because ' +
				'a required model was not registered before!');
		} else {
			var Model = self.registeredModels[identifier]
				, jsonRepresentation = serializedData.data
				, deserializedModel = new Model(jsonRepresentation);

			self.set(key, deserializedModel);
		}
	});
}


module.exports = {
	parse: parse
	, toJSON: function() {}
};