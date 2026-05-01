-- =====================================================
-- TRANSAKSI 1 (Mi Ayam Jamur 2 porsi + Es teh 1)
-- =====================================================
DO $$
DECLARE
    v_transaction_id INT;
    v_total_amount DECIMAL(15,2) := (21000 * 2) + 6000; -- 48000
BEGIN
    INSERT INTO transactions (
        invoice_number, user_id, customer_name, total_amount, 
        discount, tax, grand_total, payment_method, payment_status, order_type, transaction_date
    ) VALUES (
        'INV-20260116-001', 1, 'Budi Santoso', v_total_amount, 
        0, 0, v_total_amount, 'cash', 'paid', 'dine_in', NOW()
    ) RETURNING id INTO v_transaction_id;
    
    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price) VALUES
    (v_transaction_id, 1, 'Mi Ayam Jamur', 2, 21000),
    (v_transaction_id, 6, 'Es teh', 1, 6000);
END $$;

-- =====================================================
-- TRANSAKSI 2 (Bakso 1 + Jus alpukat 1 + Es buah 1)
-- =====================================================
DO $$
DECLARE
    v_transaction_id INT;
    v_total_amount DECIMAL(15,2) := 18000 + 12000 + 18000; -- 48000
BEGIN
    INSERT INTO transactions (
        invoice_number, user_id, customer_name, total_amount, 
        discount, tax, grand_total, payment_method, payment_status, order_type, transaction_date
    ) VALUES (
        'INV-20260116-002', 1, 'Siti Rahayu', v_total_amount, 
        0, 0, v_total_amount, 'transfer', 'paid', 'takeaway', NOW()
    ) RETURNING id INTO v_transaction_id;
    
    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price) VALUES
    (v_transaction_id, 4, 'Bakso', 1, 18000),
    (v_transaction_id, 7, 'Jus alpukat', 1, 12000),
    (v_transaction_id, 11, 'Es buah', 1, 18000);
END $$;

-- =====================================================
-- TRANSAKSI 3 (Gado-gado 1 + Kopi hitam 2)
-- =====================================================
DO $$
DECLARE
    v_transaction_id INT;
    v_total_amount DECIMAL(15,2) := 25000 + (6000 * 2); -- 37000
BEGIN
    INSERT INTO transactions (
        invoice_number, user_id, customer_name, total_amount, 
        discount, tax, grand_total, payment_method, payment_status, order_type, transaction_date
    ) VALUES (
        'INV-20260116-003', 1, 'Agus Wijaya', v_total_amount, 
        0, 0, v_total_amount, 'qris', 'paid', 'dine_in', NOW()
    ) RETURNING id INTO v_transaction_id;
    
    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price) VALUES
    (v_transaction_id, 2, 'Gado-gado', 1, 25000),
    (v_transaction_id, 5, 'Kopi hitam', 2, 6000);
END $$;

-- =====================================================
-- TRANSAKSI 4 (Batagor 2 + Es teler 1)
-- =====================================================
DO $$
DECLARE
    v_transaction_id INT;
    v_total_amount DECIMAL(15,2) := (18000 * 2) + 18000; -- 54000
BEGIN
    INSERT INTO transactions (
        invoice_number, user_id, customer_name, total_amount, 
        discount, tax, grand_total, payment_method, payment_status, order_type, transaction_date
    ) VALUES (
        'INV-20260116-004', 1, 'Dewi Lestari', v_total_amount, 
        0, 0, v_total_amount, 'cash', 'paid', 'takeaway', NOW()
    ) RETURNING id INTO v_transaction_id;
    
    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price) VALUES
    (v_transaction_id, 3, 'Batagor', 2, 18000),
    (v_transaction_id, 9, 'Es teler', 1, 18000);
END $$;

-- =====================================================
-- TRANSAKSI 5 (Mi Ayam Jamur 1 + Es jeruk 1 + Kue pancong 2)
-- =====================================================
DO $$
DECLARE
    v_transaction_id INT;
    v_total_amount DECIMAL(15,2) := 21000 + 12000 + (18000 * 2); -- 69000
BEGIN
    INSERT INTO transactions (
        invoice_number, user_id, customer_name, total_amount, 
        discount, tax, grand_total, payment_method, payment_status, order_type, transaction_date
    ) VALUES (
        'INV-20260116-005', 1, 'Rina Setiawan', v_total_amount, 
        0, 0, v_total_amount, 'transfer', 'paid', 'dine_in', NOW()
    ) RETURNING id INTO v_transaction_id;
    
    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price) VALUES
    (v_transaction_id, 1, 'Mi Ayam Jamur', 1, 21000),
    (v_transaction_id, 8, 'Es jeruk', 1, 12000),
    (v_transaction_id, 10, 'Kue pancong', 2, 18000);
END $$;

-- =====================================================
-- TRANSAKSI 6 (Kue apek 3)
-- =====================================================
DO $$
DECLARE
    v_transaction_id INT;
    v_total_amount DECIMAL(15,2) := 12000 * 3; -- 36000
BEGIN
    INSERT INTO transactions (
        invoice_number, user_id, customer_name, total_amount, 
        discount, tax, grand_total, payment_method, payment_status, order_type, transaction_date
    ) VALUES (
        'INV-20260116-006', 1, 'Joko Prasetyo', v_total_amount, 
        0, 0, v_total_amount, 'qris', 'paid', 'takeaway', NOW()
    ) RETURNING id INTO v_transaction_id;
    
    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price) VALUES
    (v_transaction_id, 12, 'Kue apek', 3, 12000);
END $$;

-- tanggal kemarin
-- =====================================================
-- TRANSAKSI KEMARIN (15 Januari 2026) - 6 TRANSAKSI BARU
-- =====================================================

-- TRANSAKSI 1 (15 Jan 2026, 09:15:00)
DO $$
DECLARE
    v_transaction_id INT;
    v_total_amount DECIMAL(15,2) := 21000 + 12000; -- Mi Ayam Jamur + Jus alpukat
BEGIN
    INSERT INTO transactions (
        invoice_number, user_id, customer_name, total_amount, 
        discount, tax, grand_total, payment_method, payment_status, order_type, 
        transaction_date, created_at
    ) VALUES (
        'INV-20260115-007', 1, 'Hendra Wijaya', v_total_amount, 
        0, 0, v_total_amount, 'cash', 'paid', 'dine_in', 
        '2026-01-15 09:15:00.000', '2026-01-15 09:15:00.000'
    ) RETURNING id INTO v_transaction_id;
    
    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price) VALUES
    (v_transaction_id, 1, 'Mi Ayam Jamur', 1, 21000),
    (v_transaction_id, 7, 'Jus alpukat', 1, 12000);
END $$;

-- TRANSAKSI 2 (15 Jan 2026, 10:30:00)
DO $$
DECLARE
    v_transaction_id INT;
    v_total_amount DECIMAL(15,2) := 25000 + 6000 + 18000; -- Gado-gado + Es teh + Es teler
BEGIN
    INSERT INTO transactions (
        invoice_number, user_id, customer_name, total_amount, 
        discount, tax, grand_total, payment_method, payment_status, order_type, 
        transaction_date, created_at
    ) VALUES (
        'INV-20260115-008', 1, 'Lina Marlina', v_total_amount, 
        0, 0, v_total_amount, 'transfer', 'paid', 'takeaway', 
        '2026-01-15 10:30:00.000', '2026-01-15 10:30:00.000'
    ) RETURNING id INTO v_transaction_id;
    
    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price) VALUES
    (v_transaction_id, 2, 'Gado-gado', 1, 25000),
    (v_transaction_id, 6, 'Es teh', 1, 6000),
    (v_transaction_id, 9, 'Es teler', 1, 18000);
END $$;

-- TRANSAKSI 3 (15 Jan 2026, 12:00:00)
DO $$
DECLARE
    v_transaction_id INT;
    v_total_amount DECIMAL(15,2) := (18000 * 2) + 12000; -- Batagor 2 + Es jeruk
BEGIN
    INSERT INTO transactions (
        invoice_number, user_id, customer_name, total_amount, 
        discount, tax, grand_total, payment_method, payment_status, order_type, 
        transaction_date, created_at
    ) VALUES (
        'INV-20260115-009', 1, 'Rudi Hartono', v_total_amount, 
        0, 0, v_total_amount, 'qris', 'paid', 'dine_in', 
        '2026-01-15 12:00:00.000', '2026-01-15 12:00:00.000'
    ) RETURNING id INTO v_transaction_id;
    
    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price) VALUES
    (v_transaction_id, 3, 'Batagor', 2, 18000),
    (v_transaction_id, 8, 'Es jeruk', 1, 12000);
END $$;

-- TRANSAKSI 4 (15 Jan 2026, 14:20:00)
DO $$
DECLARE
    v_transaction_id INT;
    v_total_amount DECIMAL(15,2) := 18000 + (18000 * 2); -- Bakso + Kue pancong 2
BEGIN
    INSERT INTO transactions (
        invoice_number, user_id, customer_name, total_amount, 
        discount, tax, grand_total, payment_method, payment_status, order_type, 
        transaction_date, created_at
    ) VALUES (
        'INV-20260115-010', 1, 'Mega Utami', v_total_amount, 
        0, 0, v_total_amount, 'cash', 'paid', 'takeaway', 
        '2026-01-15 14:20:00.000', '2026-01-15 14:20:00.000'
    ) RETURNING id INTO v_transaction_id;
    
    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price) VALUES
    (v_transaction_id, 4, 'Bakso', 1, 18000),
    (v_transaction_id, 10, 'Kue pancong', 2, 18000);
END $$;

-- TRANSAKSI 5 (15 Jan 2026, 15:45:00)
DO $$
DECLARE
    v_transaction_id INT;
    v_total_amount DECIMAL(15,2) := 12000 + 18000; -- Es buah + Kue apek
BEGIN
    INSERT INTO transactions (
        invoice_number, user_id, customer_name, total_amount, 
        discount, tax, grand_total, payment_method, payment_status, order_type, 
        transaction_date, created_at
    ) VALUES (
        'INV-20260115-011', 1, 'Bayu Permana', v_total_amount, 
        0, 0, v_total_amount, 'transfer', 'paid', 'dine_in', 
        '2026-01-15 15:45:00.000', '2026-01-15 15:45:00.000'
    ) RETURNING id INTO v_transaction_id;
    
    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price) VALUES
    (v_transaction_id, 11, 'Es buah', 1, 18000),
    (v_transaction_id, 12, 'Kue apek', 1, 12000);
END $$;

-- TRANSAKSI 6 (15 Jan 2026, 17:30:00)
DO $$
DECLARE
    v_transaction_id INT;
    v_total_amount DECIMAL(15,2) := (6000 * 3); -- Kopi hitam 3
BEGIN
    INSERT INTO transactions (
        invoice_number, user_id, customer_name, total_amount, 
        discount, tax, grand_total, payment_method, payment_status, order_type, 
        transaction_date, created_at
    ) VALUES (
        'INV-20260115-012', 1, 'Putri Amelia', v_total_amount, 
        0, 0, v_total_amount, 'qris', 'paid', 'takeaway', 
        '2026-01-15 17:30:00.000', '2026-01-15 17:30:00.000'
    ) RETURNING id INTO v_transaction_id;
    
    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price) VALUES
    (v_transaction_id, 5, 'Kopi hitam', 3, 6000);
END $$;

-- =====================================================
-- TRANSAKSI TANGGAL 14 JANUARI 2026 - 6 TRANSAKSI BARU
-- =====================================================

-- TRANSAKSI 1 (14 Jan 2026, 08:45:00)
DO $$
DECLARE
    v_transaction_id INT;
    v_total_amount DECIMAL(15,2) := 21000 + 6000; -- Mi Ayam Jamur + Es teh
BEGIN
    INSERT INTO transactions (
        invoice_number, user_id, customer_name, total_amount, 
        discount, tax, grand_total, payment_method, payment_status, order_type, 
        transaction_date, created_at
    ) VALUES (
        'INV-20260114-001', 1, 'Andi Pratama', v_total_amount, 
        0, 0, v_total_amount, 'cash', 'paid', 'dine_in', 
        '2026-01-14 08:45:00.000', '2026-01-14 08:45:00.000'
    ) RETURNING id INTO v_transaction_id;
    
    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price) VALUES
    (v_transaction_id, 1, 'Mi Ayam Jamur', 1, 21000),
    (v_transaction_id, 6, 'Es teh', 1, 6000);
END $$;

-- TRANSAKSI 2 (14 Jan 2026, 10:15:00)
DO $$
DECLARE
    v_transaction_id INT;
    v_total_amount DECIMAL(15,2) := 25000 + 12000 + 18000; -- Gado-gado + Jus alpukat + Es buah
BEGIN
    INSERT INTO transactions (
        invoice_number, user_id, customer_name, total_amount, 
        discount, tax, grand_total, payment_method, payment_status, order_type, 
        transaction_date, created_at
    ) VALUES (
        'INV-20260114-002', 1, 'Maya Sari', v_total_amount, 
        0, 0, v_total_amount, 'transfer', 'paid', 'takeaway', 
        '2026-01-14 10:15:00.000', '2026-01-14 10:15:00.000'
    ) RETURNING id INTO v_transaction_id;
    
    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price) VALUES
    (v_transaction_id, 2, 'Gado-gado', 1, 25000),
    (v_transaction_id, 7, 'Jus alpukat', 1, 12000),
    (v_transaction_id, 11, 'Es buah', 1, 18000);
END $$;

-- TRANSAKSI 3 (14 Jan 2026, 11:30:00)
DO $$
DECLARE
    v_transaction_id INT;
    v_total_amount DECIMAL(15,2) := (18000 * 2) + 12000; -- Bakso 2 + Es jeruk
BEGIN
    INSERT INTO transactions (
        invoice_number, user_id, customer_name, total_amount, 
        discount, tax, grand_total, payment_method, payment_status, order_type, 
        transaction_date, created_at
    ) VALUES (
        'INV-20260114-003', 1, 'Doni Saputra', v_total_amount, 
        0, 0, v_total_amount, 'qris', 'paid', 'dine_in', 
        '2026-01-14 11:30:00.000', '2026-01-14 11:30:00.000'
    ) RETURNING id INTO v_transaction_id;
    
    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price) VALUES
    (v_transaction_id, 4, 'Bakso', 2, 18000),
    (v_transaction_id, 8, 'Es jeruk', 1, 12000);
END $$;

-- TRANSAKSI 4 (14 Jan 2026, 13:00:00)
DO $$
DECLARE
    v_transaction_id INT;
    v_total_amount DECIMAL(15,2) := 18000 + 18000 + 12000; -- Batagor + Es teler + Kue apek
BEGIN
    INSERT INTO transactions (
        invoice_number, user_id, customer_name, total_amount, 
        discount, tax, grand_total, payment_method, payment_status, order_type, 
        transaction_date, created_at
    ) VALUES (
        'INV-20260114-004', 1, 'Nadia Putri', v_total_amount, 
        0, 0, v_total_amount, 'cash', 'paid', 'takeaway', 
        '2026-01-14 13:00:00.000', '2026-01-14 13:00:00.000'
    ) RETURNING id INTO v_transaction_id;
    
    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price) VALUES
    (v_transaction_id, 3, 'Batagor', 1, 18000),
    (v_transaction_id, 9, 'Es teler', 1, 18000),
    (v_transaction_id, 12, 'Kue apek', 1, 12000);
END $$;

-- TRANSAKSI 5 (14 Jan 2026, 15:30:00)
DO $$
DECLARE
    v_transaction_id INT;
    v_total_amount DECIMAL(15,2) := (21000 * 2) + (6000 * 2); -- Mi Ayam Jamur 2 + Kopi hitam 2
BEGIN
    INSERT INTO transactions (
        invoice_number, user_id, customer_name, total_amount, 
        discount, tax, grand_total, payment_method, payment_status, order_type, 
        transaction_date, created_at
    ) VALUES (
        'INV-20260114-005', 1, 'Rizki Firmansyah', v_total_amount, 
        0, 0, v_total_amount, 'transfer', 'paid', 'dine_in', 
        '2026-01-14 15:30:00.000', '2026-01-14 15:30:00.000'
    ) RETURNING id INTO v_transaction_id;
    
    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price) VALUES
    (v_transaction_id, 1, 'Mi Ayam Jamur', 2, 21000),
    (v_transaction_id, 5, 'Kopi hitam', 2, 6000);
END $$;

-- TRANSAKSI 6 (14 Jan 2026, 17:00:00)
DO $$
DECLARE
    v_transaction_id INT;
    v_total_amount DECIMAL(15,2) := 18000 + 12000 + 18000; -- Kue pancong + Es jeruk + Es teler
BEGIN
    INSERT INTO transactions (
        invoice_number, user_id, customer_name, total_amount, 
        discount, tax, grand_total, payment_method, payment_status, order_type, 
        transaction_date, created_at
    ) VALUES (
        'INV-20260114-006', 1, 'Sarah Azzahra', v_total_amount, 
        0, 0, v_total_amount, 'qris', 'paid', 'takeaway', 
        '2026-01-14 17:00:00.000', '2026-01-14 17:00:00.000'
    ) RETURNING id INTO v_transaction_id;
    
    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price) VALUES
    (v_transaction_id, 10, 'Kue pancong', 1, 18000),
    (v_transaction_id, 8, 'Es jeruk', 1, 12000),
    (v_transaction_id, 9, 'Es teler', 1, 18000);
END $$;

DO $$
DECLARE
    v_transaction_id INT;
    v_total_amount DECIMAL(15,2);
BEGIN
    -- Transaksi 1: Mi Ayam Jamur + Es teh (dine_in, cash)
    v_total_amount := 21000 + (6000 * 2);
    INSERT INTO transactions (invoice_number, user_id, customer_name, total_amount, discount, tax, grand_total, payment_method, payment_status, order_type, transaction_date, created_at) VALUES ('INV-20260116-022', 2, 'Budi Santoso', v_total_amount, 0, 0, v_total_amount, 'cash', 'paid', 'dine_in', '2026-01-16 12:30:00.000', '2026-01-16 12:30:00.000') RETURNING id INTO v_transaction_id;
    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price) VALUES (v_transaction_id, 1, 'Mi Ayam Jamur', 1, 21000), (v_transaction_id, 6, 'Es teh', 2, 6000);

    -- Transaksi 2: Jus alpukat + Es teler + Kopi hitam (dine_in, qris)
    v_total_amount := 12000 + 18000 + 6000;
    INSERT INTO transactions (invoice_number, user_id, customer_name, total_amount, discount, tax, grand_total, payment_method, payment_status, order_type, transaction_date, created_at) VALUES ('INV-20260116-023', 2, 'Siti Rahma', v_total_amount, 0, 0, v_total_amount, 'qris', 'paid', 'dine_in', '2026-01-16 15:45:00.000', '2026-01-16 15:45:00.000') RETURNING id INTO v_transaction_id;
    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price) VALUES (v_transaction_id, 7, 'Jus alpukat', 1, 12000), (v_transaction_id, 9, 'Es teler', 1, 18000), (v_transaction_id, 5, 'Kopi hitam', 1, 6000);

    -- Transaksi 3: Gado-gado + Kue pancong (takeaway, transfer)
    v_total_amount := 25000 + (18000 * 2);
    INSERT INTO transactions (invoice_number, user_id, customer_name, total_amount, discount, tax, grand_total, payment_method, payment_status, order_type, transaction_date, created_at) VALUES ('INV-20260116-024', 2, 'Ahmad Fauzi', v_total_amount, 0, 0, v_total_amount, 'transfer', 'paid', 'takeaway', '2026-01-16 19:00:00.000', '2026-01-16 19:00:00.000') RETURNING id INTO v_transaction_id;
    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price) VALUES (v_transaction_id, 2, 'Gado-gado', 1, 25000), (v_transaction_id, 10, 'Kue pancong', 2, 18000);

    -- Transaksi 4: Batagor + Bakso + Es jeruk (takeaway, cash)
    v_total_amount := (18000 * 3) + (18000 * 2) + (12000 * 4);
    INSERT INTO transactions (invoice_number, user_id, customer_name, total_amount, discount, tax, grand_total, payment_method, payment_status, order_type, transaction_date, created_at) VALUES ('INV-20260116-025', 2, 'Diana Putri', v_total_amount, 0, 0, v_total_amount, 'cash', 'paid', 'takeaway', '2026-01-16 13:15:00.000', '2026-01-16 13:15:00.000') RETURNING id INTO v_transaction_id;
    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price) VALUES (v_transaction_id, 3, 'Batagor', 3, 18000), (v_transaction_id, 4, 'Bakso', 2, 18000), (v_transaction_id, 8, 'Es jeruk', 4, 12000);

    -- Transaksi 5: Mi Ayam Jamur + Jus alpukat + Es buah (dine_in, qris)
    v_total_amount := (21000 * 2) + 12000 + 18000;
    INSERT INTO transactions (invoice_number, user_id, customer_name, total_amount, discount, tax, grand_total, payment_method, payment_status, order_type, transaction_date, created_at) VALUES ('INV-20260116-026', 2, 'Rizki Ramadhan', v_total_amount, 0, 0, v_total_amount, 'qris', 'paid', 'dine_in', '2026-01-16 20:30:00.000', '2026-01-16 20:30:00.000') RETURNING id INTO v_transaction_id;
    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price) VALUES (v_transaction_id, 1, 'Mi Ayam Jamur', 2, 21000), (v_transaction_id, 7, 'Jus alpukat', 1, 12000), (v_transaction_id, 11, 'Es buah', 1, 18000);
END $$;
DO $$
DECLARE
    v_transaction_id INT;
    v_total_amount DECIMAL(15,2);
BEGIN
    -- Transaksi 1: Mi Ayam Jamur + Es teh (dine_in, cash)
    v_total_amount := 21000 + (6000 * 2);
    INSERT INTO transactions (
        invoice_number, user_id, customer_name, total_amount, discount, tax, grand_total,
        payment_method, payment_status, order_type, transaction_date, created_at
    )
    VALUES (
        'INV-20260501-027', 2, 'Budi Santoso', v_total_amount, 0, 0, v_total_amount,
        'cash', 'paid', 'dine_in', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
    RETURNING id INTO v_transaction_id;

    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price)
    VALUES
        (v_transaction_id, 1, 'Mi Ayam Jamur', 1, 21000),
        (v_transaction_id, 6, 'Es teh', 2, 6000);

    -- Transaksi 2: Jus alpukat + Es teler + Kopi hitam (dine_in, qris)
    v_total_amount := 12000 + 18000 + 6000;
    INSERT INTO transactions (
        invoice_number, user_id, customer_name, total_amount, discount, tax, grand_total,
        payment_method, payment_status, order_type, transaction_date, created_at
    )
    VALUES (
        'INV-20260501-028', 2, 'Siti Rahma', v_total_amount, 0, 0, v_total_amount,
        'qris', 'paid', 'dine_in', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
    RETURNING id INTO v_transaction_id;

    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price)
    VALUES
        (v_transaction_id, 7, 'Jus alpukat', 1, 12000),
        (v_transaction_id, 9, 'Es teler', 1, 18000),
        (v_transaction_id, 5, 'Kopi hitam', 1, 6000);

    -- Transaksi 3: Gado-gado + Kue pancong (takeaway, transfer)
    v_total_amount := 25000 + (18000 * 2);
    INSERT INTO transactions (
        invoice_number, user_id, customer_name, total_amount, discount, tax, grand_total,
        payment_method, payment_status, order_type, transaction_date, created_at
    )
    VALUES (
        'INV-20260501-029', 2, 'Ahmad Fauzi', v_total_amount, 0, 0, v_total_amount,
        'transfer', 'paid', 'takeaway', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
    RETURNING id INTO v_transaction_id;

    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price)
    VALUES
        (v_transaction_id, 2, 'Gado-gado', 1, 25000),
        (v_transaction_id, 10, 'Kue pancong', 2, 18000);

    -- Transaksi 4: Batagor + Bakso + Es jeruk (takeaway, cash)
    v_total_amount := (18000 * 3) + (18000 * 2) + (12000 * 4);
    INSERT INTO transactions (
        invoice_number, user_id, customer_name, total_amount, discount, tax, grand_total,
        payment_method, payment_status, order_type, transaction_date, created_at
    )
    VALUES (
        'INV-20260501-030', 2, 'Diana Putri', v_total_amount, 0, 0, v_total_amount,
        'cash', 'paid', 'takeaway', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
    RETURNING id INTO v_transaction_id;

    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price)
    VALUES
        (v_transaction_id, 3, 'Batagor', 3, 18000),
        (v_transaction_id, 4, 'Bakso', 2, 18000),
        (v_transaction_id, 8, 'Es jeruk', 4, 12000);

    -- Transaksi 5: Mi Ayam Jamur + Jus alpukat + Es buah (dine_in, qris)
    v_total_amount := (21000 * 2) + 12000 + 18000;
    INSERT INTO transactions (
        invoice_number, user_id, customer_name, total_amount, discount, tax, grand_total,
        payment_method, payment_status, order_type, transaction_date, created_at
    )
    VALUES (
        'INV-20260501-031', 2, 'Rizki Ramadhan', v_total_amount, 0, 0, v_total_amount,
        'qris', 'paid', 'dine_in', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
    RETURNING id INTO v_transaction_id;

    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price)
    VALUES
        (v_transaction_id, 1, 'Mi Ayam Jamur', 2, 21000),
        (v_transaction_id, 7, 'Jus alpukat', 1, 12000),
        (v_transaction_id, 11, 'Es buah', 1, 18000);
END $$;
