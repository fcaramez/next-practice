import { getEnvVars, prisma } from "@/app/lib";
import { ApiResponse } from "@/types/api";
import { NextApiRequest, NextApiResponse } from "next";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

interface SignupBody extends NextApiRequest {
  body: {
    username: string;
    email: string;
    password: string;
  };
}

const { TOKEN_SECRET } = getEnvVars();

export default async function index(
  req: SignupBody,
  res: NextApiResponse<ApiResponse>
) {
  try {
    if (req.method !== "POST")
      return res.status(405).json({
        message: "Method not allowed",
        success: false,
      });

    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({
        message: "Fields are mandatory",
        success: false,
      });

    const userToFind = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (userToFind)
      return res.status(403).json({
        message: "Email already in use",
        success: false,
      });

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    });

    const payload = {
      email: newUser.email,
      username: newUser.username,
      userId: newUser.id,
    };

    const authToken = jwt.sign(payload, TOKEN_SECRET);

    return res.status(201).json({
      message: `Welcome aboard, ${newUser.username}!`,
      success: true,
      data: {
        ...payload,
        authToken,
      },
    });
  } catch (_) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
}
