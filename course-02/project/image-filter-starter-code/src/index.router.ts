import { Router, Request, Response } from 'express';
import { UserRouter } from './users/routes/user.router';
import { ImageRouter } from './users/routes/image.router';

const router: Router = Router();

router.use('/users', UserRouter);

router.use('/images', ImageRouter);

router.get('/', async (req: Request, res: Response) => {
    res.send(`try apis /v0/users or /v0/images`);
});

export const IndexRouter: Router = router;