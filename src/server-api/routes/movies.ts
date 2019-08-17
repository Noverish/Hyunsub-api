import { Router, Request, Response, NextFunction } from 'express';
import { join } from 'path';

import { Movie } from 'src/entity';
import { getVideoFromDirPath } from 'src/fs';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  Movie.get()
    .then((movies: Movie[]) => {
      res.status(200);
      res.json(movies);
    })
    .catch((err) => {
      next(err);
    })
});

router.get('/:path*', (req: Request, res: Response, next: NextFunction) => {
  const path = decodeURI(req.path);

  Movie.findByPath(path)
    .then((movie: Movie | null) => {
      if (movie) {
        res.status(200);
        res.json(getVideoFromDirPath(join('/archive/Movies', movie.path)));
      } else {
        res.status(404);
        res.json({ msg: 'Not Found' });
      }
    })
    .catch((err) => {
      next(err);
    })
});

export default router;
