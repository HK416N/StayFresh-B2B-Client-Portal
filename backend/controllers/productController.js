import db from '../db.js';

//shjared
// customers see active products only wuthout price (this is referring to purchase price not sale price) column
// staff see all products with all columns
export const getAllProducts = async (req, res, next) => {
  const { search } = req.query;
  try {
    const searchPattern = `%${search || ''}%`;
    let query, params;

    // https://www.postgresql.org/docs/7.3/functions-matching.html 
    // ILIKE instead of LIKE for case insensitive search. To be moved to attributions.
    if (req.user.role === 'Staff') {  //check role 
      query = `
        SELECT id, code, description, price, sale_price, uom, stock, category, is_active
        FROM products
        WHERE description ILIKE $1
        ORDER BY description`; 
      params = [searchPattern];
    } else {
      query = `
        SELECT id, code, description, sale_price, uom, stock, category
        FROM products
        WHERE is_active = TRUE AND description ILIKE $1
        ORDER BY description`;
      params = [searchPattern];
    }

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// staff only. click on list item to bring them to the individual item view where they can then click edit/delete
export const getProductById = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT * 
      FROM products 
      WHERE id = $1`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        code: 'NOT_FOUND',
      });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

//staff onl .yfor creating products
export const createProduct = async (req, res, next) => {
  try {
    const { code, description, price, sale_price, uom, stock, category } = req.body;
    const { rows } = await db.query(
      `INSERT INTO products (code, description, price, sale_price, uom, stock, category)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [code, description, price, sale_price, uom, stock, category]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// staff only . edit product
export const updateProduct = async (req, res, next) => {
  try {
    const { code, description, price, sale_price, uom, stock, category } = req.body;
    const { rows } = await db.query(
      `UPDATE products
       SET code = $1, description = $2, price = $3, sale_price = $4, uom = $5, stock = $6, category = $7
       WHERE id = $8 RETURNING *`,
      [code, description, price, sale_price, uom, stock, category, req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        code: 'NOT_FOUND',
      });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Soft DELETE
// can be undone good for auditing matches up with real-world inventory 
// and e-commerce systems according to a quick google search
// soft delete is actually an UPDATE of is_active from true to false 

export const softDeleteProduct = async (req, res, next) => {
  try {
    const { rowCount } = await db.query(
      'UPDATE products SET is_active = FALSE WHERE id = $1',
      [req.params.id]
    );
    if (rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        code: 'NOT_FOUND',
      });
    }
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
};

// staff only, for dashboard stats `Active Products`, `Pending Orders` and `Total Orders`
export const getStats = async (req, res, next) => {
  try {
    const [active, pending, total] = await Promise.all([
      db.query("SELECT COUNT(*) FROM products WHERE is_active = TRUE"),
      db.query("SELECT COUNT(*) FROM orders WHERE status IN ('PLACED', 'TRANSIT')"),
      db.query("SELECT COUNT(*) FROM orders"),
    ]);
    res.json({
      activeProducts: parseInt(active.rows[0].count, 10),
      pendingOrders: parseInt(pending.rows[0].count, 10),
      totalOrders: parseInt(total.rows[0].count, 10),
    });
  } catch (error) {
    next(error);
  }
};