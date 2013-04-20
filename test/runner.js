var chai = require('chai');
chai.should();


global.requireModule = function(module) {
	var moduleRoot = '../';

	if(process.env.BAREFOOT_COVERAGE) {
		moduleRoot = '/tmp/barefoot-src-cov/';
	}

	if(module.substr(0,2) === './') {
		module = moduleRoot + module.substr(2);
	}
	return require(module);
}