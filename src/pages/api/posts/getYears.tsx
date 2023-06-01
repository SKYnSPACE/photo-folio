import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/libs/backend/withHandler";
import client from "@/libs/backend/client";
import { withApiSession } from "@/libs/backend/withSession";


async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "GET") {

    const { session: { user } } = req;


    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });

    // TODO: Check the permissions of the user
    if (false) {
      return res.status(403).json({ ok: false, error: "Not allowed to access the data." })
    }

    // const postCounts = await getPostCounts(year);

    const postCounts = await client.post.groupBy({
      by: ['originalYear'],
      _count: {
        _all: true,
      },
    });

    const years = Array.from({ length: 2024 - 2010 }, (_, index) => ({
      id: (2023 - index).toString(),
      moments: 0,
    }));

    postCounts.forEach((post) => {
      const year = post.originalYear.toString();
      const index = 2023 - parseInt(year);
      if (index >= 0 && index < years.length) {
        years[index].moments = post._count._all;
      }
    });

    res.json({
      ok: true,
      years,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);