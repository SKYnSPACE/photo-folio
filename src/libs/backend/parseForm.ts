import type { NextApiRequest } from "next";
import mime from "mime";
import { join } from "path";
import formidable from "formidable";
import { mkdir, rename, stat } from "fs/promises";
import path from "path";

import sharp from 'sharp';

import cryptoRandomString from 'crypto-random-string';

export const FormidableError = formidable.errors.FormidableError;

export const parseForm = async (
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files; token: string, fileIndex: number}> => {
  return await new Promise(async (resolve, reject) => {
    const token = cryptoRandomString({length: 16, type:'url-safe'});
    const uploadDir = join(
      process.env.ROOT_DIR || process.cwd(),
      `/public/uploads/images/temp/${token}`
    );
    
    try {
      await stat(uploadDir);
    } catch (e: any) {
      if (e.code === "ENOENT") {
        await mkdir(uploadDir, { recursive: true });
      } else {
        console.error(e);
        reject(e);
        return;
      }
    }

    // let filename = ""; //  To avoid duplicate upload
    // const form = formidable({
    //   maxFiles: 10,
    //   maxFileSize: 1024 * 1024 * 200, // 200mb
    //   uploadDir,
    //   filename: (name, ext, part) => {
    //     if (filename !== "") {
    //       return filename;
    //     }

    //     const extension = part.originalFilename.split(".").pop();
    //     filename = cryptoRandomString({length: 16, type:'url-safe'})+"."+ extension;
    //     return filename;
    //   },
    //   filter: (part) => {
    //     return (
    //       part.name === "media" && (part.mimetype?.includes("image") || false)
    //     );
    //   },
    // });

    let fileIndex = 0;
    const form = formidable({
      maxFiles: 20,
      maxFileSize: 1024 * 1024 * 200, // 200mb
      uploadDir,
      filename: (_name, _ext, part) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `${++fileIndex}.${
          mime.getExtension(part.mimetype || "") || "unknown"
        }`;
        return filename;
      },
      filter: (part) => {
        return (
          part.name === "media" && (part.mimetype?.includes("image") || false)
        );
      },
    });

    form.parse(req, async function (err, fields, files) {
      if (err) reject(err);
      else {
        // Convert files to png here
        for (const key in files) {
          const fileOrFiles = files[key];
        
          const processFiles = async (file) => {
            if (file && file.filepath) {
              console.log(file.filepath);
        
              const parsedPath = path.parse(file.filepath);
              
              // Check if the file is already a .png
              if(parsedPath.ext.toLowerCase() !== '.png') {
                const pngFilename = path.format({
                  ...parsedPath,
                  base: undefined, // Ignore base to respect name and ext
                  ext: '.png', // Change the extension to .png
                });
        
                await sharp(file.filepath)
                  .png()
                  .toFile(pngFilename);
        
                // Delete or move the original file if necessary
                // Here, we rename the original file to the pngFilename
                await rename(file.filepath, pngFilename);
        
                // Update file path in the files object
                file.filepath = pngFilename;
              }
            }
          }
        
          if (Array.isArray(fileOrFiles)) {
            await Promise.all(fileOrFiles.map(file => processFiles(file)));
          } else {
            await processFiles(fileOrFiles);
          }
        }
  
        resolve({ fields, files, token, fileIndex });
      }
    });
  });
};