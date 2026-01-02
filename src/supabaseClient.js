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
    console.log("Attempting to insert user:", userData);
    
    // Prepare data to match your table structure
    const insertData = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      first_name: userData.first_name,
      last_name: userData.last_name
    };
    
    const { data, error } = await supabase
      .from("users_data")
      .insert([insertData])
      .select(); // Add select() to return the inserted data

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
    const { data, error } = await supabase
      .from("users_data")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (error) {
      console.log("Login Error:", error);
      return { success: false, error: error.message || "Login failed" };
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
