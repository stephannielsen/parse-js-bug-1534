# Broken Parse Server / Parse JS SDK Example

* https://github.com/parse-community/Parse-SDK-JS/issues/1534

This is a simple sample app to reproduce a bug since 3.4.2 of Parse JS SDK when using `userFromJWT` feature in cloud functions with `request.user`.

## Get started

Connect this to a mongodb-runner instance and connect parse dashboard. Create a new user, insert this user's ID in `app.ts` -> `authenticateIfNeeded` method where the pointer is created.

Create a new entry in `Related` class and link the new user to the `users` relation.

Call the cloud function:

* `POST http://localhost:1337/parse/functions/testRelation`
  * Http Header `X-Parse-Application-Id: ParseTest`
  * Http Header `Authorization: Use` (value is not important)

The bug seems connected to using `req['userFromJwt']`, as you can send a valid session token in the request instead of `Authorization` header -> cloud function returns correct results.

## Expect

* JS SDK <= 3.4.1: The above created relation is returned correctly
* JS SDK >= 3.4.2: No results are returned