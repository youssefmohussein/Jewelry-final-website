const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
});

const uploadProductImages = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "hoverImage", maxCount: 1 },
]);

module.exports = { upload, uploadProductImages };
