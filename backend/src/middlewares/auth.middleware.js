import jwt from "jsonwebtoken";
import { db } from "../db/db.js";

export const authToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in auth middleware:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const authAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden - You do not have permission to access this resource",
      });
    }

    next();
  } catch (error) {
    console.error("Error in authAdmin middleware:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
