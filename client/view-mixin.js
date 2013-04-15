//Backbone.View.prototype.toHTML = function toHTML() {
var toHTML = function toHTML() {
	return this.template;
};

function prepareNestedView(nestedView) { }

module.exports = {
	toHTML: toHTML
	, prepareNestedView: prepareNestedView
};