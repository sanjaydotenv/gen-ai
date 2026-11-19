import bcrypt from "bcryptjs";
import { User } from "../models/User.model.js";
import { generateToken } from "../utils/generateToken.js";

function publicUser(user) {
  return typeof user.toJSON === "function" ? user.toJSON() : {
    id: String(user._id),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export class AuthServiceError extends Error {
  constructor(status, message, errors = null) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export async function registerUser({ name, email, password }, jwtSecret) {
  console.log(name , email , password)
  const existingUser = await User.findOne({ email }).select("_id").lean();
  if (existingUser) {
    throw new AuthServiceError(409, "An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  let user;
  try {
    user = await User.create({ name, email, passwordHash });
  } catch (error) {
    if (error?.code === 11000) {
      throw new AuthServiceError(409, "An account with this email already exists.");
    }
    throw error;
  }

  const accessToken = generateToken(user.id, jwtSecret);
  return { user: publicUser(user), accessToken };
}

export async function loginUser({ email, password }, jwtSecret) {
  const user = await User.findOne({ email }).select("+passwordHash");
  const passwordMatches = user && await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw new AuthServiceError(401, "Email or password is incorrect.");
  }

  const accessToken = generateToken(user.id, jwtSecret);
  return { user: publicUser(user), accessToken };
}

export async function getUserById(userId) {
  const user = await User.findById(userId);
  if (!user) {
    return null;
  }
  return publicUser(user);
}
