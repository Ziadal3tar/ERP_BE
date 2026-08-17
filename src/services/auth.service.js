import jwt from "jsonwebtoken";
import crypto from "crypto";
import userRepository from "../repositories/user.repository.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "./email.service.js";
import sessionRepository from "../repositories/session.repository.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import hashToken from "../utils/hashToken.js";
class AuthService {
  async register(data) {
    const exists = await userRepository.exists({
      email: data.email,
    });

    if (exists) {
      throw new Error("Email already exists");
    }

    const user = await userRepository.create(data);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    user.verificationToken = hashToken(verificationToken);

    user.verificationExpires = Date.now() + 24 * 60 * 60 * 1000;

    await userRepository.save(user);

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    await sendEmail(
      user.email,
      "Verify Your Email",
      `
    <h1>Hello ${user.name}</h1>
    <p>If you received this email, everything is working correctly.</p>
    <p>${verificationUrl}</p>
    `,
    );

    const token = generateToken(user._id);
    return {
      success: true,
      message: "Please verify your email.",
    };
    // return {
    //     token,
    //     user
    // };
  }
  async verifyEmail(token) {
    const hashed = hashToken(token);

    const user = await userRepository.findOne({
      verificationToken: hashed,

      verificationExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      throw new Error("Invalid token");
    }
    if (user.isVerified) {
      throw new Error("Email already verified");
    }
    user.isVerified = true;

    user.verificationToken = null;

    user.verificationExpires = null;

    await userRepository.save(user);
  }
  async resendVerification(email) {
    const user = await userRepository.findOne({ email });

    if (!user) {
      return;
    }

    if (user.isVerified) {
      return;
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.verificationToken = hashToken(token);

    user.verificationExpires = Date.now() + 24 * 60 * 60 * 1000;

    await userRepository.save(user);

    const url = `${process.env.CLIENT_URL}/verify-email/${token}`;

    await sendEmail(
      user.email,

      "Verify Email",

      `<a href="${url}">Verify Email</a>`,
    );
  }
  async login(email, password, ip, userAgent) {
    const user = await userRepository.findOne(
      { email },
      { selectPassword: true },
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!user.isActive) {
      throw new Error("Account is disabled");
    }

    if (!user.isVerified) {
      throw new Error("Please verify your email");
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      throw new Error("Account locked. Please try again later.");
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        user.failedLoginAttempts = 0;
      }

      await userRepository.save(user);

      throw new Error("Invalid email or password");
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    user.lastLogin = new Date();

    await userRepository.save(user);

    const accessToken = generateToken(user._id);

    const refreshToken = generateRefreshToken(user._id);

    const refreshTokenHash = hashToken(refreshToken);

    await sessionRepository.deleteExpiredSessions();

    await sessionRepository.create({
      user: user._id,
      refreshTokenHash,
      ip,
      userAgent,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    user.password = undefined;

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async refreshToken(refreshToken, ip, userAgent) {
    if (!refreshToken) {
      throw new Error("Refresh token is required");
    }

    const refreshTokenHash = hashToken(refreshToken);

    let payload;

    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      throw new Error("Invalid refresh token");
    }

    const session =
      await sessionRepository.findByRefreshTokenHash(refreshTokenHash);

    if (!session) {
      throw new Error("Session not found");
    }

    if (session.expiresAt < new Date()) {
      await sessionRepository.deleteById(session._id);

      throw new Error("Session expired");
    }

    await sessionRepository.deleteById(session._id);

    const accessToken = generateToken(payload.id);

    const newRefreshToken = generateRefreshToken(payload.id);

    const newRefreshTokenHash = hashToken(newRefreshToken);

    await sessionRepository.create({
      user: payload.id,

      refreshTokenHash: newRefreshTokenHash,

      ip,

      userAgent,

      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken,

      refreshToken: newRefreshToken,
    };
  }

  async getProfile(userId) {
    return await userRepository.findById(userId);
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await userRepository.findOne(
      {
        _id: userId,
      },
      {
        selectPassword: true,
      },
    );

    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      throw new Error("Current password is incorrect");
    }

    user.password = newPassword;

    await userRepository.save(user);
  }

  async forgotPassword(email) {
    const user = await userRepository.findOne({ email });

    if (!user) {
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetExpires = Date.now() + 15 * 60 * 1000;

    await userRepository.save(user);

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail(
        user.email,

        "Reset Password",

        `
                <h2>Reset Password</h2>

                <p>Click below</p>

                <a href="${resetUrl}">
                    Reset Password
                </a>

                <p>Expires in 15 minutes.</p>
                `,
      );
    } catch (error) {
      user.passwordResetToken = null;

      user.passwordResetExpires = null;

      await userRepository.save(user);

      throw new Error("Unable to send email");
    }
  }

  async resetPassword(token, password) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userRepository.findOne(
      {
        passwordResetToken: hashedToken,

        passwordResetExpires: {
          $gt: Date.now(),
        },
      },

      {
        selectPassword: true,
      },
    );

    if (!user) {
      throw new Error("Invalid or expired token");
    }

    user.password = password;

    user.passwordResetToken = null;

    user.passwordResetExpires = null;

    await userRepository.save(user);
  }

  async logout(refreshToken) {
    if (!refreshToken) {
      return;
    }
    const refreshTokenHash = hashToken(refreshToken);

    await sessionRepository.deleteByRefreshTokenHash(refreshTokenHash);
  }

  async revokeSession(id, userId) {
    const session = await sessionRepository.findById(id);

    if (!session) {
      throw new Error("Session not found");
    }

    if (session.user.toString() != userId.toString()) {
      throw new Error("Unauthorized");
    }

    await sessionRepository.deleteById(id);
  }
}

export default new AuthService();
