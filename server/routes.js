import express from 'express';
import path from 'path';

const router = express.Router();

router.get('*', function response(req, res) {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

export default router;
