import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepo } from "./repo.js";

export class AuthController {
  static async register(req, res) {
    try {
      const { name, email, password } = req.validated.body;
      if (await UserRepo.find({ email }))
        return res.json({
          success: false,
          error: "Email is already registered",
        });

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await UserRepo.create({
        name,
        email,
        password: hashedPassword,
      });

      return res.json({
        success: true,
        message: "welcome " + user.name,
      });
    } catch (err) {
      return res.json({
        success: false,
        error: "Registration failed",
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.validated.body;
      const user = await UserRepo.find({ email });
      if (!user || !(await bcrypt.compare(password, user.password)))
        return res.json({
          success: false,
          message: "Invalid credentials",
        });

      const token = jwt.sign({ sub: String(user.id) }, "ok", {
        expiresIn: "7d",
      });

      return res.json({
        success: true,
        token,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        success: false,
        message: "Login failed",
      });
    }
  }

  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.validated.body;
      const user = await UserRepo.find({ id: req.user.id });
      if (!user) {
        return res.json({
          success: false,
          error: "User not found",
        });
      }

      if (!(await bcrypt.compare(currentPassword, user.password)))
        return res.json({
          success: false,
          error: "Current password is incorrect",
        });
      if (currentPassword === newPassword)
        return res.json({
          success: false,
          error: "New password must differ from current password2",
        });

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await UserRepo.update(
        { id: user.id },
        {
          password: hashedPassword,
        },
      );

      return res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (err) {
      console.log(err);
      return res.json({
        success: false,
        error: "Failed to change password",
      });
    }
  }
}
