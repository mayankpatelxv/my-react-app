// Updated supabaseClient.js if you rename password column to auth_token
// Replace the user management functions with these if you use the easiest solution

// User management functions (with renamed password column)
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
    // Hash the input password to compare with stored hash
    const hashedPassword = btoa(password);
    
    const { data, error } = await supabase
      .from("users_data")
      .select("id, name, email, first_name, last_name, created_at") // Exclude auth_token from response
      .eq("email", email)
      .eq("auth_token", hashedPassword) // Use auth_token instead of password
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