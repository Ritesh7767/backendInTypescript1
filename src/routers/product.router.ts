import { Router } from "express";
import isAuth from "../middleware/auth.middleware";
import { deleteProduct, getProduct, postProduct, updateProduct } from "../controllers/product.controller";

const router = Router()

router.route('/postProduct').post(isAuth, postProduct)
router.route('/getProduct').get(isAuth, getProduct)
router.route('/updateProduct').post(isAuth, updateProduct)
router.route('/deleteProduct').post(isAuth, deleteProduct)

export default router