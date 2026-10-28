import { TrackRepo } from "./repo.js";

export class TrackController {
  static async index(req, res) {
    try {
      const tracks = await TrackRepo.all({ userId: req.user.id });
      return res.json({ success: true, tracks });
    } catch (err) {
      return res.json({ success: false, error: err.message });
    }
  }

  static async show(req, res) {
    try {
      const track = await TrackRepo.find({ id: req.validated.params.id });
      if (!track || track.userId != req.user.id)
        return res.json({ success: false, error: "no track or not ur track" });

      return res.json({ success: true, track });
    } catch (err) {
      return res.json({ success: false, error: err.message });
    }
  }

  static async store(req, res) {
    try {
      const track = await TrackRepo.create({
        ...req.validated.body,
        userId: req.user.id,
      });
      return res.json({ success: true, track });
    } catch (err) {
      return res.json({ success: false, err: err.message });
    }
  }

  static async edit(req, res) {
    try {
      const track = await TrackRepo.update(
        { id: req.validated.params.id },
        req.validated.body,
      );
      return res.json({ success: true, track });
    } catch (err) {
      return res.json({ success: false, err: err.message });
    }
  }

  static async destroy(req, res) {
    try {
      await TrackRepo.delete(req.validated.params.id);
      return res.json({ success: true });
    } catch (err) {
      return res.json({ success: false, err: err.message });
    }
  }
}
