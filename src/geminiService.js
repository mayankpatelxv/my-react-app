// Gemini AI Service for Business Assistant Chatbot

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export const sendMessageToGemini = async (message, conversationHistory = []) => {
  try {
    console.log('🤖 Gemini API Call Started');
    console.log('📝 Message:', message);
    console.log('🔑 API Key exists:', !!GEMINI_API_KEY);
    console.log('🌐 API URL:', GEMINI_API_URL);
    
    if (!GEMINI_API_KEY) {
      console.error('❌ No API key found');
      throw new Error('Gemini API key is not configured');
    }
    
    // Request body matching official API format
    const businessMessage = `You are an AI assistant for a business management application called "bizBuddy". Help users with sales, purchases, inventory, and customer management. Be professional and concise.

User question: ${message}`;

    const requestBody = {
      contents: [
        {
          parts: [
            { text: businessMessage }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    };

    console.log('📦 Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📡 Response status:', response.status);
    console.log('✅ Response ok:', response.ok);
    console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response text:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
        console.error('❌ Parsed error data:', errorData);
      } catch (e) {
        console.error('❌ Could not parse error as JSON');
        errorData = { error: { message: errorText } };
      }
      
      // Handle specific error types
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
      } else if (response.status === 403) {
        throw new Error('API key is invalid or has insufficient permissions.');
      } else if (response.status === 400) {
        throw new Error('Invalid request format or parameters.');
      } else {
        throw new Error(`Gemini API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }
    }

    const data = await response.json();
    console.log('🎉 Success response:', JSON.stringify(data, null, 2));
    console.log('📋 Candidates:', data.candidates);
    
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      console.log('📝 First candidate:', JSON.stringify(candidate, null, 2));
      
      // Check if response was blocked by safety filters
      if (candidate.finishReason === 'SAFETY') {
        console.warn('⚠️ Response blocked by safety filters');
        return {
          success: false,
          error: 'Response blocked by safety filters',
          fallbackResponse: "I apologize, but I cannot provide a response to that query. Please ask me about business management topics like sales, inventory, or customer management."
        };
      }
      
      // More robust text extraction with multiple fallback methods
      let aiResponse = '';
      
      // Method 1: Standard structure
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        aiResponse = candidate.content.parts[0].text;
        console.log('✅ Method 1 - Standard extraction successful:', aiResponse);
      }
      // Method 2: Alternative structure check
      else if (candidate.text) {
        aiResponse = candidate.text;
        console.log('✅ Method 2 - Direct text extraction successful:', aiResponse);
      }
      // Method 3: Check for message content
      else if (candidate.message && candidate.message.content) {
        aiResponse = candidate.message.content;
        console.log('✅ Method 3 - Message content extraction successful:', aiResponse);
      }
      // Method 4: Raw candidate as text
      else if (typeof candidate === 'string') {
        aiResponse = candidate;
        console.log('✅ Method 4 - Raw string extraction successful:', aiResponse);
      }
      else {
        console.error('❌ All extraction methods failed. Candidate structure:', JSON.stringify(candidate, null, 2));
        throw new Error('Unable to extract text from API response. Unexpected response structure.');
      }
      
      if (!aiResponse || aiResponse.trim() === '') {
        console.error('❌ Extracted response is empty');
        throw new Error('API returned empty response');
      }
      
      console.log('💬 Final AI Response:', aiResponse);
      return {
        success: true,
        response: aiResponse
      };
    } else {
      console.error('❌ No candidates in response:', JSON.stringify(data, null, 2));
      throw new Error('No response generated from Gemini API');
    }

  } catch (error) {
    console.error('💥 Error calling Gemini API:', error);
    console.error('📊 Error stack:', error.stack);
    
    // Provide specific fallback responses based on error type
    let fallbackResponse = "I apologize, but I'm having trouble connecting to my AI service right now. Please try again in a moment.";
    
    if (error.message.includes('Rate limit')) {
      fallbackResponse = "I'm currently experiencing high demand. Please wait a moment and try again.";
    } else if (error.message.includes('API key')) {
      fallbackResponse = "There's a configuration issue with the AI service. Please check the API key configuration.";
    } else if (error.message.includes('fetch')) {
      fallbackResponse = "Network connection issue. Please check your internet connection and try again.";
    }
    
    return {
      success: false,
      error: error.message,
      fallbackResponse
    };
  }
};

// Enhanced business-specific prompts
export const getBusinessPrompt = (userMessage, businessData = {}) => {
  const { totalSales = 0, totalPurchases = 0, totalItems = 0, totalParties = 0 } = businessData;
  
  return `
Business Context:
- Total Sales: $${totalSales.toFixed(2)}
- Total Purchases: $${totalPurchases.toFixed(2)}
- Total Items in Inventory: ${totalItems}
- Total Customers & Suppliers: ${totalParties}

User Question: ${userMessage}

Please provide a helpful response related to business management, sales, purchases, inventory, or customer relations.
`;
};

// Quick response templates for common queries
export const getQuickResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  const quickResponses = {
    'hello': 'Hello! I\'m your business assistant for bizBuddy. I can help you with sales, purchases, inventory management, customer relations, and business analytics. What would you like to know?',
    'hi': 'Hi there! I\'m here to help with your business management needs. I can assist with invoices, inventory, reports, and more. How can I help you today?',
    'help': 'I can assist you with:\n• Creating and managing invoices\n• Tracking purchases and expenses\n• Managing inventory items\n• Customer and supplier management\n• Generating business reports\n• Analyzing sales data\n• Low stock alerts\n• Business insights and recommendations\n\nWhat specific area would you like help with?',
    'features': 'bizBuddy offers these key features:\n• Dashboard - Overview of your business metrics\n• Party Management - Manage customers and suppliers\n• Item Management - Track your inventory\n• Sales - Create invoices and track sales\n• Purchases - Manage purchase orders with document uploads\n• Reports - Generate business analytics and annual reports\n• AI Assistant - Get business insights and help\n\nWhich feature would you like to learn more about?',
    'invoice': 'To create an invoice:\n1. Go to the Sales section\n2. Click "Create New Invoice"\n3. Select or add a customer\n4. Add items with quantities and prices\n5. Review totals and save\n\nI can also help you track existing invoices and analyze sales patterns. What specific invoice help do you need?',
    'inventory': 'For inventory management:\n• Add new items in Item Management\n• Track stock levels and set minimum thresholds\n• Monitor low stock alerts\n• Update quantities after sales/purchases\n\nWould you like help with adding items, checking stock levels, or managing low inventory?',
    'reports': 'Available reports include:\n• Sales analytics and trends\n• Purchase summaries\n• Inventory status reports\n• Customer analysis\n• Annual business reports\n• Profit/loss insights\n\nWhich type of report interests you most?',
    'customers': 'Customer management features:\n• Add new customers with contact details\n• Track customer purchase history\n• Set credit limits and payment terms\n• Analyze top customers by sales volume\n\nWhat customer management task can I help you with?'
  };

  for (const [key, response] of Object.entries(quickResponses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  
  return null;
};

// Function to fetch comprehensive business data for AI context
export const fetchBusinessDataForAI = async (userId, supabaseClient) => {
  try {
    console.log('Fetching business data for AI context...');
    
    // Fetch all business data in parallel
    const [salesResult, purchasesResult, itemsResult, partiesResult] = await Promise.all([
      supabaseClient.getSales(userId),
      supabaseClient.getPurchases(userId),
      supabaseClient.getItems(userId),
      supabaseClient.getParties(userId)
    ]);

    const businessData = {
      totalSales: 0,
      totalPurchases: 0,
      totalItems: 0,
      totalParties: 0,
      recentSales: [],
      recentPurchases: [],
      lowStockItems: [],
      topCustomers: []
    };

    // Process sales data
    if (salesResult.success && salesResult.data) {
      businessData.recentSales = salesResult.data.slice(0, 5);
      businessData.totalSales = salesResult.data.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
      
      // Get top customers by total sales
      const customerSales = {};
      salesResult.data.forEach(sale => {
        if (sale.customer_name) {
          customerSales[sale.customer_name] = (customerSales[sale.customer_name] || 0) + (sale.total_amount || 0);
        }
      });
      businessData.topCustomers = Object.entries(customerSales)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([name, total]) => ({ name, total }));
    }

    // Process purchases data
    if (purchasesResult.success && purchasesResult.data) {
      businessData.recentPurchases = purchasesResult.data.slice(0, 5);
      businessData.totalPurchases = purchasesResult.data.reduce((sum, purchase) => sum + (purchase.total_amount || 0), 0);
    }

    // Process items data
    if (itemsResult.success && itemsResult.data) {
      businessData.totalItems = itemsResult.data.length;
      // Find low stock items
      businessData.lowStockItems = itemsResult.data.filter(item => {
        const minStock = item.min_stock_level || 10;
        return item.stock_level <= minStock;
      }).slice(0, 5);
    }

    // Process parties data
    if (partiesResult.success && partiesResult.data) {
      businessData.totalParties = partiesResult.data.length;
    }

    console.log('Business data fetched for AI:', businessData);
    return businessData;
    
  } catch (error) {
    console.error('Error fetching business data for AI:', error);
    return {
      totalSales: 0,
      totalPurchases: 0,
      totalItems: 0,
      totalParties: 0,
      recentSales: [],
      recentPurchases: [],
      lowStockItems: [],
      topCustomers: []
    };
  }
};