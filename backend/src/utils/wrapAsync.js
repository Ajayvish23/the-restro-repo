export default function wrapAsync(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}


// wrapAsync is a helper that catches errors from async route handlers and passes them to Express’s global error handler middleware.
// fn → your async route function
// Promise.resolve(...) → ensures the function is treated as a promise
// .catch(next) → sends any error to Express’s global error handler
// Without this, errors thrown inside async/await routes would crash the app or be ignored unless you manually wrote try/catch in every route.

