import { Router } from "express";
import { userLogin, userRegister, updateUserPassword, deleteUser } from "../controllers/user.controller";
import isAuth from "../middleware/auth.middleware";

const router = Router()

router.route('/register').post(userRegister)
router.route('/login').post(userLogin)
router.route('/updateUser').post(isAuth, updateUserPassword)
router.route('/deleteUser').post(isAuth, deleteUser)

export default router