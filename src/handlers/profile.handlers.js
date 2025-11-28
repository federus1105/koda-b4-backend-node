import { UpdateProfile } from "../models/profile.models.js";

export const updateProfileHandler = async (req, res) => {
  try {
    // --- CHECKING ID IN CONTEXT ---
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not logged in",
      });
    }

    // --- FIELD UPDATE DATA ---
    const body = req.body || {};
    const input = {
      fullname: body.fullname,
      phone: body.phone,
      address: body.address,
      email: body.email,
      photosStr: req.file ? req.file.filename : undefined,
    };

    // --- CHECKING IF UNDIFINED FIELD ---
    const Update = Object.values(input).some((v) => v !== undefined);
    if (!Update) {
      return res.status(400).json({
        success: false,
        message: "No data to update",
      });
    }

    // --- UPDATE DATA --- 
    const updated = await UpdateProfile(userId, input);
    return res.status(201).json({
      success: true,
      message: "Update Profile Successfully",
      result: updated
    });

  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: err.message,
    });
  }
};
