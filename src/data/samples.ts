import { SampleQuery } from '../types';

export const SAMPLE_QUERIES: SampleQuery[] = [
  {
    id: 'monthly-revenue',
    title: 'Monthly Revenue & Customer Breakdown',
    description: 'Aggregates sales by month with customer counts and average order value',
    badge: 'GROUP BY & JOINS',
    dialect: 'PostgreSQL',
    query: `SELECT 
  DATE_TRUNC('month', o.order_date) AS sales_month,
  c.country,
  COUNT(DISTINCT o.customer_id) AS active_customers,
  COUNT(o.id) AS total_orders,
  SUM(o.total_amount) AS total_revenue,
  AVG(o.total_amount) AS avg_order_value
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.status = 'COMPLETED'
  AND o.order_date >= '2025-01-01'
GROUP BY 1, 2
HAVING SUM(o.total_amount) > 10000
ORDER BY sales_month DESC, total_revenue DESC;`
  },
  {
    id: 'user-cohort-cte',
    title: 'User Retention & First Order Cohort',
    description: 'Uses Common Table Expressions (CTE) and window functions to rank order history',
    badge: 'WITH CTE & WINDOW FX',
    dialect: 'PostgreSQL',
    query: `WITH customer_first_orders AS (
  SELECT 
    customer_id,
    MIN(order_date) AS cohort_date,
    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date ASC) as order_num
  FROM orders
  GROUP BY customer_id, order_date
),
monthly_cohorts AS (
  SELECT 
    DATE_TRUNC('month', cohort_date) AS cohort_month,
    COUNT(customer_id) AS new_users
  FROM customer_first_orders
  WHERE order_num = 1
  GROUP BY 1
)
SELECT 
  cohort_month,
  new_users,
  LAG(new_users, 1) OVER (ORDER BY cohort_month) AS prev_month_users,
  ROUND(((new_users - LAG(new_users, 1) OVER (ORDER BY cohort_month)) * 100.0) / 
    NULLIF(LAG(new_users, 1) OVER (ORDER BY cohort_month), 0), 2) AS growth_percentage
FROM monthly_cohorts
ORDER BY cohort_month DESC;`
  },
  {
    id: 'low-stock-subquery',
    title: 'Low Stock Alert with Vendor Subquery',
    description: 'Filters products using correlated subqueries and HAVING conditions',
    badge: 'SUBQUERIES & HAVING',
    dialect: 'MySQL',
    query: `SELECT 
  p.id AS product_id,
  p.product_name,
  p.units_in_stock,
  p.reorder_level,
  s.supplier_name
FROM products p
JOIN suppliers s ON p.supplier_id = s.id
WHERE p.discontinued = 0
  AND p.units_in_stock <= p.reorder_level
  AND EXISTS (
    SELECT 1 
    FROM purchase_orders po 
    WHERE po.product_id = p.id 
      AND po.status IN ('PENDING', 'IN_TRANSIT')
  )
ORDER BY (p.reorder_level - p.units_in_stock) DESC
LIMIT 20;`
  },
  {
    id: 'top-rank-products',
    title: 'Top 3 Best Sellers per Category',
    description: 'Ranks items within category partitions using DENSE_RANK()',
    badge: 'DENSE_RANK()',
    dialect: 'SQL Server',
    query: `WITH RankedProducts AS (
  SELECT 
    p.category_id,
    c.category_name,
    p.product_name,
    p.price,
    SUM(oi.quantity) AS total_quantity_sold,
    DENSE_RANK() OVER (
      PARTITION BY p.category_id 
      ORDER BY SUM(oi.quantity) DESC
    ) AS category_rank
  FROM order_items oi
  INNER JOIN products p ON oi.product_id = p.id
  INNER JOIN categories c ON p.category_id = c.id
  GROUP BY p.category_id, c.category_name, p.product_name, p.price
)
SELECT 
  category_name,
  product_name,
  total_quantity_sold,
  category_rank
FROM RankedProducts
WHERE category_rank <= 3
ORDER BY category_name ASC, category_rank ASC;`
  }
];
