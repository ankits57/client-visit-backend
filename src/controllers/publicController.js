const Visit = require("../models/Visit");
const asyncHandler = require("../utils/asyncHandler");

const getPublicVisit = asyncHandler(async (req, res) => {
  try {
    const { token } = req.params;

    const visit = await Visit.findOne({
      publicToken: token,
    });

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit link is invalid or expired",
      });
    }

    res.status(200).json({
      success: true,

      visit: {
        title: visit.title,
        description: visit.description,

        clientCompany: visit.clientCompany,

        startDate: visit.startDate,
        endDate: visit.endDate,

        officeLocation: visit.officeLocation,

        agenda: visit.agenda,

        status: visit.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const getPublicVisitUpdates = asyncHandler(async (req, res) => {
  try {
    const { token } = req.params;

    const visit = await Visit.findOne({
      publicToken: token,
    }).select("updates");

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit link is invalid or expired",
      });
    }

    const updates = visit.updates.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    res.status(200).json({
      success: true,
      count: updates.length,
      updates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const getPublicVisitPlaces = asyncHandler(async (req, res) => {
  try {
    const { token } = req.params;

    const visit = await Visit.findOne({
      publicToken: token,
    }).select("places");

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit link is invalid or expired",
      });
    }

    res.status(200).json({
      success: true,
      count: visit.places.length,
      places: visit.places,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
module.exports = {
  getPublicVisit,
  getPublicVisitUpdates,
  getPublicVisitPlaces,
};
