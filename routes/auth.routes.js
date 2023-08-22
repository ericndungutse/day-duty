import { Router } from "express";
import { signup, signin } from "../controllers/auth.controller.js";

const authRouter = Router()

authRouter.route('/sign-up').post(signup)
authRouter.route('/sign-in').post(signin)

export default authRouter