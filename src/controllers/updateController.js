const mongoose = require("mongoose");
const Visit = require("../models/Visit");
const asyncHandler = require("../utils/asyncHandler");
const { getIO } = require("../socket");

const addVisitUpdate = asyncHandler(async (req, res) => {
  try {
    const { visitId } = req.params;
    const { title, message, type } = req.body;

    if (!mongoose.Types.ObjectId.isValid(visitId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visit ID",
      });
    }

    const visit = await Visit.findById(visitId);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit not found",
      });
    }

    visit.updates.push({
      title,
      message,
      type,
    });

    await visit.save();

    const newUpdate = visit.updates[visit.updates.length - 1];

    const io = getIO();

    io.to(`visit-${visitId}`).emit("visitUpdateCreated", newUpdate);

    res.status(201).json({
      success: true,
      message: "Visit update added successfully",
      update: newUpdate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const updateVisitUpdate = asyncHandler(async (req, res) => {
  try {
    const { visitId, updateId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(visitId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visit ID",
      });
    }

    const visit = await Visit.findById(visitId);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit not found",
      });
    }

    const visitUpdate = visit.updates.id(updateId);

    if (!visitUpdate) {
      return res.status(404).json({
        success: false,
        message: "Update not found",
      });
    }

    const { title, message, type } = req.body;

    if (title !== undefined) {
      visitUpdate.title = title;
    }

    if (message !== undefined) {
      visitUpdate.message = message;
    }

    if (type !== undefined) {
      visitUpdate.type = type;
    }

    await visit.save();

    const io = getIO();

    io.to(`visit-${visitId}`).emit("visitUpdateUpdated", visitUpdate);

    res.status(200).json({
      success: true,
      message: "Visit update updated successfully",
      update: visitUpdate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const deleteVisitUpdate = asyncHandler(async (req, res) => {
  try {
    const { visitId, updateId } = req.params;

    const visit = await Visit.findById(visitId);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit not found",
      });
    }

    const visitUpdate = visit.updates.id(updateId);

    if (!visitUpdate) {
      return res.status(404).json({
        success: false,
        message: "Update not found",
      });
    }

    visitUpdate.deleteOne();

    await visit.save();

    const io = getIO();

    io.to(`visit-${visitId}`).emit("visitUpdateDeleted", {
      updateId,
    });

    res.status(200).json({
      success: true,
      message: "Visit update deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = {
  addVisitUpdate,
  updateVisitUpdate,
  deleteVisitUpdate,
};
