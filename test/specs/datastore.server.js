describe('DataStore.Server', function() {
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

})