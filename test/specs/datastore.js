describe('DataStore', function() {
	var dataStore
		, Model = Barefoot.Model.extend()
		, Collection = Barefoot.Collection.extend()
		, apple = new Model({ name: 'Apple' })
		, vegs = new Collection([
			new Model({ name: 'Tomato' })
			, new Model({ name: 'Salad' })
		])
		, jsonRepresentation = '{"apple":{"dataStoreModelIdentifier":"model","data":{"name":"Apple"}},"vegs":{"dataStoreModelIdentifier":"collection","data":[{"name":"Tomato"},{"name":"Salad"}]}}'
		, objectRepresentation = JSON.parse(jsonRepresentation);


	describe('registerModel', function() {
		it('should register a model with given key', function() {
			var identifier = 'model'
				, expected = {};
			expected[identifier] = Model;
			dataStore = new Barefoot.DataStore();

			dataStore.registerModel(identifier, Model);
			dataStore.getRegisteredModels().should.be.eql(expected);
		})
	})

	describe('getRegisteredModels', function() {
		it('should return all currently registered models', function() {
			var identifier = 'model'
				, expected = {};
			expected[identifier] = Model;
			dataStore = new Barefoot.DataStore();

			dataStore.registerModel(identifier, Model);
			dataStore.getRegisteredModels().should.be.eql(expected);
		})
	})
})