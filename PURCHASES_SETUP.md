# Purchases Database Setup Instructions

## Step 1: Create Purchase Tables in Supabase

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-purchases-table.sql`
4. Run the SQL script to create the purchases and purchase_items tables

## Step 2: Verify Tables Created

After running the SQL script, you should see these new tables in your database:

- `purchases` - Main purchase/bill records
- `purchase_items` - Individual line items for each purchase

## Step 3: Test the Purchases Feature

1. Make sure you have:
   - At least one supplier in your parties table (with party_type = 'Supplier' or 'Both')
   - At least one item in your items table

2. Navigate to the Purchases page in your app
3. Select a supplier
4. Add items to the purchase
5. Save the purchase

## Features Included

### Purchase Management
- ✅ Create new purchase entries with multiple line items
- ✅ Select suppliers from your parties database
- ✅ Select items from your items database
- ✅ Automatic bill number generation (BILL-000001, BILL-000002, etc.)
- ✅ Real-time calculation of totals
- ✅ File attachment support (document names stored)
- ✅ Save purchases to database

### Database Features
- ✅ Row Level Security disabled (matches your existing pattern)
- ✅ Automatic timestamps (created_at, updated_at)
- ✅ Foreign key relationships to parties and items (soft references)
- ✅ Proper indexing for performance
- ✅ Transaction support for creating purchases with items
- ✅ Auto-generated bill numbers with trigger

### UI Features
- ✅ Loading states while fetching data
- ✅ Dropdown selection for suppliers and items
- ✅ Real-time price and quantity editing
- ✅ Validation (requires supplier and at least one item)
- ✅ Professional purchase entry layout
- ✅ Mobile responsive design
- ✅ File upload interface

## Database Schema

### Purchases Table
- `id` - Primary key (BIGSERIAL)
- `user_id` - User identifier (TEXT)
- `supplier_name` - Supplier name (TEXT)
- `supplier_id` - Reference to parties table (UUID)
- `bill_number` - Auto-generated bill number (TEXT)
- `purchase_date` - Date of purchase (DATE)
- `due_date` - Payment due date (DATE)
- `subtotal` - Subtotal amount (DECIMAL)
- `tax_rate` - Tax percentage (DECIMAL)
- `tax_amount` - Tax amount (DECIMAL)
- `discount_amount` - Discount amount (DECIMAL)
- `total_amount` - Total amount (DECIMAL)
- `status` - Purchase status (TEXT: pending, received, paid, cancelled)
- `payment_terms` - Payment terms (TEXT)
- `notes` - Additional notes (TEXT)
- `attached_document` - Document filename (TEXT)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Purchase Items Table
- `id` - Primary key (BIGSERIAL)
- `purchase_id` - Reference to purchases table (BIGINT)
- `item_id` - Reference to items table (BIGINT)
- `item_name` - Item name (TEXT)
- `item_description` - Item description (TEXT)
- `quantity` - Quantity purchased (INTEGER)
- `unit_cost` - Cost per unit (DECIMAL)
- `line_total` - Line total amount (DECIMAL)
- `created_at` - Creation timestamp

## Next Steps (Optional Enhancements)

1. **Purchase History**: Create a purchases list page to view all saved purchases
2. **Purchase Editing**: Allow editing of existing purchases
3. **PDF Generation**: Implement PDF generation for purchase orders
4. **Payment Tracking**: Add payment status and payment history
5. **Inventory Updates**: Automatically increase stock levels when purchases are received
6. **Supplier Integration**: Email purchase orders to suppliers
7. **Approval Workflow**: Add approval process for large purchases
8. **Recurring Purchases**: Support for recurring purchase orders

## Troubleshooting

If you encounter any issues:

1. **No suppliers showing**: Make sure you have parties with party_type = 'Supplier' or 'Both'
2. **No items showing**: Make sure you have items in your items table
3. **Save fails**: Check the browser console for error messages
4. **Bill number conflicts**: The system auto-generates unique bill numbers
5. **File upload issues**: Currently only stores filename, not actual file content

## API Functions Available

- `createPurchaseWithItems(purchaseData, items, userId)` - Create complete purchase
- `getPurchases(userId)` - Get all purchases for user
- `updatePurchase(purchaseId, purchaseData, userId)` - Update existing purchase
- `deletePurchase(purchaseId, userId)` - Delete purchase
- `addPurchase(purchaseData, userId)` - Add purchase record
- `addPurchaseItems(purchaseId, items)` - Add items to purchase

The purchases feature is now fully integrated with your Supabase database and ready to use!