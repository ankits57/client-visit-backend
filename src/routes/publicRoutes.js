const express = require("express");

const {
  getPublicVisit,
  getPublicVisitUpdates,
  getPublicVisitPlaces,
} = require("../controllers/publicController");

const router = express.Router();

router.get("/visit/:token", getPublicVisit);

router.get("/visit/:token/updates", getPublicVisitUpdates);

router.get("/visit/:token/places", getPublicVisitPlaces);

module.exports = router;
