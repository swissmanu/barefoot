docs:
	-mkdir ./docs
	@NaturalDocs -i ./ -o HTML ./docs -p ./.naturaldocs -xi ./node_modules

.PHONY: docs