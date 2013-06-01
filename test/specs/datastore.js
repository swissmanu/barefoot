describe('DataStore', function() {
	var dataStore
		, Model = Barefoot.Model.extend()
		, Collection = Barefoot.Collection.extend();


	describe('registerModel', function() {
		it('should register a model with given key', function() {
			var identifier = 'model'
				, expected = {};
			expected[identifier] = Model;
			dataStore = new Barefoot.DataStore();

			dataStore.registerModel(identifier, Model);
			dataStore.getRegisteredModelsAndCollections().should.be.eql(expected);
		})
	})

	describe('registerCollection', function() {
		it('should register a collection with given key', function() {
			var identifier = 'collection'
				, expected = {};
			expected[identifier] = {
				collectionClass: Collection
				, modelClass: Model
			};
			dataStore = new Barefoot.DataStore();

			dataStore.registerCollection(identifier, Collection, Model);
			dataStore.getRegisteredModelsAndCollections().should.be.eql(expected);
		})
	})

	describe('getRegisteredModelsAndCollections', function() {
		it('should return all currently registered models', function() {
			var modelIdentifier = 'model'
				, collectionIdentifier = 'collection'
				, expected = {};

			expected[modelIdentifier] = Model;
			expected[collectionIdentifier] = {
				collectionClass: Collection
				, modelClass: Model
			};
			dataStore = new Barefoot.DataStore();

			dataStore.registerModel(modelIdentifier, Model);
			dataStore.registerCollection(collectionIdentifier, Collection, Model);
			dataStore.getRegisteredModelsAndCollections().should.be.eql(expected);
		})
	})
})