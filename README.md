![barefoot](https://raw.github.com/swissmanu/barefoot/master/barefoot.png)

Barefoot makes code sharing between browser and server reality. Write your application once and run it on both ends of the wire.

It builds upon the popular [Backbone.JS](http://backbonejs.org/) library and keeps its own additions as unobtrusive as possible.

Server side execution is accomplished by using [Node.JS](http://nodejs.org/) and [Express.JS](http://expressjs.com/). Once delivered to the users browser, no additional JavaScript libraries are needed when configured properly.

If you implement your views with care, your application will match the [Unobtrusive JavaScript](http://roca-style.org/#unobtrusive-javascript) principle completely.

[![Build Status](https://travis-ci.org/swissmanu/barefoot.png?branch=master)](https://travis-ci.org/swissmanu/barefoot) [![Coverage Status](https://coveralls.io/repos/swissmanu/barefoot/badge.png?branch=master)](https://coveralls.io/r/swissmanu/barefoot)


## Installation

	npm install node-barefoot

## Documentation
The latest version of the code documenation is available here:
* http://swissmanu.github.io/barefoot/docs/

To generate a set of documentation locally, make sure you have [NaturalDocs](http://www.naturaldocs.org/) installed on your system. To build the documentation into the `docs` subdirectory, simply run `make docs` on your command line.

[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/f87c96d81337e0f3f6a255aedc521c76 "githalytics.com")](http://githalytics.com/swissmanu/barefoot)

## Contribute
We are happy for any community contribution. For questions, feature requests or problems, please fill in an [issue](https://github.com/swissmanu/barefoot/issues/new). 

Feel free to fork and optimize barefoot here on Github. If you have a pull request with some cool additions, please make sure you have unit test cases ready.

## Barefoot vs. Rendr
When barefoot started to get developed, there was only one library which points into a similar direction as barefoot does: [Rendr](https://github.com/airbnb/rendr) by [airbnb](https://github.com/airbnb) accomplishes a client/server rendering with the same code base too. Eventhough it extends [Backbone.JS](http://backbonejs.org/) as barefoot does, there are some importent differences between the two frameworks (or library when talking of Rendr):

* Rendr forces you to use [Handlebars](http://handlebarsjs.com/), whereas you're free of any templating engine when using barefoot.
* Barefoot has [browserify](http://browserify.org/), or more precisely its Express.js middleware counterpart [browserify-middleware](https://github.com/ForbesLindesay/browserify-middleware) built in. Just one optimized code file will be transfered to your client.
* Rendr makes heavy use of [CoffeeScript](http://coffeescript.org/). Barefoot is pure JavaScript without any precompilation shizzle.
* Where Rendr checks many times if it is running on the server or in the browser, barefoot uses mixins after an initial environment check.

Barefoot and Rendr are both far away from being perfect and production-ready. Try both and see what fits best for your use case. Or even better, help improving them :)


## History of barefoot
The idea behind and the code of barefoot was initially developed as part of a [bachelors thesis](http://hsr-ba-ajw-2013.github.io/BA/) by [@mekanics](https://github.com/mekanics), [@mweibel](https://github.com/mweibel) and [@swissmanu](https://github.com/swissmanu/) during springtime 2013. We decided to decouple its logic into a distinct library early and made it available to the public here.
