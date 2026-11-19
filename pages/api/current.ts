import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    const { currentUser } = await serverAuth(req, res);
    // হ্যাশ করা পাসওয়ার্ড ক্লায়েন্টে পাঠানো হচ্ছে না
    const { hashedPassword, ...safeUser } = currentUser;
    return res.status(200).json(safeUser);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}