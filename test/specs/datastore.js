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

	

	describe('toJSON', function() {
		beforeEach(function() {
			dataStore = new Barefoot.DataStore();
			dataStore.set('apple', apple);
			dataStore.set('vegs', vegs);
		})

		it('should return a proper JSON representation of the store', function() {
			dataStore.registerModel('model', Model);
			dataStore.registerCollection('collection', Collection);

			var actualJSON = JSON.stringify(dataStore.toJSON());

			actualJSON.should.be.equal(jsonRepresentation);
		})

		it('when serializing a model which was not registered before, an error should be thrown', function() {
			(function() {
				dataStore.registerModel('model', Model);
				dataStore.toJSON();
			}).should.throw();
		})
	})

	describe('parse', function() {
		beforeEach(function() {
			dataStore = new BarefootClient.DataStore();
		})

		it('should restore the stores state properly', function() {
			dataStore.registerModel('model', Model);
			dataStore.registerCollection('collection', Collection);
			
			dataStore.parse(objectRepresentation);
			
			dataStore.get('apple').constructor.should.be.equal(Model);
			dataStore.get('apple').attributes.should.be.eql(apple.attributes);
			dataStore.get('vegs').constructor.should.be.equal(Collection);
		})

		it('when restoring a model which was not registered before, an error should be thrown', function() {
			(function() {
				dataStore.registerModel('model', Model);
				dataStore.parse(objectRepresentation);
			}).should.throw();
		})
	})
})