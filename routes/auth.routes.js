import { Router } from "express";
import { signup, signin, activateAccount, logout } from "../controllers/auth.controller.js";

const authRouter = Router()

authRouter.route('/sign-up').post(signup)
authRouter.route('/sign-in').post(signin)
authRouter.route('/activate-account/:token/:email').post(activateAccount)
authRouter.route('/log-out').post(logout)

export default authRouter