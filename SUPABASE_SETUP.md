# Supabase Setup Guide

## Steps to Set Up Your Database

### 1. **Access Supabase SQL Editor**
   - Go to [supabase.com](https://supabase.com) and log in to your project
   - Click on **SQL Editor** in the left sidebar
   - Click **+ New Query**

### 2. **Copy and Run the Schema**
   - Open the file `supabase_schema.sql` in the project root
   - Copy all the SQL code
   - Paste it into the Supabase SQL Editor
   - Click **Run** (or press Cmd+Enter)

### 3. **Verify Tables Were Created**
   - Go to **Table Editor** in the left sidebar
   - You should see these 4 tables:
     - ✅ `issues` (Awaaz portal)
     - ✅ `forum_posts` (Sabha portal)
     - ✅ `officials` (Mandaat portal)
     - ✅ `finance_records` (Koshagar portal)

### 4. **Test the Application**
   - Start your app: `npm run dev`
   - Go to **AWAAZ** tab → Click **File an issue** → Submit a form
   - Go to **SABHA** tab → Post a message → Click **POST**
   - Check Supabase **Table Editor** to see your submitted data

---

## Table Schemas

### `issues` Table
Used by: **Awaaz Portal** (Civic Complaints)

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Auto-generated primary key |
| title | VARCHAR(255) | Issue title (required) |
| description | TEXT | Detailed description |
| category | VARCHAR(100) | Roads, Water, Electricity, etc. |
| severity | VARCHAR(50) | CRITICAL, HIGH, MEDIUM, LOW |
| ward | VARCHAR(100) | Ward 7, Ward 8, etc. |
| reporter_name | VARCHAR(255) | Who reported the issue |
| deadline | TIMESTAMP | SLA deadline calculated based on severity |
| status | VARCHAR(50) | Open, In Progress, Escalated, Resolved |
| upvotes | INTEGER | Upvote count |
| created_at | TIMESTAMP | Auto-timestamp |

### `forum_posts` Table
Used by: **Sabha Portal** (Civic Forum)

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Auto-generated primary key |
| user_name | VARCHAR(255) | Poster's name |
| user_handle | VARCHAR(255) | Username/handle |
| content | TEXT | Post content (required) |
| tag | VARCHAR(100) | Local, Regional, etc. |
| is_official | BOOLEAN | Is official response |
| likes | INTEGER | Like count |
| ward | VARCHAR(100) | Which ward |
| created_at | TIMESTAMP | Auto-timestamp |

### `officials` Table
Used by: **Mandaat Portal** (Accountability Scoreboard)

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Auto-generated primary key |
| name | VARCHAR(255) | Official's name |
| band | VARCHAR(50) | GOLD, SILVER, BRONZE, etc. |
| mandaat_score | INTEGER | Performance score |
| issues_filed | INTEGER | Issues reported in this ward |
| issues_resolved | INTEGER | Issues resolved |
| trend | INTEGER | Score trend (positive/negative) |
| created_at | TIMESTAMP | Auto-timestamp |

### `finance_records` Table
Used by: **Koshagar Portal** (Financial Transparency)

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Auto-generated primary key |
| department | VARCHAR(255) | Department name |
| allocated | NUMERIC(10, 2) | Budget allocated |
| spent | NUMERIC(10, 2) | Amount spent |
| quarter | VARCHAR(10) | Q1, Q2, Q3, Q4 |
| fiscal_year | VARCHAR(10) | FY2025, etc. |
| created_at | TIMESTAMP | Auto-timestamp |

---

## Troubleshooting

### Issue: "Table already exists" error
**Solution:** If tables already exist, the SQL uses `IF NOT EXISTS` so it will skip them.

### Issue: "Permission denied" error
**Solution:** Make sure Row Level Security (RLS) policies are enabled. They're created in the schema file automatically.

### Issue: Data still not appearing
1. Check that you have the correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your `.env.local`
2. Refresh the page after submitting
3. Check the browser console for errors (F12 → Console)

---

## Next Steps
- Add sample data to `officials` and `finance_records` tables for testing
- Implement authentication to replace current open access policies
- Add proper security rules in production
