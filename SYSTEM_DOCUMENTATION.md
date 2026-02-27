# BizBuddy - Complete System Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Actors and Roles](#actors-and-roles)
3. [User Permissions](#user-permissions)
4. [Features and Functionalities](#features-and-functionalities)
5. [Database Schema](#database-schema)
6. [Page Routes](#page-routes)
7. [API Endpoints](#api-endpoints)
8. [User Workflows](#user-workflows)
9. [Technical Stack](#technical-stack)

---

## System Overview

**Application Name:** BizBuddy  
**Type:** Business Management System  
**Purpose:** Manage sales, purchases, inventory, customers, and suppliers  
**Architecture:** Single Page Application (SPA) with React frontend and Supabase backend  
**Deployment:** GitHub Pages (Frontend), Supabase Cloud (Backend)  
**URL:** https://mayankpatelxv.github.io/my-react-app/

---

## Actors and Roles

### 1. Guest (Unauthenticated User)
**Description:** Visitor who has not logged in or registered

**Can Access:**
- Landing Page (/)
- Login Page (/login)
- Register Page (/register)

**Cannot Access:**
- Any protected pages
- Dashboard
- Business data

**Actions:**
- View landing page
- Create new account (register)
- Login to existing account

---

### 2. User (Authenticated Business Owner)
**Description:** Registered and logged-in user who owns and manages their business data

**Role Type:** Single role - Business Owner/Manager  
**Note:** Currently, there is NO admin role. Each user is independent and can only access their own data.

**Can Access:**
- All protected pages
- Dashboard
- Sales management
- Purchase management
- Item management
- Party management
- Annual reports
- Settings
- AI Assistant

**Cannot Access:**
- Other users' data (enforced by Row Level Security)
- System administration features (none exist)

**Actions:**
- Manage own business data
- Create/edit/delete items
- Create/edit/delete parties (customers/suppliers)
- Create sales invoices
- Record purchases
- Upload purchase documents
- View analytics and reports
- Change application settings
- Use AI chatbot
- Logout

---

### 3. System (Backend Services)
**Description:** Automated backend services

**Components:**
- Supabase Database (PostgreSQL)
- Supabase Storage
- Supabase Authentication
- Google Gemini AI API

**Responsibilities:**
- Store and retrieve data
- Enforce data isolation (Row Level Security)
- Generate auto-increment IDs
- Generate invoice/bill numbers
- Store uploaded files
- Provide AI responses

---

## User Permissions

### Data Isolation Model
**Type:** Multi-tenant with complete data isolation  
**Implementation:** Row Level Security (RLS) in PostgreSQL  
**Key:** user_id column in all tables

### Permission Matrix

| Feature | Guest | Authenticated User | Can Access Other Users' Data |
|---------|-------|-------------------|------------------------------|
| View Landing Page | ✅ | ✅ | N/A |
| Register Account | ✅ | ❌ | N/A |
| Login | ✅ | ✅ | N/A |
| View Dashboard | ❌ | ✅ | ❌ |
| Manage Items | ❌ | ✅ | ❌ |
| Manage Parties | ❌ | ✅ | ❌ |
| Create Sales | ❌ | ✅ | ❌ |
| Create Purchases | ❌ | ✅ | ❌ |
| View Reports | ❌ | ✅ | ❌ |
| Upload Documents | ❌ | ✅ | ❌ |
| Use AI Assistant | ❌ | ✅ | ❌ |
| Change Settings | ❌ | ✅ | N/A |
| Logout | ❌ | ✅ | N/A |

### Database-Level Permissions

**All Tables:**
- SELECT: Only rows where user_id = current_user_id
- INSERT: Automatically sets user_id = current_user_id
- UPDATE: Only rows where user_id = current_user_id
- DELETE: Only rows where user_id = current_user_id

**Storage Buckets:**
- Upload: Only to own folder (user_id/)
- Download: Only from own folder
- Delete: Only from own folder

---

## Features and Functionalities

### 1. Authentication System

#### Registration
- **Fields:** Name, Email, Password, First Name, Last Name
- **Validation:** Email format, password strength
- **Process:** Hash password → Store in database → Redirect to login
- **Table:** users_data

#### Login
- **Fields:** Email, Password
- **Process:** Hash password → Compare with database → Create session → Store in localStorage
- **Session Storage:** localStorage (key: bizBuddy_user)
- **Session Data:** {id, name, email, first_name, last_name, created_at}

#### Logout
- **Process:** Clear user state → Remove from localStorage → Redirect to landing page

---

### 2. Dashboard

**Purpose:** Central hub showing business overview

**Statistics Displayed:**
- Total Sales Amount (sum of all sales)
- Total Purchases Amount (sum of all purchases)
- Total Items Count
- Total Parties Count
- Net Profit (Sales - Purchases)
- Profit Margin Percentage

**Quick Actions:**
- Navigate to Sales
- Navigate to Purchases
- Navigate to Party Management
- Navigate to Item Management
- Navigate to Annual Reports
- Open AI Assistant

**Business Insights:**
- Growth trend analysis
- Next steps recommendations
- Financial health summary

**Data Sources:**
- Fetches from: items, parties, sales, purchases tables
- Aggregation: Client-side calculation
- Refresh: On page load

---

### 3. Party Management

**Purpose:** Manage customers and suppliers

**Party Types:**
- Customer (can be selected in sales)
- Supplier (can be selected in purchases)
- Both (can be used in both sales and purchases)

**Fields:**
- Name (required)
- Email
- Phone
- Address
- City
- State
- Zip Code
- Country
- Party Type (required)
- Tax ID
- Credit Limit
- Payment Terms
- Notes

**Operations:**
- Create new party
- View all parties
- Edit party details
- Delete party
- Search by name/email/phone
- Filter by party type

**Table:** parties

---

### 4. Item Management

**Purpose:** Manage inventory items

**Fields:**
- Name (required)
- Category (required)
- Unit (pcs, kg, ltr, etc.)
- Price (required)
- Stock Level (required)
- Minimum Stock Level
- Description
- SKU (unique)
- Barcode
- Supplier
- Location
- Weight
- Dimensions
- Notes

**Operations:**
- Create new item
- View all items
- Edit item details
- Delete item
- Search by name/SKU/barcode
- Filter by category
- Track stock levels
- Low stock alerts

**Table:** items

---

### 5. Sales Management

**Purpose:** Create and manage sales invoices

**Process:**
1. Select customer from dropdown
2. Add items to invoice
3. Set quantities and prices
4. Apply tax rate (%)
5. Apply discount amount
6. Review calculated totals
7. Save invoice

**Invoice Fields:**
- Customer (required)
- Invoice Number (auto-generated: INV-YYYYMMDD-XXXX)
- Invoice Date (default: today)
- Due Date
- Items (array of line items)
- Subtotal (calculated)
- Tax Rate (%)
- Tax Amount (calculated)
- Discount Amount
- Total Amount (calculated)
- Status (draft, sent, paid, cancelled)
- Payment Terms
- Notes

**Calculations:**
- Subtotal = Sum of (quantity × price) for all items
- Tax Amount = (Subtotal - Discount) × Tax Rate / 100
- Total Amount = Subtotal - Discount + Tax Amount

**Actions:**
- Save invoice to database
- Print invoice (PDF)
- Download invoice (PDF)

**Tables:** sales, sales_items

---

### 6. Purchase Management

**Purpose:** Record and track purchases from suppliers

**Process:**
1. Select supplier from dropdown
2. Set purchase date
3. Enter bill number (optional, auto-generated if empty)
4. Attach document (PDF/image, optional)
5. Add items with quantities and costs
6. Review calculated total
7. Save purchase

**Purchase Fields:**
- Supplier (required)
- Bill Number (auto-generated: BILL-YYYYMMDD-XXXX)
- Purchase Date (default: today)
- Due Date
- Items (array of line items)
- Subtotal (calculated)
- Tax Rate (%)
- Tax Amount (calculated)
- Discount Amount
- Total Amount (calculated)
- Status (pending, received, paid, cancelled)
- Payment Terms
- Notes
- Attached Document (file path)

**Document Upload:**
- Allowed types: PDF, JPEG, PNG, GIF, WebP
- Max size: 10MB
- Storage: Supabase Storage bucket (purchase-documents)
- Path structure: {user_id}/{purchase_id}_{timestamp}.{ext}

**Actions:**
- Save purchase to database
- Upload document to storage
- View purchase history
- Download attached documents

**Tables:** purchases, purchase_items  
**Storage:** purchase-documents bucket

---

### 7. Annual Reports

**Purpose:** View business analytics and reports

**Features:**
- Year selection (2024, 2025, 2026)
- Sales analytics
- Purchase analytics
- Profit/loss calculations
- Charts and graphs
- Metric cards

**Metrics Displayed:**
- Total Sales
- Total Purchases
- Net Profit
- Profit Margin
- Number of Transactions
- Average Transaction Value

**Data Sources:**
- sales table
- purchases table
- Filtered by selected year

---

### 8. Settings

**Purpose:** Configure application preferences

**Settings Available:**
- Language (English, Hindi)
- Currency (USD, INR, EUR)
- Date Format
- Profile Information

**Storage:** localStorage (key: bizBuddy_settings)

**Context:** SettingsContext provides settings to all components

**Actions:**
- Change language
- Change currency
- Change date format
- Update profile
- Logout

---

### 9. AI Assistant (Chatbot)

**Purpose:** Provide business insights and answer questions

**Features:**
- Chat interface
- Message history
- Context-aware responses
- Business data integration

**Integration:** Google Gemini AI API

**Usage:**
- Ask business questions
- Get insights
- Receive recommendations

**Access:** Available from Dashboard

---

## Database Schema

### Tables

#### 1. users_data
**Purpose:** Store user accounts

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY | Auto-increment user ID |
| name | varchar | NOT NULL | Full name |
| email | varchar | UNIQUE, NOT NULL | Login email |
| auth_token | varchar | NOT NULL | Hashed password (base64) |
| first_name | varchar | | First name |
| last_name | varchar | | Last name |
| password_hashed | boolean | DEFAULT false | Password hash flag |
| created_at | timestamp | DEFAULT now() | Account creation time |
| updated_at | timestamp | DEFAULT now() | Last update time |

---

#### 2. parties
**Purpose:** Store customers and suppliers

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY | Auto-increment party ID |
| user_id | bigint | FOREIGN KEY → users_data(id) | Owner user ID |
| name | varchar | NOT NULL | Party name |
| email | varchar | | Contact email |
| phone | varchar | | Contact phone |
| address | text | | Street address |
| city | varchar | | City |
| state | varchar | | State/province |
| zip_code | varchar | | Postal code |
| country | varchar | | Country |
| party_type | varchar | NOT NULL | 'Customer', 'Supplier', 'Both' |
| tax_id | varchar | | Tax identification |
| credit_limit | decimal | | Credit limit amount |
| payment_terms | varchar | | Payment terms |
| notes | text | | Additional notes |
| created_at | timestamp | DEFAULT now() | Creation time |
| updated_at | timestamp | DEFAULT now() | Last update time |

**Indexes:** user_id, party_type

---

#### 3. items
**Purpose:** Store inventory items

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY | Auto-increment item ID |
| user_id | bigint | FOREIGN KEY → users_data(id) | Owner user ID |
| name | varchar | NOT NULL | Item name |
| category | varchar | NOT NULL | Item category |
| unit | varchar | NOT NULL | Unit of measurement |
| price | decimal | NOT NULL | Selling price |
| stock_level | integer | NOT NULL | Current stock |
| min_stock_level | integer | | Minimum stock alert |
| description | text | | Item description |
| sku | varchar | UNIQUE | Stock keeping unit |
| barcode | varchar | | Barcode number |
| supplier | varchar | | Default supplier |
| location | varchar | | Storage location |
| weight | decimal | | Item weight |
| dimensions | varchar | | Item dimensions |
| notes | text | | Additional notes |
| created_at | timestamp | DEFAULT now() | Creation time |
| updated_at | timestamp | DEFAULT now() | Last update time |

**Indexes:** user_id, category, sku

---

#### 4. sales
**Purpose:** Store sales invoice headers

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY | Auto-increment sale ID |
| user_id | bigint | FOREIGN KEY → users_data(id) | Owner user ID |
| invoice_number | varchar | UNIQUE, NOT NULL | Auto-generated invoice # |
| customer_name | varchar | NOT NULL | Customer name |
| customer_id | bigint | FOREIGN KEY → parties(id) | Customer reference |
| invoice_date | date | NOT NULL | Invoice date |
| due_date | date | | Payment due date |
| subtotal | decimal | NOT NULL | Sum of line items |
| tax_rate | decimal | NOT NULL | Tax percentage |
| tax_amount | decimal | NOT NULL | Calculated tax |
| discount_amount | decimal | NOT NULL | Discount applied |
| total_amount | decimal | NOT NULL | Final amount |
| status | varchar | NOT NULL | 'draft', 'sent', 'paid', 'cancelled' |
| payment_terms | varchar | | Payment terms |
| notes | text | | Additional notes |
| created_at | timestamp | DEFAULT now() | Creation time |
| updated_at | timestamp | DEFAULT now() | Last update time |

**Indexes:** user_id, invoice_number, status, invoice_date

---

#### 5. sales_items
**Purpose:** Store sales invoice line items

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY | Auto-increment line ID |
| sale_id | bigint | FOREIGN KEY → sales(id) CASCADE | Parent sale |
| item_id | bigint | FOREIGN KEY → items(id) | Item reference |
| item_name | varchar | NOT NULL | Item name (denormalized) |
| item_description | text | | Item description |
| quantity | integer | NOT NULL | Quantity sold |
| unit_price | decimal | NOT NULL | Price per unit |
| line_total | decimal | NOT NULL | quantity × unit_price |
| created_at | timestamp | DEFAULT now() | Creation time |

**Indexes:** sale_id, item_id

---

#### 6. purchases
**Purpose:** Store purchase transaction headers

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY | Auto-increment purchase ID |
| user_id | bigint | FOREIGN KEY → users_data(id) | Owner user ID |
| bill_number | varchar | UNIQUE, NOT NULL | Auto-generated bill # |
| supplier_name | varchar | NOT NULL | Supplier name |
| supplier_id | bigint | FOREIGN KEY → parties(id) | Supplier reference |
| purchase_date | date | NOT NULL | Purchase date |
| due_date | date | | Payment due date |
| subtotal | decimal | NOT NULL | Sum of line items |
| tax_rate | decimal | NOT NULL | Tax percentage |
| tax_amount | decimal | NOT NULL | Calculated tax |
| discount_amount | decimal | NOT NULL | Discount received |
| total_amount | decimal | NOT NULL | Final amount |
| status | varchar | NOT NULL | 'pending', 'received', 'paid', 'cancelled' |
| payment_terms | varchar | | Payment terms |
| notes | text | | Additional notes |
| attached_document | text | | File path in storage |
| created_at | timestamp | DEFAULT now() | Creation time |
| updated_at | timestamp | DEFAULT now() | Last update time |

**Indexes:** user_id, bill_number, status, purchase_date

---

#### 7. purchase_items
**Purpose:** Store purchase line items

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY | Auto-increment line ID |
| purchase_id | bigint | FOREIGN KEY → purchases(id) CASCADE | Parent purchase |
| item_id | bigint | FOREIGN KEY → items(id) | Item reference |
| item_name | varchar | NOT NULL | Item name (denormalized) |
| item_description | text | | Item description |
| quantity | integer | NOT NULL | Quantity purchased |
| unit_cost | decimal | NOT NULL | Cost per unit |
| line_total | decimal | NOT NULL | quantity × unit_cost |
| created_at | timestamp | DEFAULT now() | Creation time |

**Indexes:** purchase_id, item_id

---

### Storage Buckets

#### purchase-documents
**Purpose:** Store uploaded purchase documents

**Structure:**
```
purchase-documents/
  └── {user_id}/
      ├── {purchase_id}_{timestamp}.pdf
      ├── {purchase_id}_{timestamp}.jpg
      └── ...
```

**Policies:**
- Users can only upload to their own folder
- Users can only read their own documents
- Max file size: 10MB
- Allowed types: PDF, JPEG, PNG, GIF, WebP

---

## Page Routes

### Public Routes (No Authentication Required)

| Route | Component | Description |
|-------|-----------|-------------|
| / | LandingPage | Marketing landing page |
| /login | LoginPage | User login form |
| /register | RegisterPage | User registration form |

### Protected Routes (Authentication Required)

| Route | Component | Description |
|-------|-----------|-------------|
| /dashboard | Dashboard | Main dashboard with statistics |
| /sales | Sales | Create sales invoices |
| /purchases | Purchases | Record purchases |
| /item-management | ItemManagement | Manage inventory items |
| /party-management | PartyManagement | Manage customers/suppliers |
| /annual-reports | AnnualReports | View analytics and reports |
| /settings | Settings | Application settings |
| /add-item | AddItem | Add new item form |
| /add-party | AddParty | Add new party form |
| /create-invoice | CreateInvoice | Create invoice form |
| /dashboard-analytics | DashboardAnalytics | Detailed analytics |

**Route Protection:** ProtectedRoute component checks authentication and redirects to /login if not authenticated

---

## API Endpoints

### Supabase REST API

**Base URL:** `https://[project-ref].supabase.co/rest/v1/`

**Authentication:** API Key in headers

#### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /users_data | Create new user (register) |
| GET | /users_data?email=eq.{email}&auth_token=eq.{hash} | Login user |

#### Parties

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /parties | Create new party |
| GET | /parties?user_id=eq.{id} | Get all parties for user |
| PATCH | /parties?id=eq.{id}&user_id=eq.{uid} | Update party |
| DELETE | /parties?id=eq.{id}&user_id=eq.{uid} | Delete party |

#### Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /items | Create new item |
| GET | /items?user_id=eq.{id} | Get all items for user |
| PATCH | /items?id=eq.{id}&user_id=eq.{uid} | Update item |
| DELETE | /items?id=eq.{id}&user_id=eq.{uid} | Delete item |

#### Sales

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /sales | Create new sale |
| POST | /sales_items | Create sale line items |
| GET | /sales?user_id=eq.{id}&select=*,sales_items(*) | Get all sales with items |
| PATCH | /sales?id=eq.{id}&user_id=eq.{uid} | Update sale |
| DELETE | /sales?id=eq.{id}&user_id=eq.{uid} | Delete sale |

#### Purchases

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /purchases | Create new purchase |
| POST | /purchase_items | Create purchase line items |
| GET | /purchases?user_id=eq.{id}&select=*,purchase_items(*) | Get all purchases with items |
| PATCH | /purchases?id=eq.{id}&user_id=eq.{uid} | Update purchase |
| DELETE | /purchases?id=eq.{id}&user_id=eq.{uid} | Delete purchase |

#### Storage

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /storage/v1/object/purchase-documents/{path} | Upload file |
| GET | /storage/v1/object/purchase-documents/{path} | Download file |
| POST | /storage/v1/object/sign/purchase-documents/{path} | Get signed URL |
| DELETE | /storage/v1/object/purchase-documents/{path} | Delete file |

### External APIs

#### Google Gemini AI

**Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`

**Method:** POST

**Authentication:** API Key in URL parameter

**Purpose:** AI chatbot responses

---

## User Workflows

### 1. New User Registration Flow
1. User visits landing page (/)
2. Clicks "Get Started"
3. Redirected to /login
4. Clicks "Switch to Register"
5. Fills registration form (name, email, password)
6. Submits form
7. System creates account in users_data table
8. Redirected to /login
9. User logs in with new credentials

### 2. Login Flow
1. User enters email and password
2. System hashes password
3. Queries users_data table
4. If match found, creates session
5. Stores user data in localStorage
6. Redirects to /dashboard

### 3. Create Sales Invoice Flow
1. Navigate to /sales
2. System loads items and customers
3. Select customer from dropdown
4. Click "Add Item"
5. Select item from dropdown
6. Set quantity and price
7. Repeat for multiple items
8. Set tax rate and discount
9. Review calculated totals
10. Click "Save Invoice"
11. System creates sale record
12. System creates sales_items records
13. Success message displayed
14. Form resets

### 4. Record Purchase Flow
1. Navigate to /purchases
2. System loads items and suppliers
3. Select supplier from dropdown
4. Set purchase date
5. Enter bill number (optional)
6. Click "Choose File" to attach document
7. Select PDF or image file
8. Click "Add Item"
9. Select item and set quantity/cost
10. Repeat for multiple items
11. Review calculated total
12. Click "Save Purchase"
13. System uploads document to storage
14. System creates purchase record
15. System creates purchase_items records
16. Success message displayed
17. Form resets

### 5. Manage Items Flow
1. Navigate to /item-management
2. System loads all items
3. View items in table
4. Search or filter items
5. Click "Add Item" to create new
6. Click "Edit" to modify existing
7. Click "Delete" to remove item
8. Changes saved to items table

### 6. View Reports Flow
1. Navigate to /annual-reports
2. Select year from dropdown
3. System fetches sales and purchases for year
4. Calculates metrics
5. Displays statistics cards
6. Shows charts and graphs
7. User can export report

---

## Technical Stack

### Frontend
- **Framework:** React 18
- **Language:** JavaScript (JSX)
- **Routing:** React Router v6
- **State Management:** React Context API + useState/useEffect
- **Styling:** CSS3 (separate files per component)
- **PDF Generation:** jsPDF
- **Build Tool:** Create React App
- **Package Manager:** npm

### Backend
- **Database:** PostgreSQL (Supabase)
- **Storage:** Supabase Storage
- **API:** Supabase REST API (PostgREST)
- **Authentication:** Custom (using database)
- **Security:** Row Level Security (RLS)

### External Services
- **AI:** Google Gemini AI API
- **Hosting:** GitHub Pages
- **Version Control:** Git + GitHub

### Development Tools
- **IDE:** VS Code / Kiro
- **OS:** Windows
- **Shell:** CMD
- **Node.js:** Required for development

### Deployment
- **Frontend:** GitHub Pages (static hosting)
- **Backend:** Supabase Cloud
- **CI/CD:** Manual deployment via npm scripts
- **Build Command:** `npm run build`
- **Deploy Command:** `npm run deploy`

---

## Security Features

### Authentication
- Password hashing (base64 - should be upgraded to bcrypt)
- Session management via localStorage
- Protected routes with authentication check

### Data Isolation
- Row Level Security (RLS) in database
- All queries filtered by user_id
- Users cannot access other users' data

### File Upload Security
- File type validation (PDF, images only)
- File size limit (10MB)
- User-specific folders in storage
- Signed URLs for secure access

### API Security
- API keys stored in environment variables
- HTTPS only
- CORS enabled for specific domains
- SQL injection prevention (parameterized queries)

---

## Current Limitations

### No Admin Role
- Each user is independent
- No user management features
- No system-wide administration
- No user-to-user data sharing

### Single Tenant per User
- Each user has isolated data
- No multi-user collaboration
- No team features
- No role-based access control within user account

### Authentication
- Basic password hashing (base64)
- No password reset functionality
- No email verification
- No two-factor authentication
- No OAuth integration

### Features Not Implemented
- Email notifications
- Payment gateway integration
- Inventory auto-update on sales/purchases
- Barcode scanning
- Multi-currency transactions
- Tax calculation by region
- Recurring invoices
- Customer portal
- Mobile app

---

## Future Enhancement Possibilities

### User Management
- Add admin role
- User permissions system
- Team collaboration features
- Role-based access control

### Authentication
- Upgrade to bcrypt password hashing
- Add password reset via email
- Implement email verification
- Add OAuth (Google, Facebook)
- Two-factor authentication

### Business Features
- Automatic inventory updates
- Low stock notifications
- Payment tracking
- Invoice reminders
- Recurring invoices
- Multi-currency support
- Tax automation
- Customer portal

### Technical Improvements
- Real-time updates (WebSocket)
- Offline mode (PWA)
- Mobile app (React Native)
- Advanced analytics
- Data export (Excel, CSV)
- Backup and restore
- API rate limiting
- Caching layer

---

**Document Version:** 1.0  
**Last Updated:** February 25, 2026  
**Author:** Development Team
