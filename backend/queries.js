// used as seed

// Resets all 5 tables, then inserts:
// 3 users, 1 staff: staff@fresh.com pw: staff123
// 2 clients: abc@super.com, starmart@market.com both pw: password123
// 10 products
// 2 sample orders for abc@super.com: 1 PLACED, 1 COMPLETE


import 'dotenv/config';
import bcrypt from 'bcrypt';
import db from './db.js';

const SALT_ROUNDS = 10; 

async function seed() {
    const client = await db.connect();
    
    try {
    //transaction to prevent partial fill
    await client.query('BEGIN');

    // delete all table data (truncate)
    // TRUNCATE - delete all data from tables without scanning them
    // RESTART IDENTITY - reset sequential id - start fresh with id:1
    // CASCADE Automatically truncate all tables that have foreign-key references to any of the named tables, 
    // or to any tables added to the group due to CASCADE. -remove later
    // https://www.postgresql.org/docs/current/sql-truncate.html - move to attributions
    await client.query(
        `TRUNCATE order_items, orders, clients, products, users
        RESTART IDENTITY CASCADE`
    );
    
    console.log('Cleared all tables');

    // INSERT users
    const staffPassword = await bcrypt.hash('staff123', SALT_ROUNDS);
    const clientPassword = await bcrypt.hash('password123', SALT_ROUNDS);

    const { rows: staffRows } = await client.query(
      `INSERT INTO users (email, hashed_password, role)
       VALUES ($1, $2, 'Staff') RETURNING id`,
      ['staff@fresh.com', staffPassword]
    );
    const staffId = staffRows[0].id;

    const { rows: abcRows } = await client.query(
      `INSERT INTO users (email, hashed_password, role)
       VALUES ($1, $2, 'Client') RETURNING id`,
      ['abc@super.com', clientPassword]
    );
    const abcUserId = abcRows[0].id;

    const { rows: starRows } = await client.query(
      `INSERT INTO users (email, hashed_password, role)
       VALUES ($1, $2, 'Client') RETURNING id`,
      ['starmart@market.com', clientPassword]
    );
    const starUserId = starRows[0].id;

    console.log('Inserted 3 users (1 Staff, 2 Clients)');

    // INSERt client profiles
    await client.query(
      `INSERT INTO clients (user_id, company_name, company_address, uen, contact_number)
       VALUES ($1, $2, $3, $4, $5)`,
      [abcUserId, 'ABC Supermarket', '123 Orchard Road, Singapore 238888', '64358791741', '67896789']
    );

    await client.query(
      `INSERT INTO clients (user_id, company_name, company_address, uen, contact_number)
       VALUES ($1, $2, $3, $4, $5)`,
      [starUserId, 'Star Supermart', '88 Marina Boulevard, Singapore 018983', '78912345678', '61234567']
    );

    console.log(' Inserted 2 client profiles');

    // sample products
    const products = [
        ['4131',   'Fuji Apple',       1.50, 1.80, 'KGS', 200, 'FRUIT'],
        ['4011',   'Banana Cavendish', 0.80, 1.20, 'KGS', 150, 'FRUIT'],
        ['4012',   'Navel Orange',     1.20, 1.50, 'KGS', 12,  'FRUIT'], // low stock
        ['4022',   'Green Grapes',     2.50, 3.20, 'KGS', 80,  'FRUIT'],
        ['4032',   'Watermelon',       0.60, 0.90, 'KGS', 50,  'FRUIT'],
        ['4094',   'Carrot',           0.70, 1.00, 'KGS', 100, 'VEGETABLE'],
        ['4060',   'Broccoli',         1.50, 2.00, 'KGS', 60,  'VEGETABLE'],
        ['4061',   'Iceberg Lettuce',  1.00, 1.40, 'BOX', 40,  'VEGETABLE'],
        ['4087',   'Roma Tomato',      1.10, 1.50, 'KGS', 90,  'VEGETABLE'],
        ['4093',   'Yellow Onion',     0.50, 0.80, 'KGS', 14,  'VEGETABLE'], // low stock
    ];

    // INSERT sample products
    for (const [code, description, price, sale_price, uom, stock, category] of products) {
      await client.query(
        `INSERT INTO products (code, description, price, sale_price, uom, stock, category)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [code, description, price, sale_price, uom, stock, category]
      );
    }

    console.log('Inserted 10 products');


    // INSERT sample orders
    const { rows: o1Rows } = await client.query(
      `INSERT INTO orders (user_id, status) VALUES ($1, 'PLACED') RETURNING id`,
      [abcUserId]
    );
    const order1Id = o1Rows[0].id;

    await client.query(
      `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
       VALUES ($1, 1, 10, 1.80), ($1, 6, 5, 1.00)`,
      [order1Id]
    );

    const { rows: o2Rows } = await client.query(
      `INSERT INTO orders (user_id, status) VALUES ($1, 'COMPLETE') RETURNING id`,
      [abcUserId]
    );
    const order2Id = o2Rows[0].id;

    await client.query(
      `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
       VALUES ($1, 2, 20, 1.20)`,
      [order2Id]
    );

    console.log('Inserted 2 sample orders for ABC');

    await client.query('COMMIT');

    console.log('Seed complete, Users:');
    console.log('Staff: staff@fresh.com / staff123');
    console.log('Client: abc@super.com / password123');
    console.log('Client: starmart@market.com / password123');

    process.exit(0); // success

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', error.message);
    
    process.exit(1);// failure

  } finally {
    client.release();
  }
}


seed();