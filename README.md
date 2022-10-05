# Broken Parse Server / Parse JS SDK Example

* https://github.com/parse-community/Parse-SDK-JS/issues/1534

This is a simple sample app to reproduce a bug since 3.4.2 of Parse JS SDK when using `userFromJWT` feature in cloud functions with `request.user`.

## Get started

* Start MongoDB Runner `mongodb-runner start`
* `yarn install`
* `yarn start` // starts the parse-server instance
* `yarn relation` // Creates a new test user and related object or returns existing one, then calls `testRelation` cloud function which fails to return something.
* Change `authenticateIfNeeded` in `app.ts` as explained to fix it

The bug seems connected to using `req['userFromJwt']`, as you can send a valid session token in the request instead of `Authorization` header -> cloud function returns correct results.

## Expect

* JS SDK <= 3.4.1: The above created relation is returned correctly
* JS SDK >= 3.4.2: No results are returned