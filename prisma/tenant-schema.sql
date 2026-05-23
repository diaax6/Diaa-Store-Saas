-- Tenant Database Schema
-- This SQL is run when creating a new tenant database

-- Staff Users (tenant admin team)
CREATE TABLE IF NOT EXISTS staff_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'ADMIN', -- TENANT_OWNER, TENANT_ADMIN, TENANT_SUPPORT
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  password_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  image_url TEXT,
  category_id TEXT REFERENCES categories(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_best_seller BOOLEAN NOT NULL DEFAULT false,
  show_price BOOLEAN NOT NULL DEFAULT true,
  uses_stock BOOLEAN NOT NULL DEFAULT false,
  delivery_mode TEXT NOT NULL DEFAULT 'MANUAL',
  order_mode TEXT NOT NULL DEFAULT 'DIRECT_ORDER',
  delivery_label TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Packages
CREATE TABLE IF NOT EXISTS packages (
  id TEXT PRIMARY KEY,
  service_id TEXT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DOUBLE PRECISION,
  compare_at_price DOUBLE PRECISION,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  has_offer_badge BOOLEAN NOT NULL DEFAULT false,
  offer_badge_text TEXT,
  delivery_mode_override TEXT,
  uses_stock_override BOOLEAN,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_id TEXT NOT NULL REFERENCES customers(id),
  service_id TEXT NOT NULL REFERENCES services(id),
  package_id TEXT REFERENCES packages(id),
  payment_method_id TEXT,
  assigned_staff_id TEXT REFERENCES staff_users(id),
  total_amount DOUBLE PRECISION,
  status TEXT NOT NULL DEFAULT 'PENDING_PAYMENT_REVIEW',
  payment_status TEXT NOT NULL DEFAULT 'PENDING',
  delivery_status TEXT NOT NULL DEFAULT 'PENDING',
  customer_note TEXT,
  admin_note TEXT,
  delivery_result TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payment Methods
CREATE TABLE IF NOT EXISTS payment_methods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  instructions TEXT,
  account_info TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method_id_fk TEXT REFERENCES payment_methods(id);

-- Payment Submissions
CREATE TABLE IF NOT EXISTS payment_submissions (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  payment_method_id TEXT NOT NULL REFERENCES payment_methods(id),
  proof_image_url TEXT,
  transaction_ref TEXT,
  sender_name TEXT,
  phone_number TEXT,
  amount DOUBLE PRECISION,
  notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Stock Templates
CREATE TABLE IF NOT EXISTS stock_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stock_template_fields (
  id TEXT PRIMARY KEY,
  template_id TEXT NOT NULL REFERENCES stock_templates(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  field_key TEXT NOT NULL,
  field_type TEXT NOT NULL DEFAULT 'TEXT',
  is_required BOOLEAN NOT NULL DEFAULT true,
  is_masked BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  placeholder TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Stock Items
CREATE TABLE IF NOT EXISTS stock_items (
  id TEXT PRIMARY KEY,
  service_id TEXT NOT NULL REFERENCES services(id),
  package_id TEXT REFERENCES packages(id),
  template_id TEXT REFERENCES stock_templates(id),
  data TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'AVAILABLE',
  notes TEXT,
  order_id TEXT UNIQUE REFERENCES orders(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Redeem Codes
CREATE TABLE IF NOT EXISTS redeem_codes (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  service_id TEXT,
  package_id TEXT,
  stock_item_id TEXT UNIQUE REFERENCES stock_items(id),
  order_id TEXT UNIQUE REFERENCES orders(id),
  customer_id TEXT REFERENCES customers(id),
  status TEXT NOT NULL DEFAULT 'UNUSED',
  created_by_id TEXT,
  assigned_by_id TEXT,
  expires_at TIMESTAMPTZ,
  redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS customer_notifications (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'GENERAL',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  order_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_notifications (
  id TEXT PRIMARY KEY,
  staff_user_id TEXT REFERENCES staff_users(id),
  type TEXT NOT NULL DEFAULT 'GENERAL',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  order_id TEXT,
  for_all_admins BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activity Log
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  staff_user_id TEXT REFERENCES staff_users(id),
  actor_name TEXT,
  action TEXT NOT NULL,
  entity TEXT,
  entity_id TEXT,
  metadata TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Settings
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Offers
CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  banner_url TEXT,
  discount_type TEXT NOT NULL DEFAULT 'PERCENTAGE',
  discount_value DOUBLE PRECISION NOT NULL DEFAULT 0,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  show_on_home BOOLEAN NOT NULL DEFAULT true,
  is_hot BOOLEAN NOT NULL DEFAULT false,
  is_best_deal BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- File Uploads
CREATE TABLE IF NOT EXISTS file_uploads (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INT NOT NULL,
  url TEXT NOT NULL,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
