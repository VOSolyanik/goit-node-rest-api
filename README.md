# goit-node-rest-api

## HW 5 Avatars

### Results:

AUTH-operations and file upload:

```bash
npm start

> start
> node ./app.js

Database connection successful
Server is running. Use our API on port: 3000
POST /api/auth/register 201 100 - 280.031 ms
POST /api/auth/login 200 347 - 1702.359 ms
PATCH /api/auth/avatar 200 203 - 1803.869 ms
PATCH /api/auth/avatar 401 28 - 2.227 ms #Unauthorized without token

```

Run unit tests:

```bash
npm run test

> test
> cross-env NODE_ENV=test NODE_OPTIONS='--experimental-vm-modules' npx jest

(node:32405) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
 PASS  controllers/authController.spec.js
  AuthController
    register
      ✓ should register a user successfully (2 ms)
      ✓ should handle registration errors (1 ms)
    login
      ✓ should login a user successfully (1 ms)
      ✓ should handle invalid credentials
      ✓ should handle login service errors (1 ms)
    logout
      ✓ should logout a user successfully
      ✓ should handle logout errors
    getCurrentUser
      ✓ should get current user successfully
      ✓ should handle get current user errors
    updateCurrentUserAvatar
      ✓ should update user avatar successfully (1 ms)
      ✓ should handle update avatar errors

Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
Snapshots:   0 total
Time:        0.239 s, estimated 1 s
Ran all test suites.
```

#### References:

- [Route](./routes/authRouter.js)
- [Controller](./controllers/authController.js)
- [Service](./services/authService.js)
- [Middleware](./middlewares/upload.js)