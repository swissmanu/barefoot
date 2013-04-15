/** Mixin: Barefoot.server.View
 *
 */

var cheerio = require('cheerio')
	, _ = require('underscore')
	, Backbone = require('backbone');

/*
function addSubview(subview) {
	if(_.isUndefined(this.subviews)) this.subviews = [];
	this.subviews.push(subview);
}
*/

function setElement(element) {};
function delegateEvents() {};
function undelegateEvents() {};
function close() {};

module.exports = {
	setElement: setElement
	, delegateEvents: delegateEvents
	, undelegateEvents: undelegateEvents
	, close: close
};