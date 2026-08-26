const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    designation: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const agendaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
    },

    location: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const updateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["INFO", "IMPORTANT", "ALERT"],
      default: "INFO",
    },
  },
  {
    timestamps: true,
  },
);

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "RESTAURANT",
        "CAFE",
        "HOTEL",
        "HOSPITAL",
        "ATM",
        "TOURIST_PLACE",
        "OTHER",
      ],
      required: true,
    },

    address: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    mapUrl: {
      type: String,
      trim: true,
    },

    distance: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const visitSchema = new mongoose.Schema(
  {
    clientCompany: {
      type: String,
      required: true,
      trim: true,
    },

    visitors: [visitorSchema],

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    officeLocation: {
      name: String,
      address: String,
      mapUrl: String,
    },

    agenda: [agendaSchema],

    publicToken: {
      type: String,
      unique: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"],
      default: "UPCOMING",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updates: [updateSchema],
    places: [placeSchema],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Visit", visitSchema);
