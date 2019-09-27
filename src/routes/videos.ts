import { Router, Request, Response, NextFunction } from 'express';
import { join } from 'path';

import { Video } from '@src/entity';
import { IVideo, ISubtitle } from '@src/models';
import { findSubtitle } from '@src/utils/fs';
import { ARCHIVE_PATH, FILE_SERVER } from '@src/config';

const router: Router = Router();

router.get('/:videoId', (req: Request, res: Response, next: NextFunction) => {
  const videoId: number = parseInt(req.params['videoId']);

  (async function () {
    const video: Video | null = await Video.findById(videoId);

    if (!video) {
      res.status(404);
      res.json({ msg: 'Not Found' });
      return;
    }

    const video2: IVideo = await video.convert();

    res.status(200);
    res.json(video2);
  })().catch(next);
});

router.get('/:videoId/subtitles', (req: Request, res: Response, next: NextFunction) => {
  const videoId: number = parseInt(req.params['videoId']);

  (async function () {
    const video: Video | null = await Video.findById(videoId);

    if (!video) {
      res.status(404);
      res.json({ msg: 'Not Found' });
      return;
    }

    const subtitles: ISubtitle[] = await findSubtitle(join(ARCHIVE_PATH, video.path));

    res.status(200);
    res.json(subtitles);
  })().catch(next);
});

export default router;
