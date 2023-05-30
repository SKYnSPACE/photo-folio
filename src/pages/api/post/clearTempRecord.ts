import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/libs/backend/withHandler";
import client from "@/libs/backend/client";
import { withApiSession } from "@/libs/backend/withSession";

import fs from 'fs';
import { join } from "path";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "POST") {

    const { body: { token },
      session: { user }
    } = req;

    await client.temporaryData.deleteMany({
      where: { payload: token },
    });


    res.json({
      ok: true,
      message: 'Temporary data record removed successfully',
    });
  }

}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);