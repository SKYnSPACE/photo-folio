import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/libs/backend/withHandler";
import client from "@/libs/backend/client";
import { withApiSession } from "@/libs/backend/withSession";

const getMonthName = (monthNumber) => {
  const monthNames = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  ];

  return monthNames[monthNumber - 1] || '';
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "GET") {

    const { query: { year },
    session: { user } } = req;

    if(!year){
      return res.status(403).json({ ok: false, error: "Year is not given." })
    }

    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });

    // TODO: Check the permissions of the user
    if (false) {
      return res.status(403).json({ ok: false, error: "Not allowed to access the data." })
    }

    const posts = await client.post.findMany({
      where: {
        originalYear: +year,
      },
      orderBy: {
        originalMonth: 'asc',
      },
    });

    const months = Array.from({ length: 12 }, (_, index) => {
      const monthName = getMonthName(index + 1);
      const matchingPosts = posts.filter((post) => post.originalMonth === index + 1);
      const selectable = matchingPosts.length > 0;
      return { id: monthName.toUpperCase(), selectable };
    });


    res.json({
      ok: true,
      months,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);