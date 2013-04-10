var Backbone = require('backbone');

function addSubview(view) {
	this.subviews.push(view);
};

function render() {
	$(this.el).html(this.toHTML());
	return this;
};

module.exports = {
	addSubview: addSubview
	, render: render
};