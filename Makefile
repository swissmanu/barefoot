docs:
	-mkdir ./docs
	@NaturalDocs -i ./ -o HTML ./docs -p ./.naturaldocs -xi ./node_modules -s Default style

lint:
	@node_modules/.bin/jshint *.js server/*.js client/*.js

.PHONY: docs lint