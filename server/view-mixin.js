var cheerio = require('cheerio')
	, _ = require('underscore')
	, Backbone = require('backbone');

//Backbone.View.prototype.toHTML = function toHTML() {
function toHTML($) {
	var html = this.template;
	return html;
};

function setElement() {};
function delegateEvents() {};


module.exports = {
	toHTML: toHTML
	, setElement: setElement
	, delegateEvents: delegateEvents
};