/** Class: Barefoot.Errors
 * This class contains a set of predefined error objects which are thought to be
 * used in your API route callbacks. (<Barefoot.APIAdapter>)
 *
 * Each of these errors contain a proper HTTP status code which will be
 * delivered to the requesting client in case of an error.
 *
 * If you'd like to create your own error, you can use the <createError>
 * function to simplify the process.
 *
 * How to create a new error:
 *
 * > var errors = require('barefoot').errors;
 * > var MyError = errors.createError(500, 'MyError');
 * > throw new MyError('Something went terribly wrong :(');
 *
 * How to use builtin errors:
 *
 * > var errors = require('barefoot').errors;
 * > throw new errors.NotFoundError('Contact not found!');
 */

/** Function: createError
 * Creates an Error with a specified HTTP status code and name. The resulting
 * function object can take a message as parameter.
 *
 * Parameters:
 *     (int) httpStatusCode - An HTTP status code representing this error when
 *                            thrown on the server.
 *     (String) name - The name of the error
 *
 * Returns:
 *     (Function) an error object which can be created via new
 */
function createError(httpStatusCode, name) {
	var barefootError = function(message) {
		this.name = name;
		this.httpStatusCode = httpStatusCode;
		this.message = message || '';
	};

	barefootError.prototype = new Error();
	barefootError.prototype.constructor = barefootError;
	return barefootError;
}

/** Error: NotFoundError
 * If any resource was not found, this is the generic error for that situation.
 * It is represented by an HTTP Not Found (404) status code.
 *
 * Parameters:
 *     (String) message - An additional message assigned to the error
 */
var NotFoundError = createError(404, 'Not Found');

module.exports = {
	createError: createError
	, NotFoundError: NotFoundError
};