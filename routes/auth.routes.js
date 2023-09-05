import { Router } from "express";
import { signup, signin, activateAccount } from "../controllers/auth.controller.js";

const authRouter = Router()
authRouter.route('/sign-up').post(signup)
authRouter.route('/sign-in').post(signin)
authRouter.route('/activate-account/:token').post(activateAccount)

export default authRouter