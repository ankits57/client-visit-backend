const Visit = require("../models/Visit");

const canManageVisit = async (req, res, next) => {
  try {
    const visitId = req.params.visitId || req.params.id;

    const visit = await Visit.findById(visitId);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit not found",
      });
    }

    // Admin can manage everything
    if (req.user.role === "ADMIN") {
      req.visit = visit;
      return next();
    }

    // Employee can only manage their own visit
    if (visit.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to manage this visit",
      });
    }

    req.visit = visit;

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = canManageVisit;
