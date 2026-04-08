import Complaint from "../models/Complaint.js";
import Notification from "../models/Notification.js";

// ================= CREATE =================
export const createComplaint = async (req, res) => {
  try {
    const { roomNumber, category, description } = req.body;

    let slaHours = 72;
    if (category === "Electrical" || category === "Plumbing") {
      slaHours = 48;
    }

    const slaDeadline = new Date(Date.now() + slaHours * 60 * 60 * 1000);

    const complaint = await Complaint.create({
      studentId: req.user.id,
      roomNumber,
      category,
      description,
      slaDeadline,
    });

    res.status(201).json({
      message: "Complaint created successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= MY =================
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      studentId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= ALL =================
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE (IMPORTANT) =================
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Not found" });
    }

    complaint.status = status;

    if (status === "resolved") {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    // 🔔 CREATE NOTIFICATION
    await Notification.create({
      userId: complaint.studentId,
      message: `Your complaint is now ${status}`,
    });

    console.log("✅ Notification created"); // DEBUG

    res.json({ message: "Updated", complaint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= CANCEL =================
export const cancelComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Not found" });
    }

    complaint.status = "cancelled";
    await complaint.save();

    await Notification.create({
      userId: req.user.id,
      message: "Complaint cancelled",
    });

    res.json({ message: "Cancelled" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};