import express from "express";
import AuthRoutes from "./auth/routes.js";
import TrackRoutes from "./track/routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", AuthRoutes);
app.use("/tracks", TrackRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok updated", project: "tracker-server" });
});

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server running on 3000`);
});
