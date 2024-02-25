// Imports and Configuration
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');

// Before all tests, create a new company and a new invoice
beforeEach(async () => {
  await db.query(
    `INSERT INTO companies (code, name, description) 
        VALUES ('test', 'Test Company', 'This is a test company')`);
  await db.query(
    `INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date) 
        VALUES ('test', 100, false, '2021-01-01', null)`);
});

// After all tests, delete the new company and the new invoice
afterEach(async () => {
  await db.query('DELETE FROM companies');
  await db.query('DELETE FROM invoices');
});

// After all tests, close the db connection
afterAll(async () => {
  await db.end();
});

// Before all tests, delete table entries
beforeAll(async () => {
    await db.query('DELETE FROM companies');
    await db.query('DELETE FROM invoices');
});

// test GET /invoices
describe('GET /invoices', () => {
  test('Get a list with one invoice', async () => {
    const response = await request(app).get('/invoices');
    console.log(response.rows);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      invoices: [
        {
          id: expect.any(Number),
          comp_code: 'test',
          amt: 100,
          paid: false,
          add_date: expect.any(String),
          paid_date: null
        }
      ]
    });
  });
});