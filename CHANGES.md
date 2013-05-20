# Changes
## 0.0.6
* `APIAdapter.Server` uses [winston](https://github.com/flatiron/winston) for logging errors now
* `APIAdapter.Server` does not crash anymore if an `error` callback does not supply an error object as argument
* `APIAdapter.Server` forwards the error message to the REST HTTP client for easier bug tracking

## 0.0.5
* Stack multiple callbacks to an APIAdapter route. Call `success` to proceed with the next callback, call `error` to stop the execution of any further callback.
