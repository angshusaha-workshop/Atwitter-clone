import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    if (req.method === "POST") {
      const { currentUser } = await serverAuth(req, res);
      const { body } = req.body;

      if (!body || typeof body !== "string" || !body.trim()) {
        return res.status(422).json({ error: "Empty post" });
      }

      const post = await prisma.post.create({
        data: { body, userId: currentUser.id },
      });

      return res.status(200).json(post);
    }

    if (req.method === "GET") {
      const { userId } = req.query;

      const posts = await prisma.post.findMany({
        where: userId && typeof userId === "string" ? { userId } : undefined,
        include: {
          user: { omit: { hashedPassword: true } },
          comments: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json(posts);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}