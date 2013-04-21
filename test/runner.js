var chai = require('chai')
	, barefootPath;
chai.should();


if(process.env.BAREFOOT_COVERAGE) {
	barefootPath = '../lib-cov';
} else {
	barefootPath = '../lib';
}
global.barefootPath = barefootPath;

/** Variable: Barefoot
 * Use this global variable to test anything public of barefoot.
 */
global.Barefoot = require(barefootPath);

/** Function: requireLibFile
 * Small helper function while running the tests which loads a particular module
 * from the barefoot source.
 *
 * Use this if you'd like to test a module which is usally not available to the
 * public.
 *
 * Parameters:
 *     (String) module - The module file you'd like to load.
 *
 * Returns:
 *     (Object) module
 */
global.requireLibFile = function(module) {
	return require(barefootPath + '/' + module);
}