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

    const { session: { user } } = req;

    const currentUser = await client.user.findUnique({
      where: { id: user.id },
      include: { temporaryData: true },
    });

    const temporaryData = currentUser.temporaryData;

    // Iterate over each TemporaryData record
    for (const tempData of temporaryData) {
      const filepath = join(process.cwd(), `/public/uploads/images/temp/${tempData.payload}`);

      try {
        // Check if file exists before removing it
        await fs.promises.access(filepath, fs.constants.F_OK);
        await fs.promises.rm(filepath, { recursive: true, force: true });
        console.log('User tempfile removed:', filepath);
      } catch (error) {
        console.error('Cannot reset user tempfile:', error);
      }
    }

    // Delete all TemporaryData related to the user
    await client.temporaryData.deleteMany({
      where: { createdById: +currentUser.id },
    });


    res.json({
      ok: true,
      message: 'Temporary data and files removed successfully' ,
    });
  }

}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);