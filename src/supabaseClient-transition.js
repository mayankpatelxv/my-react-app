// Temporary login function that handles both hashed and plain text passwords
// Replace the loginUser function in supabaseClient.js with this during transition

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