var Backbone = require('backbone')
	, fs = require('fs')
	, _ = require('underscore')
	, cheerio = require('cheerio');


function preInitialize(options) {
	this.app = options.app;
	this.layoutTemplate = options.layoutTemplate;
	this.startExpressApp = options.startExpressApp;
}

function route(route, name) {
	var self = this;

	return self.app.get('/' + route, function(req, res) {
		var callback = self[self.routes[route]];
		self.res = res;

		return callback.apply(self, _.values(req.query));
	});
};

function render(view) {
	var $ = cheerio.load(this.layoutTemplate);

	if(!_.isUndefined(this.mainView)) {
		var clonedMainView = _.clone(this.mainView);
		clonedMainView.$ = $;
		clonedMainView.$el = $(clonedMainView.el);
		clonedMainView.render();
	}

	view.$ = $;
	view.$el = $(view.el);
	view.render();

	return this.res.send($.html());
};

function start() {
	this.startExpressApp();
};


module.exports = {
	preInitialize: preInitialize
	, route: route
	, render: render
	, start: start
};