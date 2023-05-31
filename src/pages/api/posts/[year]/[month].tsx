import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/libs/backend/withHandler";
import client from "@/libs/backend/client";
import { withApiSession } from "@/libs/backend/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "GET") {

    const { query: { year, month },
    session: { user } } = req;

    console.log(year, month)

    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });

    // TODO: 세미나 정보 접근권한 확인 (리뷰어이거나, 총무, 교수, 세미나담당자여야 함.)
    if (false) {
      return res.status(403).json({ ok: false, error: "Not allowed to access the data." })
    }

    const posts = await client.post.findMany({
      where: {
        originalYear: +year,
        originalMonth: +month,
      },
    });

    console.log(posts)

    res.json({
      ok: true,
      posts,
    });
  }

  if (req.method === "POST") {
    res.json({ ok: false });
  }

  // res.json({ok: true,})
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);