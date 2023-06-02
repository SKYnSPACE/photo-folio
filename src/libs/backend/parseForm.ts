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
): Promise<{ fields: formidable.Fields; files: formidable.Files; token: string, fileIndex: number }> => {
  return await new Promise(async (resolve, reject) => {
    const token = cryptoRandomString({ length: 16, type: 'url-safe' });
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
        const filename = `${++fileIndex}.${mime.getExtension(part.mimetype || "") || "unknown"
          }`;
        return filename;
      },
      filter: (part) => {
        return (
          part.name === "media" && (part.mimetype?.includes("image") || false)
        );
      },
      // Keep the original extension
      keepExtensions: true,
    });

    const files: formidable.Files = {};


    form.on('file', async function(name, file) {
      console.log(name);
      console.log(file);
      
      if (name === "media") {
        const parsedPath = path.parse(file.filepath);
        
        if (parsedPath.ext.toLowerCase() !== '.png') {
          const pngFilename = path.format({
            ...parsedPath,
            base: undefined, // Ignore base to respect name and ext
            ext: '.png', // Change the extension to .png
          });
    
          // Convert and save file to png
          try {
            await sharp(file.filepath)
              .png()
              .toFile(pngFilename);
    
            // Rename the original file to the pngFilename
            await rename(file.filepath, pngFilename);
    
            // Update file path in the files object
            file.filepath = pngFilename;
            // Add file to the files object
            files[name] = file;
          } catch(e) {
            reject(e);
          }
        } else {
          // If the file is already a png, add it to the files object
          files[name] = file;
        }
      }
    });
    
    form.parse(req, function (err, fields, _files) {
      if (err) reject(err);
      else resolve({ fields, files, token, fileIndex });
    });

  });
};