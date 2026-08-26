const mongoose = require("mongoose");
const Visit = require("../models/Visit");
const asyncHandler = require("../utils/asyncHandler");

const addPlace = asyncHandler(async (req, res) => {
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

    const { name, category, address, description, mapUrl, distance } = req.body;

    const place = {
      name,
      category,
      address,
      description,
      mapUrl,
      distance,
    };

    visit.places.push(place);

    await visit.save();

    const newPlace = visit.places[visit.places.length - 1];

    res.status(201).json({
      success: true,
      message: "Place added successfully",
      place: newPlace,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const updatePlace = asyncHandler(async (req, res) => {
  try {
    const { visitId, placeId } = req.params;

    const visit = await Visit.findById(visitId);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit not found",
      });
    }

    const place = visit.places.id(placeId);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    const { name, category, address, description, mapUrl, distance } = req.body;

    if (name !== undefined) place.name = name;
    if (category !== undefined) place.category = category;
    if (address !== undefined) place.address = address;
    if (description !== undefined) place.description = description;
    if (mapUrl !== undefined) place.mapUrl = mapUrl;
    if (distance !== undefined) place.distance = distance;

    await visit.save();

    res.status(200).json({
      success: true,
      message: "Place updated successfully",
      place,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const deletePlace = asyncHandler(async (req, res) => {
  try {
    const { visitId, placeId } = req.params;

    const visit = await Visit.findById(visitId);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit not found",
      });
    }

    const place = visit.places.id(placeId);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    place.deleteOne();

    await visit.save();

    res.status(200).json({
      success: true,
      message: "Place deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
module.exports = {
  addPlace,
  updatePlace,
  deletePlace,
};
