import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/libs/backend/withHandler";
import client from "@/libs/backend/client";

import nodemailer from "nodemailer";
import { postMail } from "@/libs/backend/postMail";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
): Promise<void> {
  const { email } = req.body;
  const user = email ? { email } : null;
  if (!user) return res.status(400).json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + "";

  const prevToken = await client.token.findFirst({
    where: {
      user: {
        ...user,
      }
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: -1, // Reverse the list
  })

  const currentTime = new Date();
  const sinceLastToken = (currentTime.getTime() - prevToken?.createdAt?.getTime()) / 1000;

  if (sinceLastToken < 60) {
    return res.status(429).json({ ok: false, error: {code: "429", message: `Take two minutes for the next login attempt.` }})
  }
  else {
    const newToken = await client.token.create({
      data: {
        payload,
        user: {
          connect: {
            ...user
          },
        },
      },
    });
  }


  postMail(email,
    'Login Info',
    `Your OTP: ${payload}. Do not reply to this email address.`,
    `<p>Your OTP: <b>${payload}</b></p> <p>Do not reply to this email address.</p>`,
    false
  );


  return res.json({
    ok: true,
  });
}

export default withHandler({ methods: ["POST"], handler, isPrivate: false });