/** Title: Barefoot
 * Barefoot makes code sharing between browser and server reality. Write your
 * application once and run it on both ends of the wire.
 *
 * It builds upon the popular Backbone.JS library and keeps its own additions as
 * unobtrusive as possible.
 *
 * Server side execution is accomplished by using Node.JS and Express.JS. Once
 * delivered to the users browser, no additional JavaScript libraries are
 * needed when configured properly.
 *
 * If you implement your views with care, your client side follows the
 * "Unobtrusive JavaScript" principle
 * (http://roca-style.org/#unobtrusive-javascript) completely.
 *
 * Author:
 * * Manuel Alabor, <manuel@alabor.me>
 *
 * Source on Github:
 * * https://github.com/swissmanu/barefoot
 *
 *
 * License:
 * Copyright (c) 2013 Manuel Alabor
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var barefootUtil = require('./util')
	, mixins = barefootUtil.loadMixins()
	, Router = require('./router')(mixins.RouterMixin)
	, View = require('./view')(mixins.ViewMixin)
	, Model = require('./model')(mixins.ModelMixin)
	, Collection = require('./collection')(mixins.CollectionMixin)
	, APIAdapter = require('./apiadapter')(mixins.APIAdapterMixin);

/* start
 * Starts your application using the given router.
 *
 * Parameters:
 *     (<Barefoot.Router>) Router - A <Barefoot.Router> class. Make sure you do
 *                                  *not* pass an instance! (no "new Router()"
 *                                  etc.)
 *     (Object) startOptions - These object literal is passed to the final
 *                             Router.
 */
function start(Router, startOptions) {
	mixins.startup(Router, APIAdapter, startOptions);
}

module.exports = {
	Router: Router
	, View: View
	, APIAdapter: APIAdapter
	, Model: Model
	, Collection: Collection
	, start: start
};