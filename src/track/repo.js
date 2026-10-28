import { prisma } from "#src/utils/prisma.js";
import { BaseRepo } from "../utils/BaseRepo.js";

export class TrackRepo extends BaseRepo {
  static get model() {
    return prisma.track;
  }
}
