import db from '../db.js'

//create order - customer only 
export const placeOrder = async (req, res, next) => {

    //customer only
    if (req.user.role === 'Staff') {
        return res.status(403).json({
            success: false,
            error: 'Staff cannot place orders',
            code: 'FORBIDDEN',
        });
    }

    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Cart is empty',
            code: 'EMPTY_CART',
        });
    }

    const client = await db.connect();

    try {
        await client.query('BEGIN');

        // build array of order items with price at the point of order 
        // order prices can be changed mid transaction. 
        // orderLines (snapshot) works in tandem with FOR UPDATE (lock)
        // to prevent fluctuations
        const orderLines = [];

        for (const item of items) {
            const { product_id, quantity } = item;

            //locking clause https://www.postgresql.org/docs/current/sql-select.html -move to attributions 
            const { rows } = await client.query(
                `SELECT stock, sale_price
                FROM products
                WHERE id=$1 AND is_active = TRUE
                FOR UPDATE`,
                [product_id]
            );

            if (rows.length === 0) {
                const error = new Error(`Product ${product_id} not found`);
                error.status = 400;
                error.code = 'PRODUCT_NOT_FOUND';
                throw error;
            }

            const product = rows[0];

            //stock take - throw error if insufficient stock
            if (product.stock < quantity) {
                const error = new Error(`Insufficient stock for product ${product_id}`);
                error.status = 400;
                error.code = 'INSUFFICIENT_STOCK';
                throw error;
            }

            // deduct stock while still holding the lock        
            await client.query(
                `UPDATE products
                SET stock = stock - $1
                WHERE id =$2`,
                [quantity, product_id]
            );

            orderLines.push({
                product_id,
                quantity,
                unit_price: product.sale_price,
            });
        }

        const orderResult = await client.query(
            `INSERT INTO orders (user_id, status)
            VALUES ($1, 'PLACED')
            RETURNING id`, //only need id
            [req.user.id]
        );

        const orderId = orderResult.rows[0].id;

        for (const line of orderLines) {
            await client.query(
                `INSERT INTO order_items ( order_id, product_id, quantity, unit_price)
                VALUES($1, $2, $3, $4)`,
                [orderId, line.product_id, line.quantity, line.unit_price]
            );
        }

        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            data: { id: orderId },
        });

    } catch (error) {
        await client.query('ROLLBACK');

        next(error);
    } finally {
        client.release();
    }
};


//orders list - both roles status= `PLACED` and `TRANSIT` 
const DEFAULT_STATUSES = ['PLACED', 'TRANSIT'];

export const getOrders = async (req, res, next) => {
    const statuses = req.query.status
        ? req.query.status.split(',')
        : DEFAULT_STATUSES;

    try {
        let query, params;

        //sum all subtotals order_item's quantity*price
        // coalesce prevents api returning null. instead sends back 0 
        // https://www.postgresql.org/docs/current/functions-conditional.html#FUNCTIONS-COALESCE-NVL-IFNULL
        if (req.user.role === 'Staff') {
            query = 
            `SELECT
            o.id,
            o.user_id,
            o.status,
            o.created_at,
            o.updated_at,
            c.company_name,
            (SELECT COALESCE(SUM(oi.quantity * oi.unit_price), 0)
            FROM order_items oi
            WHERE oi.order_id = o.id) AS total
            FROM orders o
            LEFT JOIN clients c ON c.user_id = o.user_id
            WHERE o.status = ANY($1)
            ORDER BY o.created_at DESC`;
            params = [statuses];
        } else {
            query = 
            `SELECT
            o.id,
            o.user_id,
            o.status,
            o.created_at,
            o.updated_at,
            (SELECT COALESCE(SUM(oi.quantity * oi.unit_price), 0) 
            FROM order_items oi
            WHERE oi.order_id = o.id) AS total
            FROM orders o
            WHERE o.user_id = $1 AND o.status = ANY($2)
            ORDER BY o.created_at DESC`;
            params = [req.user.id, statuses];
        }

        const { rows } = await db.query(query, params);
        res.json(rows);

    } catch (error) {
        next(error);
    }
}

// get order by id - staff can see all orders while clients only see their own
export const getOrderById = async (req, res, next) => {
  const orderId = parseInt(req.params.id, 10);

  try {
    //? fetch order headers (orders) - only staff sees company name
    // note: company_name is required to even sign up, 
    // hence placed orders always come with a company_name.
    // LEFT JOIN ensures all records remain accessible even if there is no company name.
    // e.g. in the case of manual entry into db
    const orderResult = await db.query(
      `SELECT
         o.id,
         o.user_id,
         o.status,
         o.created_at,
         o.updated_at,
         c.company_name
       FROM orders o
       LEFT JOIN clients c ON c.user_id = o.user_id
       WHERE o.id = $1`,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
        code: 'NOT_FOUND',
      });
    }

    const order = orderResult.rows[0];

    // customers can only see their own orders. staff can see all orders - short circuit
    if (req.user.role !== 'Staff' && order.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        code: 'FORBIDDEN',
      });
    }

    // fetch lines (order_items) 
    // use JOIN because any missing data is considered broken data and will
    // cause problems beyond this point
    // Join indiv prod details with oi qty, price etc
    const itemsResult = await db.query(
      `SELECT
         oi.id,
         oi.product_id,
         oi.quantity,
         oi.unit_price,
         p.code,
         p.description,
         p.uom
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = $1
       ORDER BY oi.id`,
      [orderId]
    );

    // compute total
    const items = itemsResult.rows;
    const total = items.reduce(
      (sum, item) => sum + Number(item.unit_price) * item.quantity,
      0
    );

    //flatten the final response with spread
    res.json({
      ...order,
      items,
      total,
    });
  } catch (error) {
    next(error);
  }
};


// edit order status

//s tatus:
// staff transitions: PLACED to TRANSIT, TRANSIT to COMPLETE,
// PLACED to CANCELLED, TRANSIT to CANCELLED.

// client transitions: PLACED to CANCELLED or TRANSIT to CANCELLED only for their own orders.

// stock:
// CANCELLED from PLACED or TRANSIT restores stock.
// PLACED to TRANSIT, TRANSIT to COMPLETE doesnt change stock
export const updateOrderStatus = async (req, res, next) => {
  const orderId = parseInt(req.params.id, 10);
  const { status: newStatus } = req.body;

  const validStatuses = ['PLACED', 'TRANSIT', 'CANCELLED', 'COMPLETE'];
  
  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid status',
      code: 'INVALID_STATUS',
    });
  }

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // lock, read then write. prevent race condition.
    const { rows: orderRows } = await client.query(
      `SELECT user_id, status 
      FROM orders 
      WHERE id = $1 FOR UPDATE`,
      [orderId]
    );

    if (orderRows.length === 0) {
      const error = new Error('Order not found');
      error.status = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    const order = orderRows[0];

    // check. Users: not staff, not other users, not invalid users
    //  Status: not 'CANCELLED', not already 'COMPLETE' or 'CANCELLED'
    if (req.user.role !== 'Staff') {
      if (order.user_id !== req.user.id) {
        const error = new Error('Forbidden');
        error.status = 403;
        error.code = 'FORBIDDEN';
        throw error;
      }
      if (newStatus !== 'CANCELLED') {
        const error = new Error('Customers can only cancel orders');
        error.status = 400;
        error.code = 'INVALID_TRANSITION';
        throw error;
      }
      if (order.status !== 'PLACED' && order.status !== 'TRANSIT') {
        const error = new Error('Cannot cancel a completed or already cancelled order');
        error.status = 400;
        error.code = 'INVALID_TRANSITION';
        throw error;
      }
    }

    // restore stock if cancelling
    if (newStatus === 'CANCELLED' && (order.status === 'PLACED' || order.status === 'TRANSIT')) {
      await client.query(
        `UPDATE products p
         SET stock = p.stock + oi.quantity
         FROM order_items oi
         WHERE p.id = oi.product_id AND oi.order_id = $1`,
        [orderId]
      );
    }

    // apply the status change
    await client.query(
      `UPDATE orders
       SET status = $1, updated_at = NOW()
       WHERE id = $2`,
      [newStatus, orderId]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      data: { ok: true },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};