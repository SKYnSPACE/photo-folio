import type { NextApiRequest, NextApiResponse } from "next";
import { parseForm, FormidableError } from "@/libs/backend/parseForm";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<{
    ok: boolean;
    data: {
      url: string | string[];
      fileName: string | string[];
      extension: string | string[];
      token: string;
      fileIndex: number;
    } | null;
    error: string | null;
  }>
) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({
      ok: false,
      data: null,
      error: "Method Not Allowed",
    });
    return;
  }


  try {
    const { fields, files, token, fileIndex } = await parseForm(req);

    const file = files.media;
    const url = Array.isArray(file) ? file.map((f) => f.filepath) : file.filepath;
    console.log(token, fileIndex);
    // let url = files.filepath;
    const newFilename = Array.isArray(file) ? file.map((f) => f.newFilename) : file.newFilename;
    const indexOfLastDot = newFilename.lastIndexOf('.');
    const fileName = newFilename.slice(0, indexOfLastDot); //name only (w/o extension)
    const extension = newFilename.slice(indexOfLastDot +1);


    res.status(200).json({
      ok: true,
      data: {
        url,
        fileName,
        extension,
        token,
        fileIndex,
      },
      error: null,
    });
  } catch (e) {
    if (e instanceof FormidableError) {
      res.status(e.httpCode || 400).json({ ok: false, data: null, error: e.message });
    } else {
      console.error(e);
      res.status(500).json({ ok: false, data: null, error: "Internal Server Error" });
    }
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;