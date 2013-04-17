/** Class: Barefoot.View
 * The barefoot view extends the default backbone view by applying an
 * environment specific mixin to it.
 *
 * For further information, please refer to the regarding environment specific
 * mixins.
*
 * Environment Specific Mixins:
 *     - <Barefoot.View.Shared>
 *     - <Barefoot.View.Client>
 *     - <Barefoot.View.Server>
 *
 * Example View Implementation:
 *
 * > var MainView = Barefoot.View.extend({
 * >     el: 'body'
 * >     , initialize: function() {
 * >         this.addSubview(new NavigationView());
 * >     }
 * >     , template: '<header><h1>Application</h1><nav></nav></header>'
 * >               + '<section id="main"></section>';
 * >     , renderView: function() {
 * >         this.$el.html(this.template);
 * >     }
 * >     , events: {
 * >         'click h1': 'onClickTitle'
 * >     }
 * >     , onClickTitle: function onClickTitle(e) {
 * >         console.log('Yay! Title clicked.')
 * >     }
 * > });
 * The following sections discuss specific aspects/differences of this code
 * snippet in comparison to a common Backbone application.
 *
 * Where's the render() function?:
 * Working with <Barefoot.View>, you should never implement a render function.
 * Instead, do anything you'd do there inside of the *renderView* function.
 * Barefoot overwrites backbones render() with its own version
 * (see <Barefoot.View.Shared.render>) to accomplish hassle free view 
 * rendering, both on client and server.
 *
 * Subviews/Nested Views:
 * You may be used to create your views subviews directly in the render 
 * function and call their render function there.
 *
 * Barefoot supports you by providing the <Barefoot.View.Shared.addSubview> and
 * <Barefoot.View.Shared.removeSubview> functions. Use these functions inside
 * the initialization function of your view.
 * Managing subviews this way brings a few improvements:
 * * Barefoot can render views on its own on the server and the browser client
 * * You do not take care of destroying your view hiearchy when rendering a new
 *   view. Barefoot will handle this for you. (No more Zombies)
 */
var _ = require('underscore')
    , Backbone = require('backbone');

/* applyMixin
 * Applies a mixin to the given parameter by using underscores extend function.
 *
 * This function is exported via 'module.exports' directly.
 *
 * Parameters:
 *     (Object) - The mixin to apply
 *
 * Returns:
 *     A view object with the given mixin applied.
 */
function applyMixin(mixin) {
    var View = Backbone.View.extend({});
    _.extend(View.prototype, mixin);

    return View;
}

module.exports = applyMixin;