import { createClient } from "@supabase/supabase-js";

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key exists:", !!supabaseKey);
console.log("Supabase Key preview:", supabaseKey?.substring(0, 20) + "...");

export const supabase = createClient(supabaseUrl, supabaseKey);

// User management functions
export const addUser = async (userData) => {
  try {
    console.log("Attempting to insert user:", { ...userData, password: "[HIDDEN]" });
    
    // Hash the password before storing (simple hash for demo - use bcrypt in production)
    const hashedPassword = btoa(userData.password); // Base64 encoding (use proper hashing in production)
    
    // Prepare data to match your table structure
    const insertData = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword, // Store hashed password
      first_name: userData.first_name,
      last_name: userData.last_name
    };
    
    const { data, error } = await supabase
      .from("users_data")
      .insert([insertData])
      .select("id, name, email, first_name, last_name, created_at"); // Exclude password from response

    if (error) {
      console.log("Supabase Error:", error);
      return {
        success: false,
        error: error.message || "Database error occurred",
      };
    } else {
      console.log("Inserted successfully:", data);
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

export const loginUser = async (email, password) => {
  try {
    // Hash the input password to compare with stored hash
    const hashedPassword = btoa(password); // Base64 encoding (use proper hashing in production)
    
    const { data, error } = await supabase
      .from("users_data")
      .select("id, name, email, first_name, last_name, created_at") // Exclude password from response
      .eq("email", email)
      .eq("password", hashedPassword)
      .single();

    if (error) {
      console.log("Login Error:", error);
      return { success: false, error: "Invalid email or password" };
    } else {
      console.log("Login Success:", data);
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

// Function to migrate existing plain text passwords to hashed (run once)
export const migrateUserPasswords = async () => {
  try {
    console.log("Starting password migration...");
    
    // Get all users with plain text passwords
    const { data: users, error: fetchError } = await supabase
      .from("users_data")
      .select("id, email, password")
      .is("password_hashed", false);

    if (fetchError) {
      console.log("Error fetching users:", fetchError);
      return { success: false, error: fetchError.message };
    }

    if (!users || users.length === 0) {
      console.log("No users to migrate");
      return { success: true, message: "No users to migrate" };
    }

    // Update each user's password
    for (const user of users) {
      const hashedPassword = btoa(user.password);
      
      const { error: updateError } = await supabase
        .from("users_data")
        .update({ 
          password: hashedPassword,
          password_hashed: true 
        })
        .eq("id", user.id);

      if (updateError) {
        console.log(`Error updating user ${user.email}:`, updateError);
      } else {
        console.log(`Updated password for user: ${user.email}`);
      }
    }

    return { success: true, message: `Migrated ${users.length} user passwords` };
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
