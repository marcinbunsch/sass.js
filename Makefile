all: tests
	
tests:
	@node_modules/.bin/mocha test/sass_test.js
	
ruby:
	@script/compile_with_ruby_sass
  
