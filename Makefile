TEST_CMD=./node_modules/.bin/mocha --require test/runner.js test/specs/
INSTRUMENTED_SOURCE=./lib-cov

docs:
	-mkdir ./docs
	@NaturalDocs -i ./ -o HTML ./docs -p ./.naturaldocs -xi test -xi ./node_modules -s Default style

lint:
	@./node_modules/.bin/jshint lib/

test:
	@$(TEST_CMD) --reporter spec

test-instrument-for-coverage:
	-rm -fr $(INSTRUMENTED_SOURCE)
	@jscoverage ./lib $(INSTRUMENTED_SOURCE)


test-coveralls: test-instrument-for-coverage
	@BAREFOOT_COVERAGE=1 $(TEST_CMD) --reporter mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js
	-rm -fr $(INSTRUMENTED_SOURCE)

.PHONY: docs test test-coveralls lint