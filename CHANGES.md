# Changes
## 0.0.8
* Introduction of [Debug](https://github.com/visionmedia/debug) for code flow analysis. Thx @mweibel :)

## 0.0.7
* Introduced promises for rendering `Views` using [Q](https://github.com/kriskowal/q)
	* The `beforeRender` and `afterRender` hook has a `resolve` and `reject` argument now. These make it possible to wait for asynchronous function calls. Perfect for populating models with data from the `APIAdapter` before proceed with the actual rendering.

## 0.0.6
* `APIAdapter.Server` uses [winston](https://github.com/flatiron/winston) for logging errors now
* `APIAdapter.Server` does not crash anymore if an `error` callback does not supply an error object as argument
* `APIAdapter.Server` forwards the error message to the REST HTTP client for easier bug tracking

## 0.0.5
* Stack multiple callbacks to an APIAdapter route. Call `success` to proceed with the next callback, call `error` to stop the execution of any further callback.
