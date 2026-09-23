const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const ErrorHandler = require("./errorHandler");

// Generate a unique filename by appending a suffix if needed
const getUniqueFilename = async (destination, originalname) => {
  const ext = path.extname(originalname);
  const basename = path.basename(originalname, ext);
  let filename = originalname;
  let counter = 1;

  while (
    await fs
      .access(path.join(destination, filename))
      .then(() => true)
      .catch(() => false)
  ) {
    filename = `${basename}-${counter}${ext}`;
    counter++;
  }

  return filename;
};

// Create a dynamic Multer instance
const createMulterInstance = ({ allowedTypes, maxFileSize, destinationFolder }) => {
  // Ensure destination folder exists
  fs
    .mkdir(path.join(__dirname, "../", destinationFolder), { recursive: true })
    .catch((err) => console.error(`Failed to create directory ${destinationFolder}:`, err));

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destinationFolder);
    },
    filename: async (req, file, cb) => {
      try {
        const uniqueFilename = await getUniqueFilename(destinationFolder, file.originalname);
        cb(null, uniqueFilename);
      } catch (error) {
        cb(new ErrorHandler("Error generating unique filename", 500));
      }
    },
  });

  const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new ErrorHandler(
          `Invalid file type. Only ${allowedTypes.join(", ")} are allowed.`,
          400
        )
      );
    }
  };

  return multer({
    storage,
    limits: { fileSize: maxFileSize },
    fileFilter,
  });
};

module.exports = { createMulterInstance };


