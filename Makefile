TEST_CMD=./node_modules/.bin/mocha --require test/runner.js test/specs/

docs:
	@-mkdir ./docs
	@NaturalDocs -i ./ -o HTML ./docs -p ./.naturaldocs -xi test -xi ./node_modules -s Default style

lint:
	@./node_modules/.bin/jshint lib/

test:
	@$(TEST_CMD) --reporter spec

instrument-for-coverage:
	@jscoverage lib lib-cov


test-coveralls: instrument-for-coverage
	@BAREFOOT_COVERAGE=1 $(TEST_CMD) --reporter mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js lib
	@-rm -fr ./lib-cov

.PHONY: docs test test-coveralls lint