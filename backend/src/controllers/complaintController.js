import Complaint from "../models/Complaint.js";
import Notification from "../models/Notification.js";



//to create complaint
export const createComplaint = async (req, res) => {
  try {
    const { roomNumber, category, description } = req.body;

                  let slaHours = 72; // default
                  if (category === "Electrical") slaHours = 48;
                  else if (category === "Plumbing") slaHours = 48;
                  const slaDeadline = new Date(Date.now() + slaHours * 60 * 60 * 1000);


    const complaint = await Complaint.create({
      studentId: req.user.id, // from JWT
      roomNumber,
      category,
      description,
      slaDeadline,
    });

    
    // Create notification for admin/warden (for now we send to same user)
    await Notification.create({
      userId: req.user.id,
      message: "New complaint submitted",
    });
        

    res.status(201).json({
      message: "Complaint created successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//to read complaints
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      studentId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//read all complaints
export const getAllComplaints = async (req, res) => {
  try {
    const { status, category, sort } = req.query;

    let filter = {};

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    let query = Complaint.find(filter).populate("studentId", "name email");

    // Sorting
    if (sort === "latest") {
      query = query.sort({ createdAt: -1 });
    } else if (sort === "oldest") {
      query = query.sort({ createdAt: 1 });
    }

    const complaints = await query;

    // SLA check
    const now = new Date();

    complaints.forEach((complaint) => {
      if (
        complaint.status !== "resolved" &&
        complaint.slaDeadline &&
        now > complaint.slaDeadline
      ) {
        complaint.slaStatus = "delayed";
      }
    });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
      
  

//warden side update complaint status
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status, resolutionNote } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = status;

    // If resolved → add note + time
    if (status === "resolved") {
      complaint.resolutionNote = resolutionNote;
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    // Notify student
    await Notification.create({
      userId: complaint.studentId,
      message: `Your complaint status updated to ${status}`,
    });

    res.json({
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//Cancel Complaint
export const cancelComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Only owner can cancel
    if (complaint.studentId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Cannot cancel resolved complaint
    if (complaint.status === "resolved") {
      return res.status(400).json({ message: "Cannot cancel resolved complaint" });
    }

    complaint.status = "cancelled";
    await complaint.save();

    // 🔔 Notification
    await Notification.create({
      userId: req.user.id,
      message: "Your complaint has been cancelled",
    });

    res.json({
      message: "Complaint cancelled successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//Edit complaint within 15 mins window
export const editComplaint = async (req, res) => {
  try {
    const { roomNumber, category, description } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // 🔐 Only owner can edit
    if (complaint.studentId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ⏱ 15-minute window check
    const now = new Date();
    const createdTime = new Date(complaint.createdAt);

    const diffInMinutes = (now - createdTime) / (1000 * 60);

    if (diffInMinutes > 15) {
      return res.status(400).json({
        message: "Edit allowed only within 15 minutes",
      });
    }

    // ❌ Cannot edit resolved/cancelled
    if (
      complaint.status === "resolved" ||
      complaint.status === "cancelled"
    ) {
      return res.status(400).json({
        message: "Cannot edit this complaint",
      });
    }

    // ✏️ Update fields
    complaint.roomNumber = roomNumber || complaint.roomNumber;
    complaint.category = category || complaint.category;
    complaint.description = description || complaint.description;

    await complaint.save();

    res.json({
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};