import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/libs/backend/withHandler";
import client from "@/libs/backend/client";
import { withApiSession } from "@/libs/backend/withSession";


async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {


  if (req.method === "POST") {

    const {
      body: { token },
      session: { user },
    } = req;

    const currentUser = await client.user.findUnique({
      where: { id: user?.id },
    });

    // Create a new TemporaryData record
    const newTemporaryData = await client.temporaryData.create({
      data: {
        payload: token,
        createdBy: {
          connect: { id: currentUser.id },
        },
      },
    });

    res.json({ ok: true, })
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);