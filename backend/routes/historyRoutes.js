import express from 'express';

const router = express.router();

router.get('/',getHistory);
router.get('/:id',getHistoryById);
router.delete('/:id',deleteHistoryById);


export default router;