# goit-node-rest-api

## HW 4 Auth

### Results:

AUTH-operations:

```bash
npm start

> start
> node ./app.js

Database connection successful
Server is running. Use our API on port: 3000
POST /api/auth/register 409 34 - 1567.140 ms #Attempt to register with existing email
POST /api/auth/register 201 101 - 269.142 ms
POST /api/auth/login 400 38 - 2.857 ms #Attempt to login with invalid model
POST /api/auth/login 401 40 - 1776.772 ms #Attempt to login with invalid credentials
POST /api/auth/login 200 349 - 466.288 ms
GET /api/auth/current 401 28 - 0.915 ms #Attempt to get user without token
GET /api/auth/current 200 101 - 387.813 ms
POST /api/auth/logout 204 - - 1809.842 ms
POST /api/auth/logout 401 28 - 191.820 ms #Attempt to logout with token that not already in DB
GET /api/auth/current 401 28 - 1435.896 ms #Attempt to get user with token that not already in DB

```

#### References:

- [Route](./routes/authRouter.js)
- [Controller](./controllers/authController.js)
- [Service](./services/authService.js)
- [Middleware](./middlewares/authenticate.js)