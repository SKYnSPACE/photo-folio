import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/libs/backend/withHandler";
import client from "@/libs/backend/client";
import { withApiSession } from "@/libs/backend/withSession";


async function getPostCounts(year) {
  let whereCondition = {};
  if (year) {
    whereCondition = { originalYear: parseInt(year) };
  } else {
    whereCondition = { originalYear: { gte: 2010, lte: 2023 } };
  }

  const postCounts = await client.post.groupBy({
    by: ['originalYear'],
    _count: {
      _all: true,
    },
    where: whereCondition,
  });

  return postCounts;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "GET") {

    const { query: { year },
    session: { user } } = req;

    console.log(year)

    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });

    // TODO: Check the permissions of the user
    if (false) {
      return res.status(403).json({ ok: false, error: "Not allowed to access the data." })
    }

    const postCounts = await getPostCounts(year);

    res.json({
      ok: true,
      postCounts,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);