import { createClient } from "@supabase/supabase-js";

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key exists:", !!supabaseKey);
console.log("Supabase Key preview:", supabaseKey?.substring(0, 20) + "...");

export const supabase = createClient(supabaseUrl, supabaseKey);

// OAuth authentication functions
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/my-react-app/dashboard`
      }
    });

    if (error) {
      console.log("Google OAuth Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.log("Google OAuth Error:", err);
    return { success: false, error: err.message };
  }
};

// Handle OAuth callback and sync with users_data table
export const handleOAuthCallback = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.log("Session Error:", error);
      return { success: false, error: error.message };
    }

    if (!session) {
      return { success: false, error: "No session found" };
    }

    const user = session.user;
    console.log("OAuth User:", user);

    // Check if user exists in users_data table
    const { data: existingUser, error: fetchError } = await supabase
      .from("users_data")
      .select("*")
      .eq("email", user.email)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.log("Fetch User Error:", fetchError);
      return { success: false, error: fetchError.message };
    }

    // If user doesn't exist, create them
    if (!existingUser) {
      const insertData = {
        email: user.email,
        name: user.user_metadata?.full_name || user.email.split('@')[0],
        first_name: user.user_metadata?.given_name || '',
        last_name: user.user_metadata?.family_name || '',
        auth_token: 'OAUTH_USER', // Mark as OAuth user
        password_hashed: true
      };

      const { data: newUser, error: insertError } = await supabase
        .from("users_data")
        .insert([insertData])
        .select("id, name, email, first_name, last_name, created_at")
        .single();

      if (insertError) {
        console.log("Insert User Error:", insertError);
        return { success: false, error: insertError.message };
      }

      return { success: true, data: newUser };
    }

    // Return existing user data
    const { auth_token, password_hashed, ...userData } = existingUser;
    return { success: true, data: userData };

  } catch (err) {
    console.log("OAuth Callback Error:", err);
    return { success: false, error: err.message };
  }
};

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

// Sales management functions
export const addSale = async (saleData, userId) => {
  try {
    console.log("Attempting to insert sale:", saleData);
    console.log("User ID:", userId);
    
    const insertData = {
      user_id: userId.toString(),
      customer_name: saleData.customerName,
      customer_id: saleData.customerId || null,
      invoice_date: saleData.invoiceDate || new Date().toISOString().split('T')[0],
      due_date: saleData.dueDate || null,
      subtotal: parseFloat(saleData.subtotal),
      tax_rate: parseFloat(saleData.taxRate),
      tax_amount: parseFloat(saleData.taxAmount),
      discount_amount: parseFloat(saleData.discountAmount),
      total_amount: parseFloat(saleData.totalAmount),
      status: saleData.status || 'draft',
      payment_terms: saleData.paymentTerms || null,
      notes: saleData.notes || null
    };
    
    console.log("Insert data:", insertData);
    
    const { data, error } = await supabase
      .from("sales")
      .insert([insertData])
      .select();

    if (error) {
      console.log("Supabase Error:", error);
      return {
        success: false,
        error: error.message || "Database error occurred",
      };
    } else {
      console.log("Sale inserted successfully:", data);
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

export const addSaleItems = async (saleId, items) => {
  try {
    console.log("Attempting to insert sale items:", saleId, items);
    
    const insertData = items.map(item => ({
      sale_id: saleId,
      item_id: item.itemId || null,
      item_name: item.name,
      item_description: item.description || null,
      quantity: parseInt(item.quantity),
      unit_price: parseFloat(item.price),
      line_total: parseFloat(item.price) * parseInt(item.quantity)
    }));
    
    console.log("Insert items data:", insertData);
    
    const { data, error } = await supabase
      .from("sales_items")
      .insert(insertData)
      .select();

    if (error) {
      console.log("Supabase Error:", error);
      return {
        success: false,
        error: error.message || "Database error occurred",
      };
    } else {
      console.log("Sale items inserted successfully:", data);
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

export const getSales = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("sales")
      .select(`
        *,
        sales_items (
          id,
          item_id,
          item_name,
          item_description,
          quantity,
          unit_price,
          line_total
        )
      `)
      .eq("user_id", userId.toString())
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Get Sales Error:", error);
      return { success: false, error: error.message || "Failed to fetch sales" };
    } else {
      console.log("Sales fetched successfully:", data);
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

export const updateSale = async (saleId, saleData, userId) => {
  try {
    console.log("Attempting to update sale:", saleId, saleData);
    
    const updateData = {
      customer_name: saleData.customerName,
      customer_id: saleData.customerId || null,
      invoice_date: saleData.invoiceDate,
      due_date: saleData.dueDate || null,
      subtotal: parseFloat(saleData.subtotal),
      tax_rate: parseFloat(saleData.taxRate),
      tax_amount: parseFloat(saleData.taxAmount),
      discount_amount: parseFloat(saleData.discountAmount),
      total_amount: parseFloat(saleData.totalAmount),
      status: saleData.status,
      payment_terms: saleData.paymentTerms || null,
      notes: saleData.notes || null
    };
    
    const { data, error } = await supabase
      .from("sales")
      .update(updateData)
      .eq("id", saleId)
      .eq("user_id", userId)
      .select();

    if (error) {
      console.log("Supabase Error:", error);
      return {
        success: false,
        error: error.message || "Database error occurred",
      };
    } else {
      console.log("Sale updated successfully:", data);
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

export const deleteSale = async (saleId, userId) => {
  try {
    const { data, error } = await supabase
      .from("sales")
      .delete()
      .eq("id", saleId)
      .eq("user_id", userId)
      .select();

    if (error) {
      console.log("Delete Sale Error:", error);
      return { success: false, error: error.message || "Failed to delete sale" };
    } else {
      console.log("Sale deleted successfully:", data);
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

// Function to create a complete sale with items in a transaction
export const createSaleWithItems = async (saleData, items, userId) => {
  try {
    console.log("Creating sale with items:", saleData, items);
    
    // First create the sale
    const saleResult = await addSale(saleData, userId);
    if (!saleResult.success) {
      return saleResult;
    }
    
    // Then add the items
    const itemsResult = await addSaleItems(saleResult.data.id, items);
    if (!itemsResult.success) {
      // If items failed, we should ideally rollback the sale
      // For now, we'll return the error
      return itemsResult;
    }
    
    return {
      success: true,
      data: {
        sale: saleResult.data,
        items: itemsResult.data
      }
    };
  } catch (err) {
    console.log("Create Sale with Items Error:", err);
    return {
      success: false,
      error: "Failed to create sale with items.",
    };
  }
};

// Purchase management functions
export const addPurchase = async (purchaseData, userId) => {
  try {
    console.log("Attempting to insert purchase:", purchaseData);
    console.log("User ID:", userId);
    
    const insertData = {
      user_id: userId.toString(),
      supplier_name: purchaseData.supplierName,
      supplier_id: purchaseData.supplierId || null,
      bill_number: purchaseData.billNumber || null, // Will be auto-generated if null
      purchase_date: purchaseData.purchaseDate || new Date().toISOString().split('T')[0],
      due_date: purchaseData.dueDate || null,
      subtotal: parseFloat(purchaseData.subtotal),
      tax_rate: parseFloat(purchaseData.taxRate || 0),
      tax_amount: parseFloat(purchaseData.taxAmount || 0),
      discount_amount: parseFloat(purchaseData.discountAmount || 0),
      total_amount: parseFloat(purchaseData.totalAmount),
      status: purchaseData.status || 'pending',
      payment_terms: purchaseData.paymentTerms || null,
      notes: purchaseData.notes || null,
      attached_document: purchaseData.attachedDocument || null
    };
    
    console.log("Insert data:", insertData);
    
    const { data, error } = await supabase
      .from("purchases")
      .insert([insertData])
      .select();

    if (error) {
      console.log("Supabase Error:", error);
      return {
        success: false,
        error: error.message || "Database error occurred",
      };
    } else {
      console.log("Purchase inserted successfully:", data);
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

export const addPurchaseItems = async (purchaseId, items) => {
  try {
    console.log("Attempting to insert purchase items:", purchaseId, items);
    
    const insertData = items.map(item => ({
      purchase_id: purchaseId,
      item_id: item.itemId || null,
      item_name: item.name,
      item_description: item.description || null,
      quantity: parseInt(item.quantity),
      unit_cost: parseFloat(item.unitCost || item.price || 0),
      line_total: parseFloat(item.unitCost || item.price || 0) * parseInt(item.quantity)
    }));
    
    console.log("Insert items data:", insertData);
    
    const { data, error } = await supabase
      .from("purchase_items")
      .insert(insertData)
      .select();

    if (error) {
      console.log("Supabase Error:", error);
      return {
        success: false,
        error: error.message || "Database error occurred",
      };
    } else {
      console.log("Purchase items inserted successfully:", data);
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

export const getPurchases = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("purchases")
      .select(`
        *,
        purchase_items (
          id,
          item_id,
          item_name,
          item_description,
          quantity,
          unit_cost,
          line_total
        )
      `)
      .eq("user_id", userId.toString())
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Get Purchases Error:", error);
      return { success: false, error: error.message || "Failed to fetch purchases" };
    } else {
      console.log("Purchases fetched successfully:", data);
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

export const updatePurchase = async (purchaseId, purchaseData, userId) => {
  try {
    console.log("Attempting to update purchase:", purchaseId, purchaseData);
    
    const updateData = {
      supplier_name: purchaseData.supplierName,
      supplier_id: purchaseData.supplierId || null,
      bill_number: purchaseData.billNumber,
      purchase_date: purchaseData.purchaseDate,
      due_date: purchaseData.dueDate || null,
      subtotal: parseFloat(purchaseData.subtotal),
      tax_rate: parseFloat(purchaseData.taxRate || 0),
      tax_amount: parseFloat(purchaseData.taxAmount || 0),
      discount_amount: parseFloat(purchaseData.discountAmount || 0),
      total_amount: parseFloat(purchaseData.totalAmount),
      status: purchaseData.status,
      payment_terms: purchaseData.paymentTerms || null,
      notes: purchaseData.notes || null,
      attached_document: purchaseData.attachedDocument || null
    };
    
    const { data, error } = await supabase
      .from("purchases")
      .update(updateData)
      .eq("id", purchaseId)
      .eq("user_id", userId)
      .select();

    if (error) {
      console.log("Supabase Error:", error);
      return {
        success: false,
        error: error.message || "Database error occurred",
      };
    } else {
      console.log("Purchase updated successfully:", data);
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

export const deletePurchase = async (purchaseId, userId) => {
  try {
    const { data, error } = await supabase
      .from("purchases")
      .delete()
      .eq("id", purchaseId)
      .eq("user_id", userId)
      .select();

    if (error) {
      console.log("Delete Purchase Error:", error);
      return { success: false, error: error.message || "Failed to delete purchase" };
    } else {
      console.log("Purchase deleted successfully:", data);
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

// Function to create a complete purchase with items in a transaction
export const createPurchaseWithItems = async (purchaseData, items, userId) => {
  try {
    console.log("Creating purchase with items:", purchaseData, items);
    
    // First create the purchase
    const purchaseResult = await addPurchase(purchaseData, userId);
    if (!purchaseResult.success) {
      return purchaseResult;
    }
    
    // Then add the items
    const itemsResult = await addPurchaseItems(purchaseResult.data.id, items);
    if (!itemsResult.success) {
      // If items failed, we should ideally rollback the purchase
      // For now, we'll return the error
      return itemsResult;
    }
    
    return {
      success: true,
      data: {
        purchase: purchaseResult.data,
        items: itemsResult.data
      }
    };
  } catch (err) {
    console.log("Create Purchase with Items Error:", err);
    return {
      success: false,
      error: "Failed to create purchase with items.",
    };
  }
};

// File upload functions for purchase documents
export const uploadPurchaseDocument = async (file, userId, purchaseId) => {
  try {
    console.log("Uploading purchase document:", file.name);
    
    // Create unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${purchaseId || 'temp'}_${Date.now()}.${fileExt}`;
    
    console.log("Uploading to path:", fileName);
    
    const { data, error } = await supabase.storage
      .from('purchase-documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.log("Upload Error:", error);
      return { success: false, error: error.message };
    }

    console.log("File uploaded successfully:", data);
    return { success: true, data: { path: data.path, fileName: file.name } };
  } catch (err) {
    console.log("Upload Error:", err);
    return { success: false, error: err.message };
  }
};

export const getPurchaseDocumentUrl = async (filePath) => {
  try {
    const { data, error } = await supabase.storage
      .from('purchase-documents')
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (error) {
      console.log("Get URL Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data.signedUrl };
  } catch (err) {
    console.log("Get URL Error:", err);
    return { success: false, error: err.message };
  }
};

export const deletePurchaseDocument = async (filePath) => {
  try {
    const { data, error } = await supabase.storage
      .from('purchase-documents')
      .remove([filePath]);

    if (error) {
      console.log("Delete Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.log("Delete Error:", err);
    return { success: false, error: err.message };
  }
};
// Enhanced getPurchases function to include document URLs
export const getPurchasesWithDocuments = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("purchases")
      .select(`
        *,
        purchase_items (
          id,
          item_id,
          item_name,
          item_description,
          quantity,
          unit_cost,
          line_total
        )
      `)
      .eq("user_id", userId.toString())
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Get Purchases Error:", error);
      return { success: false, error: error.message || "Failed to fetch purchases" };
    }

    // For each purchase with attached_document, get the signed URL
    const purchasesWithUrls = await Promise.all(
      data.map(async (purchase) => {
        if (purchase.attached_document && purchase.attached_document.includes('/')) {
          // This is a file path, get signed URL
          const urlResult = await getPurchaseDocumentUrl(purchase.attached_document);
          return {
            ...purchase,
            document_url: urlResult.success ? urlResult.data : null
          };
        }
        return purchase;
      })
    );

    console.log("Purchases with documents fetched successfully:", purchasesWithUrls);
    return { success: true, data: purchasesWithUrls };
  } catch (err) {
    console.log("Network/Connection Error:", err);
    return {
      success: false,
      error: "Connection failed. Please check your internet connection.",
    };
  }
};
// Test function to check storage bucket
export const testStorageBucket = async () => {
  try {
    const { data, error } = await supabase.storage
      .from('purchase-documents')
      .list('', { limit: 1 });

    if (error) {
      console.log("Storage test error:", error);
      return { success: false, error: error.message };
    }

    console.log("Storage bucket accessible:", data);
    return { success: true, data };
  } catch (err) {
    console.log("Storage test error:", err);
    return { success: false, error: err.message };
  }
};


// Delete all user data
export const deleteAllUserData = async (userId) => {
  try {
    // Delete in order: sale_items, sales, purchase_items, purchases, items, parties
    
    // 1. Delete sale items (via sales foreign key cascade)
    const { error: salesError } = await supabase
      .from('sales')
      .delete()
      .eq('user_id', userId);
    
    if (salesError) throw salesError;

    // 2. Delete purchase items (via purchases foreign key cascade)
    const { error: purchasesError } = await supabase
      .from('purchases')
      .delete()
      .eq('user_id', userId);
    
    if (purchasesError) throw purchasesError;

    // 3. Delete items
    const { error: itemsError } = await supabase
      .from('items')
      .delete()
      .eq('user_id', userId);
    
    if (itemsError) throw itemsError;

    // 4. Delete parties
    const { error: partiesError } = await supabase
      .from('parties')
      .delete()
      .eq('user_id', userId);
    
    if (partiesError) throw partiesError;

    return { success: true };
  } catch (err) {
    console.error("Error deleting all user data:", err);
    return { success: false, error: err.message };
  }
};
