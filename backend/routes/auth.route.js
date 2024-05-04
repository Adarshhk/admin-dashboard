import { Router } from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/veriftJwt.js";
import { getAll } from "../controllers/user.controller.js";
const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT , logout);
router.route("/getAll").get(verifyJWT , getAll);
export default router;
