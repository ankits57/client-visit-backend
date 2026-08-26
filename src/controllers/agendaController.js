const mongoose = require("mongoose");
const Visit = require("../models/Visit");
const asyncHandler = require("../utils/asyncHandler");

const addAgendaItem = asyncHandler(async (req, res) => {
  try {
    const { visitId } = req.params;

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

    const { title, description, date, startTime, endTime, location } = req.body;

    const agendaItem = {
      title,
      description,
      date,
      startTime,
      endTime,
      location,
    };

    visit.agenda.push(agendaItem);

    await visit.save();

    res.status(201).json({
      success: true,
      message: "Agenda item added successfully",
      agenda: visit.agenda,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
const updateAgendaItem = asyncHandler(async (req, res) => {
  try {
    const { visitId, agendaId } = req.params;

    const visit = await Visit.findById(visitId);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit not found",
      });
    }

    const agendaItem = visit.agenda.id(agendaId);

    if (!agendaItem) {
      return res.status(404).json({
        success: false,
        message: "Agenda item not found",
      });
    }

    const { title, description, date, startTime, endTime, location } = req.body;

    if (title !== undefined) agendaItem.title = title;
    if (description !== undefined) agendaItem.description = description;
    if (date !== undefined) agendaItem.date = date;
    if (startTime !== undefined) agendaItem.startTime = startTime;
    if (endTime !== undefined) agendaItem.endTime = endTime;
    if (location !== undefined) agendaItem.location = location;

    await visit.save();

    res.status(200).json({
      success: true,
      message: "Agenda item updated successfully",
      agendaItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
const deleteAgendaItem = asyncHandler(async (req, res) => {
  try {
    const { visitId, agendaId } = req.params;

    const visit = await Visit.findById(visitId);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit not found",
      });
    }

    const agendaItem = visit.agenda.id(agendaId);

    if (!agendaItem) {
      return res.status(404).json({
        success: false,
        message: "Agenda item not found",
      });
    }

    agendaItem.deleteOne();

    await visit.save();

    res.status(200).json({
      success: true,
      message: "Agenda item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = {
  addAgendaItem,
  updateAgendaItem,
  deleteAgendaItem,
};
