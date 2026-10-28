import express from "express";
import { TrackController } from "./controller.js";
import { authenticate, trackOwner, validate } from "../utils/middlewares.js";
import {
  createTrackSchema,
  idParamSchema,
  updateTrackSchema,
} from "./validator.js";

const router = express.Router();

router.use(authenticate);

router.get("/", TrackController.index);

router
  .route("/:id")
  .all(validate(idParamSchema), trackOwner)
  .get(TrackController.show)
  .patch(validate(updateTrackSchema), TrackController.edit)
  .delete(TrackController.destroy);

router.post("/", validate(createTrackSchema), TrackController.store);

export default router;
