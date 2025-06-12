const multer = require("multer");
const storage = multer.memoryStorage();
const uploads = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3, 
  },
});

module.exports = uploads;
