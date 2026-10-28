import express from "express";
import AuthRoutes from "./auth/routes.js";
import TrackRoutes from "./track/routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", AuthRoutes);
app.use("/api/tracks", TrackRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen("3000", "0.0.0.0", () => {
  console.log(`Server running on 3000`);
});
