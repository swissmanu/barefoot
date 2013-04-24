# Barefoot
Barefoot makes code sharing between browser and server reality. Write your application once and run it on both ends of the wire.

It builds upon the popular [Backbone.JS](http://backbonejs.org/) library and keeps its own additions as unobtrusive as possible.

Server side execution is accomplished by using [Node.JS](http://nodejs.org/) and [Express.JS](http://expressjs.com/). Once delivered to the users browser, no additional JavaScript libraries are needed when configured properly.

If you implement your views with care, your application will match the [Unobtrusive JavaScript](http://roca-style.org/#unobtrusive-javascript) principle completely.

[![Build Status](https://travis-ci.org/swissmanu/barefoot.png?branch=master)](https://travis-ci.org/swissmanu/barefoot) [![Coverage Status](https://coveralls.io/repos/swissmanu/barefoot/badge.png?branch=master)](https://coveralls.io/r/swissmanu/barefoot)


## Progress
* Router / History: *implemented*
* View: *implemented*
* Model: *implemented*
* Collection: *implemented*
* Restore Models after rendering on server: *implemented*

## Documentation
The latest version of the code documenation is available here:
* http://swissmanu.github.io/barefoot/docs/

To generate a set of documentation locally, make sure you have [NaturalDocs](http://www.naturaldocs.org/) installed on your system. To build the documentation into the `docs` subdirectory, simply run `make docs` on your command line.
