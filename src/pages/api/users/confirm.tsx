import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/libs/backend/withHandler";
import client from "@/libs/backend/client";
import { withApiSession } from "@/libs/backend/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { token } = req.body;
  
  const foundToken = await client.token.findUnique({
    where: {
      payload: token,
    },
  });

  if (!foundToken)
  {
    return res.status(404).json({ ok: false, error: "Wrong token given." });
  }
  req.session.user = {
    id: foundToken.userId,
  };
  await req.session.save();
  await client.token.deleteMany({
    where: {
      userId: foundToken.userId,
    },
  });
  res.json({ ok: true });
}

export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPrivate: false })
);