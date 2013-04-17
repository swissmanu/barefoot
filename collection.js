var Backbone = require('backbone')
	, _ = require('underscore');


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
    var Collection = Backbone.Collection.extend({});
    _.extend(Collection.prototype, mixin);

    return Collection;
}

module.exports = applyMixin;