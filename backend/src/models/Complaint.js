import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Electrical",
        "Plumbing",
        "Furniture",
        "Washroom",
        "WiFi",
        "Cleanliness",
        "Security",
        "Other",
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved", "cancelled"],
      default: "pending",
    },
    resolutionNote: {
      type: String,
    },
    resolvedAt: {
      type: Date,
    },
    slaDeadline: {
      type: Date,
    },
    slaStatus: {
      type: String,
      enum: ["on-time", "delayed"],
      default: "on-time",
    },
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;