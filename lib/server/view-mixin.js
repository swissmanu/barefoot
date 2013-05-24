/** Mixin: Barefoot.View.Server
 * Enhances the <Barefoot.View> class with server specific code fragments.
 * "Enhancing" is quite exaggerate: Actually it ensures that a few Backbone
 * methods are replaced with an empty implementation since barefoot do not want
 * them to query any DOM elements when rendering a view on the server. Following
 * methods are overridden:
 *
 * * setElement(element)
 * * delegateEvents()
 * * undelegateEvents()
 * * close(), actually not Backbone, but need an empty method body too
 *
 * See also:
 * * <Barefoot.View>
 */

var cheerio = require('cheerio')
	, _ = require('underscore');

function setElement() {}
function _ensureElement() {}
function delegateEvents() {}
function undelegateEvents() {}
function close() {}

module.exports = {
	setElement: setElement
	, _ensureElement: _ensureElement
	, delegateEvents: delegateEvents
	, undelegateEvents: undelegateEvents
	, close: close
	, $: (function() {
		if(_.isUndefined(this.$)) {
			this.$ = cheerio.load();
		}
		return this.$;
	})()
};