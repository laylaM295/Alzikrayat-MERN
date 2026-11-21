const mongoose = require("mongoose");
const Photo = require("../models/Photo");

const getPhotoRoomName = (photoId) => `photo:${photoId}`;

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("joinPhoto", async (photoId, acknowledge) => {
      const reply = typeof acknowledge === "function" ? acknowledge : () => {};

      try {
        if (!mongoose.Types.ObjectId.isValid(photoId)) {
          return reply({
            success: false,
            message: "Invalid photo ID"
          });
        }

        const photoExists = await Photo.exists({ _id: photoId });

        if (!photoExists) {
          return reply({
            success: false,
            message: "Photo not found"
          });
        }

        await socket.join(getPhotoRoomName(photoId));

        reply({
          success: true,
          room: getPhotoRoomName(photoId)
        });

      } catch (error) {
        console.error("Socket joinPhoto error:", error);

        reply({
          success: false,
          message: "Could not join photo room"
        });
      }
    });

    socket.on("leavePhoto", async (photoId) => {
      if (!mongoose.Types.ObjectId.isValid(photoId)) {
        return;
      }

      await socket.leave(getPhotoRoomName(photoId));
    });

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id} (${reason})`);
    });
  });
};

module.exports = {
  initializeSocket,
  getPhotoRoomName,
};