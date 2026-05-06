import { Router, type IRouter } from "express";
import healthRouter from "./health";
import transcribeRouter from "./transcribe";
import chatRouter from "./chat";

const router: IRouter = Router();

router.use(healthRouter);
router.use(transcribeRouter);
router.use(chatRouter);

export default router;
