default:
	npm install

start:
	rm -rf .build
	npm start

lint:
	npm run lint

clean:
	rm -rf node_modules
	npm cache clean --force
	npm install

test-unit:
	NODE_ENV=test \
	npx mocha --exit \
	./test/unit/**/*.test.js

test-int:
	NODE_ENV=test \
	npx mocha --exit \
	./test/integration/**/*.test.js

test-all:
	npm run test

publish:
	npm publish --access public --dry-run

publish-prod:
	npm publish --access public