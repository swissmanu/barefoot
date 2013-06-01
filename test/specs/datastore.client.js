describe('DataStore.Client', function() {
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

	describe('parse', function() {
		beforeEach(function() {
			dataStore = new BarefootClient.DataStore();
		})

		it('should restore the stores state properly', function() {
			dataStore.registerModel('model', Model);
			dataStore.registerCollection('collection', Collection, Model);

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