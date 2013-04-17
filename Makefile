docs:
	-mkdir ./docs
	@NaturalDocs -i ./ -o HTML ./docs -p ./.naturaldocs -xi ./node_modules -s Default style

lint:
	@./node_modules/.bin/jshint *.js server/ client/ test/

test:
	@./node_modules/.bin/mocha --require test/runner.js --reporter spec test/specs/



.PHONY: docs test lint