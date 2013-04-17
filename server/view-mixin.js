/** Mixin: Barefoot.View.Server
 * Enhances the <Barefoot.View> class with server specific code fragmends.
 * "Enhancing" is quite exaggerate: Actually it ensures that a few Backbone
 * methods are replaced with an empty implementation since barefoot do not want
 * them to query any DOM elements when rendering a view on the server. Following
 * methods are overwridden:
 *
 * * setElement(element)
 * * delegateEvents()
 * * undelegateEvents()
 * * close(), actually not Backbone, but need an empty method body too
 *
 * See also:
 * * <Barefoot.View>
 */

function setElement() {}
function delegateEvents() {}
function undelegateEvents() {}
function close() {}

module.exports = {
	setElement: setElement
	, delegateEvents: delegateEvents
	, undelegateEvents: undelegateEvents
	, close: close
};