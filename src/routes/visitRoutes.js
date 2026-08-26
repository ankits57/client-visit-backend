const express = require("express");
const canManageVisit = require("../middleware/visitAuthorization");
const {
  createVisit,
  getVisits,
  getVisitById,
  generatePublicLink,
  deleteVisit,
  getPublicVisit,
} = require("../controllers/visitController");

const {
  addAgendaItem,
  updateAgendaItem,
  deleteAgendaItem,
} = require("../controllers/agendaController");
const {
  addVisitUpdate,
  updateVisitUpdate,
  deleteVisitUpdate,
} = require("../controllers/updateController");
const {
  addPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/placeController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getVisits);
router.get("/public/:publicToken", getPublicVisit);

router.get("/:id", protect, getVisitById);

router.post("/", protect, createVisit);

router.post("/:visitId/agenda", protect, canManageVisit, addAgendaItem);

router.patch(
  "/:visitId/agenda/:agendaId",
  protect,
  canManageVisit,
  updateAgendaItem,
);

router.delete(
  "/:visitId/agenda/:agendaId",
  protect,
  canManageVisit,
  deleteAgendaItem,
);

router.post(
  "/:visitId/generate-link",
  protect,
  canManageVisit,
  generatePublicLink,
);

router.post("/:visitId/updates", protect, canManageVisit, addVisitUpdate);

router.post("/:visitId/places", protect, canManageVisit, addPlace);

router.patch(
  "/:visitId/updates/:updateId",
  protect,
  canManageVisit,
  updateVisitUpdate,
);

router.delete(
  "/:visitId/updates/:updateId",
  protect,
  canManageVisit,
  deleteVisitUpdate,
);

router.patch("/:visitId/places/:placeId", protect, canManageVisit, updatePlace);

router.delete(
  "/:visitId/places/:placeId",
  protect,
  canManageVisit,
  deletePlace,
);

router.delete("/:visitId", protect, canManageVisit, deleteVisit);
module.exports = router;
