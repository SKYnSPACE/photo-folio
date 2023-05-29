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

    const {
      body: { title, date, time, descriptions, 
        imageToken, fileIndex,
      },
      session: { user },
    } = req;

    console.log(req.body)

    if(imageToken){
      console.log(imageToken)
      const originalDir = join(process.cwd(), `/public/uploads/images/temp/${imageToken}`);
      const newDir = join(process.cwd(), `/public/uploads/images/${imageToken}`);
      fs.access(originalDir,
        fs.constants.F_OK, (err) => {
          if (err) return console.log("Cannot access files.")
        });

      fs.rename(originalDir,newDir, (err) => {
        err ?
          console.log(err) : console.log("File moved.")
      });
    }

    const currentUser = await client.user.findUnique({
      where: { id: user?.id },
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