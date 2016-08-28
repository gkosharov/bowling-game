/**
 * Created by g.kosharov on 28.8.2016
 */

import { Router } from 'express';
import * as AuthController from '../controllers/auth'
import passport from 'passport'

const router = new Router();

router.post('/register', AuthController.createUser);

router.post('/login', AuthController.authenticate);

export default router;