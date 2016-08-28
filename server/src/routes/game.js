/**
 * Created by g.kosharov on 28.8.2016
 */

import { Router } from 'express';
import * as GameController from '../controllers/game';
const router = new Router();

/**
 * Game
 */
router.route('/games').get(GameController.getGames);

router.route('/games/:id').get(GameController.getGame);

router.route('/games').post(GameController.createGame);

router.route('/games/:id').put(GameController.updateGame);

router.route('/games/:id').delete(GameController.deleteGame);

export default router;
