var cheerio = require('cheerio')
	, _ = require('underscore')
	, Backbone = require('backbone');

function prepareNestedView(nestedView) {
	nestedView.$ = this.$;
	nestedView.$el = this.$(nestedView.el);

	return nestedView;
}

function setElement(element) {};
function delegateEvents() {};

module.exports = {
	setElement: setElement
	, delegateEvents: delegateEvents
	, prepareNestedView: prepareNestedView
};