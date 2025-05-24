import { Router } from "express";
import { authToken } from "../middlewares/auth.middleware.js";
import {
  createPlaylist,
  addProblemToPlaylist,
  getAllPlaylistDetails,
  getPlaylistDetail,
  removeProblemFromPlaylist,
  deletePlaylist,
} from "../controllers/playlist.controller.js";

const playlistRouter = Router();

playlistRouter.post("/create-playlist", authToken, createPlaylist);
playlistRouter.post(
  "/:playlistId/add-problem",
  authToken,
  addProblemToPlaylist,
);
playlistRouter.get("/", authToken, getAllPlaylistDetails);
playlistRouter.get("/:playlistId", authToken, getPlaylistDetail);
playlistRouter.delete(
  "/:playlistId/remove-problem",
  authToken,
  removeProblemFromPlaylist,
);
playlistRouter.delete("/:playlistId", authToken, deletePlaylist);

export default playlistRouter;
