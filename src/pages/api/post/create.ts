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

    const dateTime = new Date(`${date}T${time}`);
    
    const originalDate = dateTime.toISOString();
    const originalYear = dateTime.getFullYear();
    const originalMonth = dateTime.getMonth() + 1; // Adding 1 since getMonth() returns zero-based month
    const originalDay = dateTime.getDate();
    const originalHour = dateTime.getHours();
    const originalMinute = dateTime.getMinutes();

    console.log(originalDate, originalYear, originalMonth, originalDay, originalHour, originalMinute);

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


    try {
      const newPost = await client.post.create({
        data: {
          title,
          content: descriptions,
          author: { connect: { id: currentUser.id } },
          originalDate,
          originalYear,
          originalMonth,
          originalDay,
          originalHour,
          originalMinute,
          token: imageToken,
          imageCount: fileIndex,
        },
      });

      res.json({ ok: true, data: newPost })
    } catch (error) {
      console.error(error);
      res.json({ ok: false, })
    }

    
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);