import { CreateCart, GetCart, Orders } from "../models/orders.models.js";

/**
 * POST /cart
 * @summary Create new cart item
 * @tags Cart
 * @param {CreateCart} request.body.required - Data input cart
 * @return {object} 201 - Cart created successfully
 * @return {object} 400 - Business logic error
 * @return {object} 401 - Unauthorized
 * @return {object} 500 - Internal server error
 * @security bearerAuth
 */
export async function CreateCartHandler(req, res) {
  try {
    const accountID = req.user?.id;
    if (!accountID) {
      return res.status(401).json({
        success: false, 
        message: "Unauthorized: user not logged in",
    });
    }

    const cartItem = await CreateCart(accountID, req.body);
    return res.status(201).json({
      success: true,
      message:"Create cart succesfully",
      results: cartItem
    });

  } catch (error) {
  console.log("CreateCart Error:", error);
  // --- ERROR BUSINES LOGIC ---
  if (error.message.includes("Product not found") || 
      error.message.includes("Product is out of stock") || 
      error.message.includes("Insufficient stock")) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: error.message
  });
  }
}


/**
 * GET /cart
 * @summary List Cart
 * @tags Cart
 * @return {object} 200 - success response
 * @security bearerAuth
 */
export async function GetCartHandler(req, res) {
  try {
    const userID = req.user?.id;
    if (!userID) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not logged in"
      });
    }

    const cartItems = await GetCart(userID);

    return res.status(200).json({
      success: true,
      message: "Get cart successfully",
      results: cartItems
    });
  } catch (error) {
    console.error("GetCartHandler Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
}

/**
 * POST /transactions
 * @summary Create your orders
 * @tags Orders
 * @param {Orders} request.body.required - Data input orders
 * @return {object} 201 - Cart created successfully
 * @return {object} 400 - Business logic error
 * @return {object} 401 - Unauthorized
 * @return {object} 500 - Internal server error
 * @security bearerAuth
 */
export async function OrdersHandler(req, res) {
  try {

      const userID = req.user?.id;
      if (!userID) return res.status(401).json({ 
        success: false, 
        message: "Unauthorized: user not logged in",
      });
  
      const input = req.body;
      const orders = await Orders(input, userID);
      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        results: orders
      });

    } catch (error) {
    console.error("orders Error:", error);
    if (error.errors) {
      return res.status(400).json({
        success: false,
        errors: error.errors
      });
    }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
    
}