const crypto = require("crypto");
const Visit = require("../models/Visit");
const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const createVisit = asyncHandler(async (req, res) => {
  const visitData = {
    ...req.body,
    createdBy: req.user._id,
  };

  const visit = await Visit.create(visitData);

  res.status(201).json({
    success: true,
    message: "Visit created successfully",
    visit,
  });
});

const getVisits = asyncHandler(async (req, res) => {
  let query = {};

  // Employee only sees their visits
  if (req.user.role !== "ADMIN") {
    query.createdBy = req.user._id;
  }

  const visits = await Visit.find(query)
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: visits.length,
    visits,
  });
});
const getVisitById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid visit ID", 400);
  }

  const visit = await Visit.findById(id).populate("createdBy", "name email");

  if (!visit) {
    throw new AppError("Visit not found", 404);
  }

  if (
    req.user.role !== "ADMIN" &&
    visit.createdBy._id.toString() !== req.user._id.toString()
  ) {
    throw new AppError("You are not authorized to access this visit", 403);
  }

  res.status(200).json({
    success: true,
    visit,
  });
});

const generatePublicLink = asyncHandler(async (req, res) => {
  const { visitId } = req.params;

  const visit = await Visit.findById(visitId);

  if (!visit) {
    throw new AppError("Visit not found", 404);
  }

  const publicToken = crypto.randomBytes(32).toString("hex");

  visit.publicToken = publicToken;

  await visit.save();

  const publicUrl = `http://localhost:5173/visit/${publicToken}`;

  res.status(200).json({
    success: true,
    message: "Public link generated successfully",
    publicToken,
    publicUrl,
  });
});
const deleteVisit = asyncHandler(async (req, res) => {
  const { visitId } = req.params;

  const visit = await Visit.findById(visitId);

  if (!visit) {
    throw new AppError("Visit not found", 404);
  }

  await visit.deleteOne();

  res.status(200).json({
    success: true,
    message: "Visit deleted successfully",
  });
});

const getPublicVisit = asyncHandler(async (req, res) => {
  const { publicToken } = req.params;

  const visit = await Visit.findOne({
    publicToken,
  }).select("-createdBy");

  if (!visit) {
    throw new AppError("Invalid or expired visit link", 404);
  }

  res.status(200).json({
    success: true,
    visit,
  });
});
module.exports = {
  createVisit,
  getVisits,
  getVisitById,
  generatePublicLink,
  deleteVisit,
  getPublicVisit,
};
