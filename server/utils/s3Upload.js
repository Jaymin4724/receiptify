import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";

// 1. Configure the AWS S3 Client
// This creates a connection to your S3 service using the secure credentials
// stored in your .env file.
export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// 2. Configure Multer for S3 Uploads
// This is the core middleware that will process incoming files.
const s3Upload = multer({
  // Use multerS3 as the storage engine to stream files directly to S3
  // without saving them to the server's local disk first.
  storage: multerS3({
    s3: s3Client, // The S3 connection client
    bucket: process.env.AWS_S3_BUCKET_NAME, // The name of the destination bucket

    // Set the Content-Type automatically based on the file's extension.
    // This helps browsers and other services understand what kind of file it is.
    contentType: multerS3.AUTO_CONTENT_TYPE,

    // Set the Content-Disposition to 'inline'. This is a crucial instruction
    // for browsers, telling them to DISPLAY the file, not just download it.
    contentDisposition: "inline",

    // Add metadata to the S3 object (optional but good practice).
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },

    // Define the unique key (i.e., the filename and path) for the object in S3.
    key: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const userId = req.user._id; // Get the authenticated user's ID
      const fileName = `${file.fieldname}-${uniqueSuffix}${path.extname(
        file.originalname
      )}`;

      // Organize files into a structured folder path for better management.
      cb(null, `receipts/${userId}/${fileName}`);
    },
  }),

  // Add a filter to ensure only specific image formats are allowed,
  // enhancing the security of your application.
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const isMimeTypeAllowed = allowedTypes.test(file.mimetype);
    const isExtensionAllowed = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (isMimeTypeAllowed && isExtensionAllowed) {
      cb(null, true); // File is allowed
    } else {
      cb(new Error("Error: Only .png, .jpg and .jpeg formats are allowed!")); // File is rejected
    }
  },
});

export default s3Upload;
