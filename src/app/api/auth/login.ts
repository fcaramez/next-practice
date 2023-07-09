import { getEnvVars, prisma } from "@/app/lib";
import { ApiResponse } from "@/types/api";
import { NextApiRequest, NextApiResponse } from "next";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

interface LoginBody extends NextApiRequest {
  body: {
    email: string;
    password: string;
  };
}

const { TOKEN_SECRET } = getEnvVars();

export default async function index(
  req: LoginBody,
  res: NextApiResponse<ApiResponse>
) {
  try {
    if (req.method !== "POST")
      return res.status(405).json({
        message: "Invalid method",
        success: false,
      });

    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({
        message: "Fields are mandatory",
        success: false,
      });

    const userToFind = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!userToFind)
      return res.status(403).json({
        message: "This user does not exist",
        success: false,
      });

    const validatePassword = await bcrypt.compare(
      password,
      userToFind.password
    );

    if (!validatePassword)
      return res.status(403).json({
        message: "Invalid password",
        success: false,
      });

    const payload = {
      username: userToFind.username,
      email: userToFind.email,
      userId: userToFind.id,
    };

    const authToken = jwt.sign(payload, TOKEN_SECRET);

    return res.status(200).json({
      message: `Welcome back, ${userToFind.username}`,
      success: true,
      data: {
        ...payload,
        authToken,
      },
    });
  } catch (_) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}
