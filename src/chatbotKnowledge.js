// ============================================================
// bizBuddy Chatbot Knowledge Base
// All answers are based on the actual features of the app.
// No external API needed — fully self-contained.
// ============================================================

// Simple chatbot data with tags, patterns, and responses
const CHATBOT_DATA = [
  {
    tag: "greeting",
    patterns: ["hi", "hii", "hiii", "hello", "hey", "heyy", "hyy", "good morning", "good evening", "hi there", "hello there", "yo", "sup", "wassup"],
    responses: ["Hello! How can I help you?", "Hi there! What can I do for you?", "Hey! Need any help?"]
  },
  {
    tag: "how_are_you",
    patterns: ["how are you", "how are you doing", "how do you do", "how's it going", "how r u", "hows it going", "how are u", "hru", "how r you"],
    responses: ["I'm doing great, thank you! How can I assist you with bizBuddy today?", "I'm here and ready to help! What do you need?", "All good! What can I help you with?"]
  },
  {
    tag: "goodbye",
    patterns: ["bye", "byee", "goodbye", "good bye", "see you", "exit", "see you later", "talk to you later", "gtg", "gotta go", "cya"],
    responses: ["Goodbye! Have a nice day!", "See you later!", "Bye! Take care!"]
  },
  {
    tag: "thanks",
    patterns: ["thanks", "thank you", "thx", "ty", "tysm", "appreciate it", "thanks a lot", "thank you so much", "thnx", "thanx"],
    responses: ["You're welcome!", "No problem!", "Glad I could help!", "Happy to help!"]
  },
  {
    tag: "name",
    patterns: ["what is your name", "who are you", "your name", "what should i call you", "whats your name", "what's your name"],
    responses: ["I am your bizBuddy AI assistant!", "You can call me bizBuddy Assistant!", "I'm the bizBuddy chatbot, here to help you!"]
  },
  {
    tag: "help",
    patterns: ["i need help", "can you help me", "help me", "need assistance", "assist me", "help"],
    responses: ["Sure! Tell me what you need help with.", "I'm here to help you!", "Of course! What do you need?"]
  },
  {
    tag: "age",
    patterns: ["how old are you", "your age", "what is your age", "whats your age", "what's your age"],
    responses: ["I am just a program, so I don't have an age.", "I'm timeless! Just a helpful AI assistant."]
  },
  {
    tag: "creator",
    patterns: ["who created you", "who made you", "who built you", "who developed you"],
    responses: ["I was created by a developer like you 😉", "I was built to help bizBuddy users!"]
  },
  {
    tag: "capabilities",
    patterns: ["what can you do", "what do you know", "your capabilities", "what are you capable of"],
    responses: ["I can help you with all bizBuddy features like sales, purchases, inventory, customers, reports, and settings. Just ask me anything!"]
  },
  {
    tag: "unknown",
    patterns: [],
    responses: ["Sorry, I didn't understand that.", "Can you please rephrase?", "I'm not sure about that. Try asking about bizBuddy features!"]
  }
];

export const KNOWLEDGE_BASE = [

  // ── GREETINGS ──────────────────────────────────────────────
  {
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'sup', 'greetings'],
    answer: "Hello! 👋 Welcome to bizBuddy! I'm your built-in assistant. I can help you with:\n\n• 📊 Dashboard & Overview\n• 🛒 Sales & Invoices\n• 📦 Purchases\n• 📋 Inventory / Items\n• 👥 Party Management (Customers & Suppliers)\n• 📈 Annual Reports\n• ⚙️ Settings\n\nWhat would you like help with today?",
  },
  {
    patterns: ['bye', 'goodbye', 'see you', 'thanks bye', 'exit', 'close'],
    answer: "Goodbye! 👋 Feel free to ask me anything anytime. Have a great day running your business with bizBuddy!",
  },
  {
    patterns: ['thank', 'thanks', 'thank you', 'thx', 'ty'],
    answer: "You're welcome! 😊 Is there anything else I can help you with?",
  },
  {
    patterns: ['help', 'what can you do', 'what do you know', 'assist', 'support', 'guide'],
    answer: "I can answer questions about all bizBuddy features! Here's what I know:\n\n📊 **Dashboard** — Overview of your business\n🛒 **Sales** — Create invoices, record sales\n📦 **Purchases** — Record expenses and purchases\n📋 **Items** — Manage your inventory\n👥 **Parties** — Customers & suppliers\n📈 **Reports** — Annual financial reports\n⚙️ **Settings** — App preferences\n\nJust ask me anything like:\n• 'How do I create a sale?'\n• 'How to add a customer?'\n• 'How to view reports?'",
  },

  // ── DASHBOARD ──────────────────────────────────────────────
  {
    patterns: ['dashboard', 'home', 'overview', 'main page', 'summary', 'stats', 'statistics'],
    answer: "📊 **Dashboard Overview**\n\nThe Dashboard is your business command center. It shows:\n\n• **Total Sales** — Sum of all your sales transactions\n• **Total Purchases** — Sum of all your purchase expenses\n• **Total Items** — Number of products in your inventory\n• **Total Parties** — Number of customers & suppliers\n• **Profit Overview** — Visual bar chart of sales vs purchases vs net profit\n• **Financial Summary** — Ring chart showing profit margin\n\n**Quick Actions** on the dashboard let you jump to:\n→ Record Sale\n→ Record Purchase\n→ Party Management\n→ Item Management\n→ Annual Reports\n→ Settings",
  },
  {
    patterns: ['profit', 'net profit', 'profit margin', 'loss', 'earning', 'revenue'],
    answer: "💰 **Profit & Financial Overview**\n\nYour profit is calculated automatically:\n\n**Net Profit = Total Sales − Total Purchases**\n\nYou can see this on the Dashboard:\n• **Profit Overview card** — Bar chart comparing Sales, Purchases, and Net Profit\n• **Financial Summary card** — Ring chart showing profit margin %\n• **Profit Margin %** = (Net Profit ÷ Total Sales) × 100\n\nFor detailed reports, go to **Annual Reports** from the sidebar or Dashboard quick actions.",
  },

  // ── SALES ──────────────────────────────────────────────────
  {
    patterns: ['how to make sale', 'create sale', 'add sale', 'record sale', 'new sale', 'make a sale', 'how to sell', 'sales entry', 'how do i sell'],
    answer: "🛒 **How to Create a Sale**\n\n1. Click **Sales** in the sidebar\n2. Click the **'+ Add Sale'** button\n3. Fill in the details:\n   • Select **Customer** (Party)\n   • Select **Item** from your inventory\n   • Enter **Quantity**\n   • Enter **Price** (auto-filled from item)\n   • Add **Tax Rate** (optional, 0–100%)\n   • Add **Discount** (optional)\n4. The **Total Amount** is calculated automatically\n5. Click **Save** to record the sale\n\n✅ The sale is saved and your inventory stock is updated automatically.",
  },
  {
    patterns: ['invoice', 'create invoice', 'generate invoice', 'download invoice', 'print invoice', 'pdf invoice', 'bill'],
    answer: "🧾 **Invoices in bizBuddy**\n\nEvery sale you create automatically generates an invoice.\n\n**To download/print an invoice:**\n1. Go to **Sales** in the sidebar\n2. Find the sale in the list\n3. Click the **Download PDF** button (📄 icon)\n4. The invoice PDF will be downloaded with:\n   • Your business name\n   • Customer details\n   • Item list with quantities & prices\n   • Tax, discount, and total amount\n   • Invoice date\n\n💡 Make sure your business name is set in **Settings → General**.",
  },
  {
    patterns: ['sales list', 'view sales', 'all sales', 'sales history', 'past sales', 'sales record'],
    answer: "📋 **Viewing Your Sales**\n\nTo see all your sales:\n1. Click **Sales** in the sidebar\n2. You'll see a list of all sales with:\n   • Customer name\n   • Items sold\n   • Total amount\n   • Date\n   • Download PDF option\n\nSales are sorted by most recent first.",
  },
  {
    patterns: ['delete sale', 'remove sale', 'cancel sale'],
    answer: "🗑️ **Deleting a Sale**\n\n1. Go to **Sales** in the sidebar\n2. Find the sale you want to delete\n3. Click the **Delete** (🗑️) button\n4. Confirm the deletion\n\n⚠️ Deleting a sale is permanent and cannot be undone.",
  },
  {
    patterns: ['tax', 'gst', 'vat', 'tax rate', 'add tax'],
    answer: "💸 **Tax in Sales**\n\nWhen creating a sale:\n• Enter the **Tax Rate %** (e.g., 18 for 18% GST)\n• Tax is calculated on the item subtotal\n• The final total includes tax automatically\n\nFormula: **Total = (Price × Qty) + Tax − Discount**\n\nTax is shown separately on the downloaded PDF invoice.",
  },
  {
    patterns: ['discount', 'add discount', 'coupon', 'offer'],
    answer: "🏷️ **Adding a Discount to a Sale**\n\nWhen creating a sale:\n1. Enter the **Discount** amount in the discount field\n2. Discount is subtracted from the subtotal\n3. Tax is applied after discount\n\nFormula: **Total = (Price × Qty − Discount) + Tax**",
  },

  // ── PURCHASES ──────────────────────────────────────────────
  {
    patterns: ['how to add purchase', 'create purchase', 'record purchase', 'new purchase', 'add expense', 'purchase entry', 'how to purchase'],
    answer: "📦 **How to Record a Purchase**\n\n1. Click **Purchases** in the sidebar\n2. Click **'+ Add Purchase'**\n3. Fill in the details:\n   • Select **Supplier** (Party)\n   • Select **Item** from inventory\n   • Enter **Quantity**\n   • Enter **Unit Cost** (price per unit)\n4. The **Total Amount** is calculated automatically\n5. Optionally upload a **Purchase Document** (bill/receipt)\n6. Click **Save**\n\n✅ The purchase is recorded and stock is updated.",
  },
  {
    patterns: ['purchase document', 'upload bill', 'upload receipt', 'attach document', 'purchase file'],
    answer: "📎 **Uploading Purchase Documents**\n\nWhen adding a purchase, you can attach a document:\n1. In the Add Purchase form, find the **Upload Document** field\n2. Click to select a file (PDF, image, etc.)\n3. The document is stored securely in Supabase Storage\n4. You can view it later from the Purchases list\n\nThis is useful for keeping digital records of supplier bills and receipts.",
  },
  {
    patterns: ['view purchases', 'purchase list', 'all purchases', 'purchase history'],
    answer: "📋 **Viewing Your Purchases**\n\nTo see all purchases:\n1. Click **Purchases** in the sidebar\n2. You'll see a list with:\n   • Supplier name\n   • Item purchased\n   • Quantity & unit cost\n   • Total amount\n   • Date\n   • Attached document (if any)\n\nPurchases are sorted by most recent first.",
  },

  // ── ITEMS / INVENTORY ──────────────────────────────────────
  {
    patterns: ['how to add item', 'create item', 'new item', 'add product', 'add inventory', 'add stock'],
    answer: "📋 **How to Add an Item**\n\n1. Click **Item Management** in the sidebar\n2. Click **'+ Add Item'**\n3. Fill in the details:\n   • **Item Name** (required)\n   • **Category** (e.g., Electronics, Clothing)\n   • **Price** — selling price\n   • **Stock Level** — current quantity in stock\n   • **Min Stock Level** — alert threshold for low stock\n   • **Unit** (e.g., pcs, kg, litre)\n   • **Description** (optional)\n4. Click **Save**\n\n✅ The item is added to your inventory.",
  },
  {
    patterns: ['edit item', 'update item', 'change item', 'modify item', 'item edit'],
    answer: "✏️ **Editing an Item**\n\n1. Go to **Item Management**\n2. Find the item in the list\n3. Click the **Edit** (✏️) button\n4. Update the fields you want to change\n5. Click **Save**\n\nChanges are saved immediately to the database.",
  },
  {
    patterns: ['delete item', 'remove item', 'remove product'],
    answer: "🗑️ **Deleting an Item**\n\n1. Go to **Item Management**\n2. Find the item\n3. Click the **Delete** (🗑️) button\n4. Confirm the deletion\n\n⚠️ This is permanent. Make sure the item has no pending sales or purchases before deleting.",
  },
  {
    patterns: ['low stock', 'stock alert', 'minimum stock', 'out of stock', 'stock level', 'inventory alert'],
    answer: "⚠️ **Low Stock Alerts**\n\nbizBuddy automatically tracks stock levels:\n\n• When you add an item, set the **Min Stock Level**\n• When stock falls at or below this level, the item is flagged as low stock\n• You can see low stock items in **Item Management**\n\n**Stock is updated automatically when:**\n• You record a **Sale** (stock decreases)\n• You record a **Purchase** (stock increases)\n\nTip: Set a realistic minimum stock level so you get alerts before running out.",
  },
  {
    patterns: ['item category', 'product category', 'category', 'item type'],
    answer: "🏷️ **Item Categories**\n\nWhen adding or editing an item, you can assign a **Category** to organize your inventory.\n\nExamples: Electronics, Clothing, Food, Stationery, etc.\n\nCategories help you:\n• Filter items in Item Management\n• Organize your product catalog\n• Generate category-wise reports",
  },
  {
    patterns: ['csv import', 'import items', 'bulk import', 'upload csv', 'import data'],
    answer: "📥 **CSV Import**\n\nbizBuddy supports bulk importing items via CSV:\n\n1. Go to **Item Management**\n2. Click the **Import CSV** button\n3. Upload a CSV file with columns:\n   • name, category, price, stock_level, min_stock_level, unit, description\n4. Review and confirm the import\n\n✅ All items are added to your inventory at once.",
  },

  // ── PARTIES (CUSTOMERS & SUPPLIERS) ───────────────────────
  {
    patterns: ['how to add customer', 'add party', 'create customer', 'new customer', 'add supplier', 'create supplier', 'new party', 'add contact'],
    answer: "👥 **How to Add a Customer or Supplier**\n\n1. Click **Party Management** in the sidebar\n2. Click **'+ Add Party'**\n3. Fill in the details:\n   • **Name** (required)\n   • **Type** — Customer or Supplier\n   • **Email**\n   • **Phone**\n   • **Address, City, State, ZIP**\n   • **Credit Limit** — maximum credit allowed\n   • **Notes** (optional)\n4. Click **Save**\n\n✅ The party is added and available when creating sales/purchases.",
  },
  {
    patterns: ['edit party', 'update customer', 'update supplier', 'edit customer', 'modify party'],
    answer: "✏️ **Editing a Party**\n\n1. Go to **Party Management**\n2. Find the customer or supplier\n3. Click the **Edit** (✏️) button\n4. Update the fields\n5. Click **Save**\n\nAll changes are saved immediately.",
  },
  {
    patterns: ['delete party', 'remove customer', 'remove supplier', 'delete customer'],
    answer: "🗑️ **Deleting a Party**\n\n1. Go to **Party Management**\n2. Find the party\n3. Click the **Delete** (🗑️) button\n4. Confirm the deletion\n\n⚠️ This is permanent. Existing sales/purchases linked to this party will still be visible.",
  },
  {
    patterns: ['credit limit', 'party credit', 'customer credit'],
    answer: "💳 **Credit Limit**\n\nWhen adding or editing a party, you can set a **Credit Limit**:\n• This is the maximum amount of credit you extend to a customer\n• It's stored as a reference value\n• Useful for tracking how much credit each customer has used\n\nTo update: Go to **Party Management → Edit Party → Credit Limit field**.",
  },
  {
    patterns: ['customer list', 'supplier list', 'all parties', 'view parties', 'party list'],
    answer: "📋 **Viewing Parties**\n\nTo see all customers and suppliers:\n1. Click **Party Management** in the sidebar\n2. You'll see a list with:\n   • Name\n   • Type (Customer/Supplier)\n   • Phone & Email\n   • Credit Limit\n   • Edit & Delete options\n\nYou can search and filter the list.",
  },

  // ── REPORTS ────────────────────────────────────────────────
  {
    patterns: ['annual report', 'yearly report', 'financial report', 'view report', 'generate report', 'business report', 'how to see report'],
    answer: "📈 **Annual Reports**\n\nTo view your business reports:\n1. Click **Annual Reports** in the sidebar\n2. Select the **Year** you want to view\n3. You'll see:\n   • **Monthly Sales Chart** — bar chart of sales per month\n   • **Monthly Purchases Chart** — bar chart of purchases per month\n   • **Profit/Loss Summary** — net profit per month\n   • **Top Items** — best-selling products\n   • **Top Customers** — highest-value customers\n   • **Total Summary** — annual totals\n\n📄 You can also **Export to PDF** for sharing or printing.",
  },
  {
    patterns: ['export report', 'download report', 'pdf report', 'print report'],
    answer: "📄 **Exporting Reports**\n\nTo export your annual report:\n1. Go to **Annual Reports**\n2. Select the year\n3. Click the **Export PDF** button\n4. The report PDF is downloaded with all charts and summaries\n\nYou can also export individual invoices from the **Sales** section.",
  },
  {
    patterns: ['monthly report', 'monthly sales', 'monthly data', 'month wise'],
    answer: "📅 **Monthly Data in Reports**\n\nIn **Annual Reports**, you can see month-by-month breakdown:\n• Each month's total sales\n• Each month's total purchases\n• Net profit per month\n\nThis helps you identify your best and worst performing months.",
  },

  // ── SETTINGS ───────────────────────────────────────────────
  {
    patterns: ['settings', 'preferences', 'configuration', 'app settings', 'how to change settings'],
    answer: "⚙️ **Settings**\n\nAccess Settings from the Dashboard header or sidebar.\n\nAvailable sections:\n\n**General:**\n• Business Name\n• Currency (INR ₹, USD $, EUR €, GBP £)\n• Language\n• Date Format\n\n**Data & Privacy:**\n• Export Data — download all your data as JSON\n• Import Data — restore from a backup\n• Clear Cache — clear local storage\n• Delete All Data — permanently remove all data\n\n**About:**\n• App version and information",
  },
  {
    patterns: ['change currency', 'currency setting', 'inr', 'usd', 'rupee', 'dollar', 'currency format'],
    answer: "💱 **Changing Currency**\n\n1. Go to **Settings** (from Dashboard header)\n2. Under **General** section\n3. Find the **Currency** dropdown\n4. Select your currency:\n   • ₹ INR — Indian Rupee\n   • $ USD — US Dollar\n   • € EUR — Euro\n   • £ GBP — British Pound\n5. Click **Save Settings**\n\n✅ All amounts across the app will display in the selected currency.",
  },
  {
    patterns: ['change language', 'language setting', 'hindi', 'english', 'gujarati'],
    answer: "🌐 **Changing Language**\n\n1. Go to **Settings**\n2. Under **General** section\n3. Find the **Language** dropdown\n4. Select your preferred language\n5. Click **Save Settings**\n\nThe app interface will update to the selected language.",
  },
  {
    patterns: ['business name', 'company name', 'change name', 'set business name'],
    answer: "🏢 **Setting Your Business Name**\n\n1. Go to **Settings**\n2. Under **General** section\n3. Find the **Business Name** field\n4. Enter your business name\n5. Click **Save Settings**\n\nYour business name appears on:\n• Dashboard header\n• Downloaded PDF invoices\n• Annual reports",
  },
  {
    patterns: ['export data', 'backup data', 'download data', 'data export'],
    answer: "💾 **Exporting Your Data**\n\n1. Go to **Settings**\n2. Under **Data & Privacy** section\n3. Click **Export Data**\n4. A JSON file with all your business data is downloaded\n\nThis includes: sales, purchases, items, parties, and settings.\n\nUse this as a backup or to migrate data.",
  },
  {
    patterns: ['import data', 'restore data', 'upload data', 'data import'],
    answer: "📥 **Importing Data**\n\n1. Go to **Settings**\n2. Under **Data & Privacy** section\n3. Click **Import Data**\n4. Select a previously exported JSON file\n5. Confirm the import\n\n⚠️ Importing will overwrite existing data. Make sure to export first as a backup.",
  },
  {
    patterns: ['delete data', 'clear data', 'delete all', 'reset app', 'wipe data'],
    answer: "⚠️ **Deleting All Data**\n\n1. Go to **Settings**\n2. Under **Data & Privacy** section\n3. Click **Delete All Data**\n4. You'll be asked to confirm **twice** (this is irreversible)\n\n🚨 This permanently deletes ALL your sales, purchases, items, and parties from the database. This cannot be undone.\n\nTip: Export your data first before deleting.",
  },
  {
    patterns: ['clear cache', 'clear storage', 'reset cache'],
    answer: "🧹 **Clearing Cache**\n\n1. Go to **Settings**\n2. Under **Data & Privacy** section\n3. Click **Clear Cache**\n\nThis clears local browser storage (except your login session). It can help fix display issues or stale data.",
  },

  // ── ACCOUNT / LOGIN ────────────────────────────────────────
  {
    patterns: ['how to login', 'sign in', 'log in', 'login page', 'access account'],
    answer: "🔐 **How to Login**\n\n1. Go to the bizBuddy login page\n2. Enter your **Email** and **Password**\n3. Click **Sign In**\n\nAlternatively, you can sign in with:\n• **Google** — click 'Continue with Google'\n\nIf you don't have an account, click **Register** to create one.",
  },
  {
    patterns: ['register', 'sign up', 'create account', 'new account', 'how to register'],
    answer: "📝 **How to Register**\n\n1. Go to the bizBuddy login page\n2. Click **Register** or **Sign Up**\n3. Fill in:\n   • Full Name\n   • Email address\n   • Password (min 8 chars, must include uppercase, lowercase, number, special character)\n4. Click **Create Account**\n\n✅ You'll be logged in automatically after registration.",
  },
  {
    patterns: ['forgot password', 'reset password', 'change password', 'password reset'],
    answer: "🔑 **Password Reset**\n\nIf you forgot your password:\n1. Go to the Login page\n2. Click **Forgot Password**\n3. Enter your email address\n4. Check your email for a reset link\n5. Click the link and set a new password\n\n**Password requirements:**\n• Minimum 8 characters\n• At least 1 uppercase letter\n• At least 1 lowercase letter\n• At least 1 number\n• At least 1 special character (!@#$%...)",
  },
  {
    patterns: ['logout', 'log out', 'sign out', 'how to logout'],
    answer: "🚪 **How to Logout**\n\n1. Go to the **Dashboard**\n2. Click the **Settings** button in the top right\n3. Or look for the **Logout** option in the menu\n\nYour session will be cleared and you'll be redirected to the login page.",
  },
  {
    patterns: ['google login', 'google sign in', 'oauth', 'social login'],
    answer: "🔵 **Google Sign-In**\n\nbizBuddy supports signing in with Google:\n1. On the Login page, click **Continue with Google**\n2. Select your Google account\n3. Grant permissions\n4. You'll be logged in automatically\n\nNo password needed when using Google sign-in.",
  },

  // ── NAVIGATION ─────────────────────────────────────────────
  {
    patterns: ['how to navigate', 'sidebar', 'menu', 'navigation', 'how to go to', 'where is'],
    answer: "🧭 **Navigation in bizBuddy**\n\nUse the **sidebar** (left panel) to navigate:\n\n• 🏠 **Dashboard** — Home/Overview\n• 👥 **Party Management** — Customers & Suppliers\n• 📋 **Item Management** — Inventory\n• 🛒 **Sales** — Sales & Invoices\n• 📦 **Purchases** — Expenses & Purchases\n• 📈 **Annual Reports** — Financial Reports\n• ⚙️ **Settings** — App Preferences\n\nOn mobile, tap the menu icon to open the sidebar.",
  },

  // ── PWA / INSTALL ──────────────────────────────────────────
  {
    patterns: ['install app', 'pwa', 'add to home screen', 'mobile app', 'install bizbuddy'],
    answer: "📱 **Installing bizBuddy on Your Device**\n\nbizBuddy is a Progressive Web App (PWA) — you can install it like a native app!\n\n**On Android (Chrome):**\n1. Open bizBuddy in Chrome\n2. Tap the menu (⋮)\n3. Tap 'Add to Home Screen'\n4. Tap 'Install'\n\n**On iPhone (Safari):**\n1. Open bizBuddy in Safari\n2. Tap the Share button (□↑)\n3. Tap 'Add to Home Screen'\n4. Tap 'Add'\n\n**On Desktop (Chrome):**\n1. Look for the install icon (⊕) in the address bar\n2. Click 'Install'\n\n✅ bizBuddy will work offline after installation!",
  },

  // ── GENERAL APP INFO ───────────────────────────────────────
  {
    patterns: ['what is bizbuddy', 'about bizbuddy', 'about app', 'what does this app do', 'app features'],
    answer: "🏢 **About bizBuddy**\n\nbizBuddy is a complete **Business Management Application** designed for small and medium businesses.\n\n**Key Features:**\n• 🛒 Sales & Invoice Management\n• 📦 Purchase & Expense Tracking\n• 📋 Inventory Management\n• 👥 Customer & Supplier Management\n• 📈 Annual Financial Reports\n• 📊 Dashboard with live business metrics\n• 📱 Works on mobile & desktop (PWA)\n• 🔐 Secure login with email or Google\n• 💾 Cloud data storage (Supabase)\n\nbizBuddy helps you track your business finances, manage inventory, and generate professional invoices — all in one place.",
  },
  {
    patterns: ['data storage', 'where is data stored', 'cloud', 'database', 'supabase', 'data security'],
    answer: "🔒 **Data Storage & Security**\n\nbizBuddy stores all your data securely in the cloud using **Supabase** (PostgreSQL database).\n\n• Your data is **private** — only you can access it\n• Data is stored with **Row Level Security (RLS)**\n• All connections use **HTTPS encryption**\n• Your password is **never stored in plain text**\n• You can **export your data** anytime from Settings\n\nYour business data is safe and accessible from any device.",
  },
  {
    patterns: ['offline', 'no internet', 'works offline', 'internet required'],
    answer: "📶 **Offline Usage**\n\nbizBuddy is a PWA and has limited offline support:\n\n• If installed on your device, the app shell loads offline\n• However, **creating/viewing data requires internet** (data is stored in the cloud)\n• Once you're back online, everything syncs automatically\n\nFor best experience, use bizBuddy with an active internet connection.",
  },
];

// ── Fuzzy Matcher ──────────────────────────────────────────────────────────

/**
 * Find the best matching answer from the knowledge base.
 * Two-tier matching system with priority for detailed answers:
 * 1. First checks CHATBOT_DATA for simple conversational patterns (exact/close matches only)
 * 2. Then checks KNOWLEDGE_BASE for detailed bizBuddy feature questions
 * Returns the answer string or fallback message.
 */
export function findAnswer(userInput) {
  const input = userInput.toLowerCase().trim();

  // ── TIER 1: Check CHATBOT_DATA for simple conversational patterns (FIRST) ──
  // This tier uses exact matching to avoid false positives
  for (const entry of CHATBOT_DATA) {
    if (entry.tag === 'unknown') continue;

    for (const pattern of entry.patterns) {
      const patternLower = pattern.toLowerCase();
      
      // Exact match or very close match
      if (input === patternLower || 
          input === patternLower + 'i' || 
          input === patternLower + 'ii' ||
          input + 'i' === patternLower ||
          input + 'ii' === patternLower) {
        const responses = entry.responses;
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
  }

  // ── TIER 2: Check KNOWLEDGE_BASE for detailed answers ──
  let bestScore = 0;
  let bestAnswer = null;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;

    for (const pattern of entry.patterns) {
      if (input === pattern) {
        score += 10; // exact match
      } else if (input.includes(pattern) && pattern.length > 4) {
        score += 5; // input contains pattern
      } else if (pattern.includes(input) && input.length > 4) {
        score += 3; // pattern contains input
      } else {
        // word-level partial match
        const patternWords = pattern.split(' ');
        const inputWords = input.split(' ');
        let wordMatches = 0;
        for (const pw of patternWords) {
          for (const iw of inputWords) {
            if (pw === iw && pw.length > 3) {
              wordMatches++;
              score += 2;
            } else if (pw.includes(iw) && iw.length > 4) {
              score += 1;
            } else if (iw.includes(pw) && pw.length > 4) {
              score += 1;
            }
          }
        }
        // Require at least 2 word matches for multi-word patterns
        if (patternWords.length > 2 && wordMatches < 2) {
          score = Math.max(0, score - 3);
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestAnswer = entry.answer;
    }
  }

  // Return detailed answer if found with good score
  if (bestScore >= 4 && bestAnswer) {
    return bestAnswer;
  }

  // ── FALLBACK: Return unknown response ──
  const unknownEntry = CHATBOT_DATA.find(entry => entry.tag === 'unknown');
  if (unknownEntry) {
    const responses = unknownEntry.responses;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  return "Sorry, I didn't understand that. Can you please rephrase?";
}
