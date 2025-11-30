import { CreateUser, ListUser, UpdateUser } from "../models/user.admin.models.js";

/**
 * GET /admin/user
 * @summary List users with optional search and pagination
 * @tags Users
 * @param {string} name.query - Optional users name to search
 * @param {number} page.query - Page number for pagination (default 1)
 * @return {object} 200 - success response
 * @security bearerAuth
 */
export async function ListUserHandler(req, res) {
  try {
    // --- FILTER AND PAGINATION ---
    const name = req.query.name || '' ;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    
    const users = await ListUser({ name, skip, take: limit });
    const total = await ListUser ({name, countOnly: true})
    if (users.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Users not found",
            results: []
        });
    }
    
    const totalPages = Math.ceil(total / limit);
    const baseURL = "/admin/user";
    const queryPrefix = name ? `?name=${encodeURIComponent(name)}` : "?";
    // --- PREV URL ---
    let prevURL = null;
    if (page > 1) {
      const sep = name ? "&" : "?";
      prevURL = `${baseURL}${queryPrefix}${sep}page=${page - 1}`;
    }
    // --- NEXT URL ---
    let nextURL = null;
    if (page < totalPages) {
      const sep = name ? "&" : "?";
      nextURL = `${baseURL}${queryPrefix}${sep}page=${page + 1}`;
    }

     const result = {
      success: true,
      message: "Get list user successfully",
      page,
      limit,
      total,
      totalPages,
      prevURL,
      nextURL,
      results: users,
    };
    
    return res.status(200).json(result)

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * POST /admin/user
 * @summary Create a new user
 * @tags Users
 * @return {object} 201 - User created successfully
 * @param {ProductInput} request.body.required - users info - multipart/form-data
 * @security bearerAuth
 */
export async function  CreateUserHandler(req, res) {
  try {
    const { email, password, role, fullname, phone, address, photos } = req.body;

    const newUser = await CreateUser({
      email,
      password,
      role,
      fullname,
      phone,
      address,
      photos : req.file ? req.file.filename : null,
    });
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      result: newUser,
    });

  } catch (error) {
    console.error("Create User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
}

/**
 * PATCH /admin/user/{id}
 * @summary update data user
 * @tags Users
 * @param {number} id.path.required - User ID
 * @param {UpdateUserInput} request.body - users info - multipart/form-data
 * @return {object} 201 - User created successfully
 * @security bearerAuth
 */
export async function UpdateUserHandler(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const { fullname, phone, address, email, role, password } = req.body;

    const inputData = {
      fullname,
      phone,
      address,
      email,
      role,
      photos : req.file ? req.file.filename : undefined,
    };

    // --- Remove undefined fields ---
    Object.keys(inputData).forEach((key) => {
      if (inputData[key] === undefined) delete inputData[key];
    });

    const updated = await UpdateUser(id, inputData);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      result: updated,
    });

  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
}
