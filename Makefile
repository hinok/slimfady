test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		src/**/*Spec.js \
		--require babel-register \
		--reporter spec \
		--harmony \
		--bail \

test-watch:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		src/**/*Spec.js \
		--watch \
		--require babel-register \
		--reporter spec \
		--harmony \
		--bail \

.PHONY: test-watch
