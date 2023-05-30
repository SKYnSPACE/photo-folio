import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/libs/backend/withHandler";
import { withApiSession } from "@/libs/backend/withSession";

import fs from 'fs';
import { join } from "path";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {


  const { query: { token } } = req;

  const filepath = join(process.cwd(), `/public/uploads/images/temp/${token}`);
  fs.access(filepath,
    fs.constants.F_OK, (err) => {
      if (err) return console.log("Cannot remove temp file.")
    });

  // fs.unlink(filepath, (err) => { err ?
  //   console.log(err) : console.log("File removed.")
  // }); // This only works for the file, not the folder.

  fs.rm(filepath, { recursive: true, force: true }, (err) => {
    err ?
      console.log(err) : console.log("Temp file removed.")
  });

  res.json({ ok: true, })

}

export default withApiSession(
  withHandler({
    methods: ["DELETE"],
    handler,
  })
);