var cheerio = require('cheerio')
	, _ = require('underscore')
	, Backbone = require('backbone');

//Backbone.View.prototype.toHTML = function toHTML() {
function toHTML() {
	var html = this.template
		, $ = cheerio.load(html);

	console.dir(this.subviews);
	console.log('--');

	_.each(this.subviews, function(subview) {
		//var subviewHTML = subview.toHTML.bind(subview)();
		//$(subview.el).html(subviewHTML);
	});

	return $.html();
};

function setElement() {};
function delegateEvents() {};


module.exports = {
	toHTML: toHTML
	, setElement: setElement
	, delegateEvents: delegateEvents
};