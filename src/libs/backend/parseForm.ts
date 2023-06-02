import type { NextApiRequest } from "next";
import mime from "mime";
import { join } from "path";
import formidable from "formidable";
import { mkdir, stat, rename} from "fs/promises";
import { renameSync } from 'fs';

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

    let fileIndex = 0;
    const form = formidable({
      maxFiles: 20,
      maxFileSize: 1024 * 1024 * 200, // 200mb
      uploadDir,
      filename: (_name, _ext, part) => {
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

    // form.on('file', function (name, file) {
    //   if (name === "media") {
    //     const parsedPath = path.parse(file.filepath);
        
    //     // Check if the file is already a .png
    //     if (parsedPath.ext.toLowerCase() !== '.png') {
    //       const pngFilename = path.format({
    //         ...parsedPath,
    //         base: undefined, // Ignore base to respect name and ext
    //         ext: '.png', // Change the extension to .png
    //       });

    //       // Convert and save file to png
    //       sharp(file.filepath)
    //         .png({
    //           compressionLevel: 9, // Zlib compression level, a value between 0 and 9 (default 9). Lower numbers result in faster operation but less compression.
    //           quality: 100, // Quality, a value between 1 (worst) and 100 (best). The default is 100.
    //           progressive: false, // Use progressive (interlace) scan (default false)
    //           force: true, // Force output to PNG format regardless of the input
    //           adaptiveFiltering: true,
    //         })
    //         .toFile(pngFilename);

    //       // Rename the original file to the pngFilename
    //       // await rename(file.filepath, pngFilename);

    //       // Update file path in the files object
    //       file.filepath = pngFilename;
    //     }

    //     // Add file to the files object
    //     if (files[name]) {
    //       if (Array.isArray(files[name])) {
    //         files[name].push(file);
    //       } else {
    //         files[name] = [files[name], file];
    //       }
    //     } else {
    //       files[name] = file;
    //     }
    //   }
    // });

    form.on('file', function (name, file) {
      if (name === "media") {
        const parsedPath = path.parse(file.filepath);
        
        // If the extension is '.jpeg', change to '.jpg'
        if (parsedPath.ext.toLowerCase() === '.jpeg') {
          const jpgFilename = path.format({
            ...parsedPath,
            base: undefined, // Ignore base to respect name and ext
            ext: '.jpg', // Change the extension to .jpg
          });

          // Rename the original file to the jpgFilename
          renameSync(file.filepath, jpgFilename);
        }

        // Check if the file is not already a .jpg or .jpeg
        if (parsedPath.ext.toLowerCase() !== '.jpg' && parsedPath.ext.toLowerCase() !== '.jpeg') {
          const jpgFilename = path.format({
            ...parsedPath,
            base: undefined, // Ignore base to respect name and ext
            ext: '.jpg', // Change the extension to .jpg
          });

          console.log('Converting', file.filepath, 'to', jpgFilename);

          // Convert and save file to png
          sharp(file.filepath)
              .jpeg({
                quality: 80, // Adjust the quality as needed
                progressive: true,
                force: true
              })
              .toFile(jpgFilename);

          // Rename the original file to the pngFilename
          // await rename(file.filepath, pngFilename);

          // Update file path in the files object
          file.filepath = jpgFilename;
        }

        // Add file to the files object
        if (files[name]) {
          if (Array.isArray(files[name])) {
            files[name].push(file);
          } else {
            files[name] = [files[name], file];
          }
        } else {
          files[name] = file;
        }
      }
    });

    form.parse(req, function (err, fields) {
      if (err) reject(err);
      else resolve({ fields, files, token, fileIndex });
    });
  });
};