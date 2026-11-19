import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const { currentUser } = await serverAuth(req, res);
    const { body } = req.body;
    const { postId } = req.query;

    if (!postId || typeof postId !== "string") {
      throw new Error("Invalid ID");
    }

    if (!body || typeof body !== "string" || !body.trim()) {
      return res.status(422).json({ error: "Empty comment" });
    }

    const comment = await prisma.comment.create({
      data: { body, userId: currentUser.id, postId },
    });

    // পোস্টের মালিককে নোটিফিকেশন
    try {
      const post = await prisma.post.findUnique({ where: { id: postId } });

      if (post?.userId && post.userId !== currentUser.id) {
        await prisma.notification.create({
          data: { body: "Someone replied to your tweet!", userId: post.userId },
        });
        await prisma.user.update({
          where: { id: post.userId },
          data: { hasNotification: true },
        });
      }
    } catch (error) {
      console.log(error);
    }

    return res.status(200).json(comment);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}