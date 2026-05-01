SELECT 
    t.customer_name,
    ti.product_name,
    ti.quantity,
    ti.subtotal,
    t.grand_total
FROM transactions t
JOIN transaction_items ti ON t.id = ti.transaction_id
WHERE t.user_id = 1
ORDER BY t.transaction_date DESC, t.id, ti.id;