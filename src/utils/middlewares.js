import { TrackRepo } from "../track/repo.js";
import jwt from "jsonwebtoken";
import { UserRepo } from "../auth/repo.js";

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.json({ success: false, message: "Token is required" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "ok");

    req.user = await UserRepo.find(
      { id: Number(decoded.sub) },
      { name: true, email: true, id: true },
    );

    next();
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
}
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success)
    return res.json({
      success: false,
      message: "Validation failed",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });

  req.validated = {
    ...req.validated,
    ...result.data,
  };

  next();
};
export async function trackOwner(req, res, next) {
  const track = await TrackRepo.find(
    { id: req.validated.params.id },
    { userId: true },
  );
  if (req.user.id !== track.userId)
    return res.json({
      success: false,
      message: "Forbidden",
    });

  next();
}
