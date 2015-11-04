import express from 'express';
import handleRender from './handleRender';

const router = express.Router();

router.get('/', handleRender);
export default router;
