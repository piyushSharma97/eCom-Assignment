const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function uploadPicture(req, res, next) {
  const file = req.files?.picture;
  if (!file) {
    return next();
  }
  const payload = Array.isArray(file) ? file[0] : file;
  if (!payload.mimetype || !payload.mimetype.startsWith('image/')) {
    return res.status(400).json({ error: 'Only image uploads are allowed' });
  }
  const ext = path.extname(payload.name || '') || '.jpg';
  const filename = `${Date.now()}${ext}`;
  payload.mv(path.join(uploadsDir, filename), (err) => {
    if (err) {
      return next(err);
    }
    req.file = { filename };
    next();
  });
}

module.exports = { uploadPicture, uploadsDir };
