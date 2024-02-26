// Imports and Configuration
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');

// Before all tests, create a new company and a new invoice
beforeEach(async () => {
  await db.query(`ALTER SEQUENCE invoices_id_seq RESTART WITH 1`);
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

// test GET /invoices/:id
describe('GET /invoices/:id', () => {
  test('Get a single invoice', async () => {
    const response = await request(app).get('/invoices/1');
    console.log('response from GET /invoices/:id', response);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      invoice: {
        id: expect.any(Number),
        comp_code: 'test',
        amt: 100,
        paid: false,
        add_date: expect.any(String),
        paid_date: null
      }
    });
  });

  test('Respond with 404 for invalid invoice id', async () => {
    const response = await request(app).get('/invoices/1000');
    expect(response.statusCode).toBe(404);
  });
});

// test POST /invoices
describe('POST /invoices', () => {
  test('Create a new invoice', async () => {
    const response = await request(app)
      .post('/invoices')
      .send({ comp_code: 'test', amt: 200 });
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      invoice: {
        id: expect.any(Number),
        comp_code: 'test',
        amt: 200,
        paid: false,
        add_date: expect.any(String),
        paid_date: null
      }
    });
  });
});

// test PUT /invoices/:id
describe('PUT /invoices/:id', () => {
  test('Update a single invoice', async () => {
    const response = await request(app)
      .put('/invoices/1')
      .send({ amt: 300 });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      invoice: {
        id: expect.any(Number),
        comp_code: 'test',
        amt: 300,
        paid: false,
        add_date: expect.any(String),
        paid_date: null
      }
    });
  });

  test('Respond with 404 for invalid invoice id', async () => {
    const response = await request(app)
      .put('/invoices/1000')
      .send({ amt: 300 });
    expect(response.statusCode).toBe(404);
  });
});

// test DELETE /invoices/:id
describe('DELETE /invoices/:id', () => {
  test('Delete a single invoice', async () => {
    const response = await request(app).delete('/invoices/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'deleted' });
  });

  test('Respond with 404 for invalid invoice id', async () => {
    const response = await request(app).delete('/invoices/1000');
    expect(response.statusCode).toBe(404);
  });
});