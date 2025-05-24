import { db } from "../db/db.js";

const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    const playlist = await db.playlist.create({
      data: {
        name,
        description,
        userId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Playlist created successfully",
      playlist,
    });
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const addProblemToPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;
  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing problemIds",
      });
    }

    const problemInPlaylist = await db.problemInPlaylist.createMany({
      data: problemIds.map((problemId) => ({
        playlistId,
        problemId,
      })),
    });

    res.status(201).json({
      success: true,
      message: "Problems added to playlist successfully",
      problemInPlaylist,
    });
  } catch (error) {
    console.error("Error adding problem to playlist:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllPlaylistDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const playlists = await db.playlist.findMany({
      where: {
        userId,
      },
      include: {
        Problems: {
          include: {
            Problem: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Playlists fetched successfully",
      playlists,
    });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getPlaylistDetail = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const userId = req.user.id;

    const playlist = await db.playlist.findUnique({
      where: {
        playlistId,
        userId,
      },
      include: {
        Problems: {
          include: {
            Problem: true,
          },
        },
      },
    });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Playlist details fetched successfully",
      playlist,
    });
  } catch (error) {
    console.error("Error fetching playlist details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const removeProblemFromPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;

  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing problemIds",
      });
    }

    const deleteProblem = await db.problemInPlaylist.deleteMany({
      where: {
        playlistId,
        problemId: {
          in: problemIds,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Problems removed from playlist successfully",
      deleteProblem,
    });
  } catch (error) {
    console.error("Error removing problem from playlist:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const deletePlaylist = await db.playlist.delete({
      where: {
        id: playlistId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Playlist deleted successfully",
      playlist: deletePlaylist,
    });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export {
  createPlaylist,
  addProblemToPlaylist,
  getAllPlaylistDetails,
  getPlaylistDetail,
  removeProblemFromPlaylist,
  deletePlaylist,
};
