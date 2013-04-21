/** Class: Barefoot.Errors
 *
 */

/** Function: createError
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
	}

	barefootError.prototype = new Error();
	barefootError.prototype.constructor = barefootError;
	return barefootError;
}

/** Function: NotFoundError
 * 
 * Parameters:
 *     (String) message - An additional message assigned to the error
 */
var NotFoundError = createError(404, 'Not Found');



module.exports = {
	createError: createError
	, NotFoundError: NotFoundError
};