import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";

// 1. Configure the AWS S3 Client
export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// 2. Configure Multer for S3 Uploads
const s3Upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    contentDisposition: "inline",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const userId = req.user._id;
      const fileName = `${file.fieldname}-${uniqueSuffix}${path.extname(
        file.originalname
      )}`;
      cb(null, `receipts/${userId}/${fileName}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const isMimeTypeAllowed = allowedTypes.test(file.mimetype);
    const isExtensionAllowed = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (isMimeTypeAllowed && isExtensionAllowed) {
      cb(null, true);
    } else {
      cb(new Error("Error: Only .png, .jpg and .jpeg formats are allowed!"));
    }
  },
});

export const deleteS3Object = async (key) => {
  if (!key) return;

  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  });

  try {
    await s3Client.send(command);
    console.log(`Successfully deleted S3 object: ${key}`);
  } catch (error) {
    console.error(`Failed to delete S3 object ${key}:`, error);
  }
};

export default s3Upload;
