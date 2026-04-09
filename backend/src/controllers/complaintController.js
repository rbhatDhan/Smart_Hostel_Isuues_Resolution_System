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


// ================= EDIT (STUDENT - within 15 mins) =================
export const editComplaint = async (req, res) => {
  try {
    const { roomNumber, category, description } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Only owner can edit
    if (complaint.studentId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // ⏱️ Check 15-minute window
    const createdTime = new Date(complaint.createdAt).getTime();
    const currentTime = Date.now();

    const diffMinutes = (currentTime - createdTime) / (1000 * 60);

    if (diffMinutes > 15) {
      return res.status(400).json({
        message: "Edit time expired (only within 15 minutes)",
      });
    }

    // Update fields
    complaint.roomNumber = roomNumber || complaint.roomNumber;
    complaint.category = category || complaint.category;
    complaint.description = description || complaint.description;

    await complaint.save();

    res.json({
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};