# Sales Database Setup Instructions

## Step 1: Create Sales Tables in Supabase

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-sales-table.sql`
4. Run the SQL script to create the sales and sales_items tables

## Step 2: Verify Tables Created

After running the SQL script, you should see these new tables in your database:

- `sales` - Main invoice/sales records
- `sales_items` - Individual line items for each sale

## Step 3: Test the Sales Feature

1. Make sure you have:
   - At least one customer in your parties table (with party_type = 'customer' or 'both')
   - At least one item in your items table

2. Navigate to the Sales page in your app
3. Select a customer
4. Add items to the invoice
5. Save the invoice

## Features Included

### Sales Management
- ✅ Create new invoices with multiple line items
- ✅ Select customers from your parties database
- ✅ Select items from your items database
- ✅ Automatic invoice number generation (INV-000001, INV-000002, etc.)
- ✅ Real-time calculation of subtotal, tax, and total
- ✅ Customizable tax rates and discounts
- ✅ Save invoices to database

### Database Features
- ✅ Row Level Security (RLS) - users can only see their own sales
- ✅ Automatic timestamps (created_at, updated_at)
- ✅ Foreign key relationships to parties and items
- ✅ Proper indexing for performance
- ✅ Transaction support for creating sales with items

### UI Features
- ✅ Loading states while fetching data
- ✅ Dropdown selection for customers and items
- ✅ Real-time price and quantity editing
- ✅ Validation (requires customer and at least one item)
- ✅ Professional invoice layout
- ✅ Mobile responsive design

## Next Steps (Optional Enhancements)

1. **Sales History**: Create a sales list page to view all saved invoices
2. **Invoice Editing**: Allow editing of existing invoices
3. **PDF Generation**: Implement actual PDF generation for invoices
4. **Payment Tracking**: Add payment status and payment history
5. **Inventory Updates**: Automatically reduce stock levels when sales are made
6. **Email Integration**: Send invoices via email to customers

## Troubleshooting

If you encounter any issues:

1. **No customers showing**: Make sure you have parties with party_type = 'customer' or 'both'
2. **No items showing**: Make sure you have items in your items table
3. **Save fails**: Check the browser console for error messages
4. **RLS errors**: Ensure the user_id matches your logged-in user

The sales feature is now fully integrated with your Supabase database!