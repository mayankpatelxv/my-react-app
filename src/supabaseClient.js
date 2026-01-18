import { createClient } from "@supabase/supabase-js";

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key exists:", !!supabaseKey);
console.log("Supabase Key preview:", supabaseKey?.substring(0, 20) + "...");

export const supabase = createClient(supabaseUrl, supabaseKey);

// User management functions (with renamed password column to auth_token)
export const addUser = async (userData) => {
  try {
    console.log("Attempting to insert user:", { ...userData, password: "[HIDDEN]" });
    
    // Hash the password before storing
    const hashedPassword = btoa(userData.password);
    
    // Prepare data to match your table structure (using auth_token instead of password)
    const insertData = {
      name: userData.name,
      email: userData.email,
      auth_token: hashedPassword, // Renamed from password to auth_token
      first_name: userData.first_name,
      last_name: userData.last_name,
      password_hashed: true
    };
    
    const { data, error } = await supabase
      .from("users_data")
      .insert([insertData])
      .select("id, name, email, first_name, last_name, created_at"); // Exclude auth_token from response

    if (error) {
      console.log("Supabase Error:", error);
      return {
        success: false,
        error: error.message || "Database error occurred",
      };
    } else {
      console.log("Inserted successfully:", data);
      return { success: true, data: data[0] };
    }
  } catch (err) {
    console.log("Network/Connection Error:", err);
    return {
      success: false,
      error: "Connection failed. Please check your internet connection.",
    };
  }
};

export const loginUser = async (email, password) => {
  try {
    console.log("Attempting login for:", email);
    
    // First try with hashed password
    const hashedPassword = btoa(password);
    
    let { data, error } = await supabase
      .from("users_data")
      .select("id, name, email, first_name, last_name, created_at, auth_token, password_hashed")
      .eq("email", email)
      .eq("auth_token", hashedPassword)
      .single();

    // If hashed password didn't work, try plain text (for migration)
    if (error && error.code === 'PGRST116') { // No rows returned
      console.log("Hashed password failed, trying plain text...");
      
      const { data: plainData, error: plainError } = await supabase
        .from("users_data")
        .select("id, name, email, first_name, last_name, created_at, auth_token, password_hashed")
        .eq("email", email)
        .eq("auth_token", password) // Try plain text password
        .single();

      if (plainError) {
        console.log("Both login attempts failed:", plainError);
        return { success: false, error: "Invalid email or password" };
      }

      // If plain text worked, hash the password for future use
      console.log("Plain text login successful, updating to hashed...");
      const { error: updateError } = await supabase
        .from("users_data")
        .update({ 
          auth_token: hashedPassword,
          password_hashed: true 
        })
        .eq("id", plainData.id);

      if (updateError) {
        console.log("Failed to update password:", updateError);
      }

      // Return user data without auth_token
      const { auth_token, password_hashed, ...userData } = plainData;
      return { success: true, data: userData };
    }

    if (error) {
      console.log("Login Error:", error);
      return { success: false, error: "Invalid email or password" };
    }

    // Return user data without auth_token
    const { auth_token, password_hashed, ...userData } = data;
    console.log("Login Success:", userData);
    return { success: true, data: userData };

  } catch (err) {
    console.log("Network/Connection Error:", err);
    return {
      success: false,
      error: "Connection failed. Please check your internet connection.",
    };
  }
};

// Function to migrate existing plain text passwords to hashed (run once)
export const migrateUserPasswords = async () => {
  try {
    console.log("Starting password migration...");
    
    // Get all users with plain text passwords (or where password_hashed is false/null)
    const { data: users, error: fetchError } = await supabase
      .from("users_data")
      .select("id, email, auth_token, password_hashed") // Use auth_token instead of password
      .or("password_hashed.is.null,password_hashed.eq.false");

    if (fetchError) {
      console.log("Error fetching users:", fetchError);
      return { success: false, error: fetchError.message };
    }

    if (!users || users.length === 0) {
      console.log("No users to migrate");
      return { success: true, message: "No users to migrate" };
    }

    // Update each user's password
    let migratedCount = 0;
    for (const user of users) {
      // Skip if password is already hashed or empty
      if (!user.auth_token || user.auth_token === 'RESET_REQUIRED') {
        continue;
      }

      const hashedPassword = btoa(user.auth_token);
      
      const { error: updateError } = await supabase
        .from("users_data")
        .update({ 
          auth_token: hashedPassword, // Use auth_token instead of password
          password_hashed: true 
        })
        .eq("id", user.id);

      if (updateError) {
        console.log(`Error updating user ${user.email}:`, updateError);
      } else {
        console.log(`Updated password for user: ${user.email}`);
        migratedCount++;
      }
    }

    return { success: true, message: `Migrated ${migratedCount} user passwords` };
  } catch (err) {
    console.log("Migration Error:", err);
    return { success: false, error: err.message };
  }
};

// Party management functions
export const addParty = async (partyData, userId) => {
  try {
    console.log("Attempting to insert party:", partyData);
    console.log("User ID:", userId);
    
    const insertData = {
      name: partyData.name,
      email: partyData.email,
      phone: partyData.phone,
      address: partyData.address,
      city: partyData.city,
      state: partyData.state,
      zip_code: partyData.zipCode,
      country: partyData.country,
      party_type: partyData.partyType,
      tax_id: partyData.taxId,
      credit_limit: partyData.creditLimit ? parseFloat(partyData.creditLimit) : null,
      payment_terms: partyData.paymentTerms,
      notes: partyData.notes,
      user_id: userId.toString()
    };
    
    console.log("Insert data:", insertData);
    
    const { data, error } = await supabase
      .from("parties")
      .insert([insertData])
      .select();

    if (error) {
      console.log("Supabase Error:", error);
      return {
        success: false,
        error: error.message || "Database error occurred",
      };
    } else {
      console.log("Party inserted successfully:", data);
      return { success: true, data: data[0] };
    }
  } catch (err) {
    console.log("Network/Connection Error:", err);
    return {
      success: false,
      error: "Connection failed. Please check your internet connection.",
    };
  }
};

export const getParties = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("parties")
      .select("*")
      .eq("user_id", userId.toString())
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Get Parties Error:", error);
      return { success: false, error: error.message || "Failed to fetch parties" };
    } else {
      console.log("Parties fetched successfully:", data);
      return { success: true, data };
    }
  } catch (err) {
    console.log("Network/Connection Error:", err);
    return {
      success: false,
      error: "Connection failed. Please check your internet connection.",
    };
  }
};

export const updateParty = async (partyId, partyData, userId) => {
  try {
    console.log("Attempting to update party:", partyId, partyData);
    
    const updateData = {
      name: partyData.name,
      email: partyData.email,
      phone: partyData.phone,
      address: partyData.address,
      city: partyData.city,
      state: partyData.state,
      zip_code: partyData.zipCode,
      country: partyData.country,
      party_type: partyData.partyType,
      tax_id: partyData.taxId,
      credit_limit: partyData.creditLimit ? parseFloat(partyData.creditLimit) : null,
      payment_terms: partyData.paymentTerms,
      notes: partyData.notes
    };
    
    const { data, error } = await supabase
      .from("parties")
      .update(updateData)
      .eq("id", partyId)
      .eq("user_id", userId)
      .select();

    if (error) {
      console.log("Supabase Error:", error);
      return {
        success: false,
        error: error.message || "Database error occurred",
      };
    } else {
      console.log("Party updated successfully:", data);
      return { success: true, data: data[0] };
    }
  } catch (err) {
    console.log("Network/Connection Error:", err);
    return {
      success: false,
      error: "Connection failed. Please check your internet connection.",
    };
  }
};

export const deleteParty = async (partyId, userId) => {
  try {
    const { data, error } = await supabase
      .from("parties")
      .delete()
      .eq("id", partyId)
      .eq("user_id", userId)
      .select();

    if (error) {
      console.log("Delete Party Error:", error);
      return { success: false, error: error.message || "Failed to delete party" };
    } else {
      console.log("Party deleted successfully:", data);
      return { success: true, data: data[0] };
    }
  } catch (err) {
    console.log("Network/Connection Error:", err);
    return {
      success: false,
      error: "Connection failed. Please check your internet connection.",
    };
  }
};

// Item management functions
export const addItem = async (itemData, userId) => {
  try {
    console.log("Attempting to insert item:", itemData);
    console.log("User ID:", userId);
    
    const insertData = {
      name: itemData.name,
      category: itemData.category,
      unit: itemData.unit,
      price: parseFloat(itemData.price),
      stock_level: parseInt(itemData.stockLevel),
      min_stock_level: itemData.minStockLevel ? parseInt(itemData.minStockLevel) : null,
      description: itemData.description || null,
      sku: itemData.sku || null,
      barcode: itemData.barcode || null,
      supplier: itemData.supplier || null,
      location: itemData.location || null,
      weight: itemData.weight ? parseFloat(itemData.weight) : null,
      dimensions: itemData.dimensions || null,
      notes: itemData.notes || null,
      user_id: userId.toString()
    };
    
    console.log("Insert data:", insertData);
    
    const { data, error } = await supabase
      .from("items")
      .insert([insertData])
      .select();

    if (error) {
      console.log("Supabase Error:", error);
      return {
        success: false,
        error: error.message || "Database error occurred",
      };
    } else {
      console.log("Item inserted successfully:", data);
      return { success: true, data: data[0] };
    }
  } catch (err) {
    console.log("Network/Connection Error:", err);
    return {
      success: false,
      error: "Connection failed. Please check your internet connection.",
    };
  }
};

export const getItems = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("user_id", userId.toString())
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Get Items Error:", error);
      return { success: false, error: error.message || "Failed to fetch items" };
    } else {
      console.log("Items fetched successfully:", data);
      return { success: true, data };
    }
  } catch (err) {
    console.log("Network/Connection Error:", err);
    return {
      success: false,
      error: "Connection failed. Please check your internet connection.",
    };
  }
};

export const updateItem = async (itemId, itemData, userId) => {
  try {
    console.log("Attempting to update item:", itemId, itemData);
    
    const updateData = {
      name: itemData.name,
      category: itemData.category,
      unit: itemData.unit,
      price: parseFloat(itemData.price),
      stock_level: parseInt(itemData.stockLevel),
      min_stock_level: itemData.minStockLevel ? parseInt(itemData.minStockLevel) : null,
      description: itemData.description || null,
      sku: itemData.sku || null,
      barcode: itemData.barcode || null,
      supplier: itemData.supplier || null,
      location: itemData.location || null,
      weight: itemData.weight ? parseFloat(itemData.weight) : null,
      dimensions: itemData.dimensions || null,
      notes: itemData.notes || null
    };
    
    const { data, error } = await supabase
      .from("items")
      .update(updateData)
      .eq("id", itemId)
      .eq("user_id", userId)
      .select();

    if (error) {
      console.log("Supabase Error:", error);
      return {
        success: false,
        error: error.message || "Database error occurred",
      };
    } else {
      console.log("Item updated successfully:", data);
      return { success: true, data: data[0] };
    }
  } catch (err) {
    console.log("Network/Connection Error:", err);
    return {
      success: false,
      error: "Connection failed. Please check your internet connection.",
    };
  }
};

export const deleteItem = async (itemId, userId) => {
  try {
    const { data, error } = await supabase
      .from("items")
      .delete()
      .eq("id", itemId)
      .eq("user_id", userId)
      .select();

    if (error) {
      console.log("Delete Item Error:", error);
      return { success: false, error: error.message || "Failed to delete item" };
    } else {
      console.log("Item deleted successfully:", data);
      return { success: true, data: data[0] };
    }
  } catch (err) {
    console.log("Network/Connection Error:", err);
    return {
      success: false,
      error: "Connection failed. Please check your internet connection.",
    };
  }
};