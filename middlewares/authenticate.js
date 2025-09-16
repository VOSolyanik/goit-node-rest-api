import HttpError from "../helpers/HttpError.js";
import { verifyToken } from "../helpers/jwt.js";
import { findOneUser } from "../services/authService.js";

export default async function authenticate(req, _res, next) {
  const unauthorizedError = HttpError(401, "Not authorized");
	const header = req.headers.authorization || req.get("Authorization");
	if (!header) return next(unauthorizedError);

	// Split "Bearer token" into ["Bearer", "token"]
	const [scheme, token] = header.split(" ");
	if (scheme !== "Bearer" || !token) {
		return next(unauthorizedError);
	}

	// Verify token validity and expiration
	const { payload, error } = verifyToken(token);
	if (error) return next(unauthorizedError);

	// Find user by id from payload
	// and ensure that the token is still valid (not replaced/removed)
	const user = await findOneUser({ id: payload.id });

	if (!user) return next(unauthorizedError);
	if (!user.token || user.token !== token) {
		// token is valid cryptographically, but user has no token or it is different
		return next(unauthorizedError);
	}

	// Attach user to request object
	req.user = user;
	next();
}
