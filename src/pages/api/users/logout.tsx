import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../libs/backend/withHandler";
import { withApiSession } from "../../../libs/backend/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  // console.log(req.session)
  await req.session.destroy();

  res.json({ ok: true });
}

export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPrivate: false })
);