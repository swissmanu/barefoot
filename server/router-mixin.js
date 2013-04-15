var Backbone = require('backbone')
	, fs = require('fs')
	, _ = require('underscore')
	, cheerio = require('cheerio');


function preInitialize(options) {
	this.app = options.app;
	this.layoutTemplate = options.layoutTemplate;
}

function route(route, name) {
	var self = this;

	return self.app.get(route, function(req, res) {
		var callback = self[self.routes[route]];
		self.res = res;

		return callback.apply(self, _.values(req.query));
	});
};

function render(view) {
	var $ = cheerio.load(this.layoutTemplate);

	view.$ = $;
	view.$el = $(view.el);
	view.render();

	return this.res.send($.html());
};

function start() {
	this.app.listen(3030, function() {
		console.log('Express server listening on port 3030');
	});
};


module.exports = {
	preInitialize: preInitialize
	, route: route
	, render: render
	, start: start
};