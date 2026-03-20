import Complaint from "../models/Complaint.js";



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

    res.json({
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};