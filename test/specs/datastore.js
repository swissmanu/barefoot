describe('DataStore', function() {
	var dataStore
		, apple = new Barefoot.Model({ name: 'Apple' })
		, vegs = new Barefoot.Collection([
			new Barefoot.Model({ name: 'Tomato' })
			, new Barefoot.Model({ name: 'Salad' })
		]);

	beforeEach(function() {
		dataStore = new Barefoot.DataStore();
		dataStore.set('apple', apple);
		dataStore.set('vegs', vegs);
	})

	describe('toJSON', function() {
		it('should return a proper JSON representation of the store', function() {
			var actualJSON = JSON.stringify(dataStore.toJSON())
				, expectedJSON =
					'{"apple":{"name":"Apple"},' +
					'"vegs":[{"name":"Tomato"},{"name":"Salad"}]}';

			actualJSON.should.be.equal(expectedJSON);
		})
	})
})