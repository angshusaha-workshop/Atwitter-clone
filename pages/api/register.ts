import bcrypt from "bcryptjs";   

import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const { email, username, name, password } = req.body;

    if (!email || !username || !name || !password) {
      return res.status(422).json({ error: "Missing fields" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(422).json({ error: "Email already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, username, name, hashedPassword },
    });

    return res.status(200).json({ id: user.id, email: user.email });
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}