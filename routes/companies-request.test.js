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

// Test GET /companies
describe('GET /companies', () => {
  test('Get a list with one company', async () => {
    // Send GET request to /companies
    const res = await request(app).get('/companies');
    // Check the response is successful with the expected data
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ companies: [{ code: 'test', name: 'Test Company', description: 'This is a test company' }] });
  });
});

// Test GET /companies/:code
describe('GET /companies/:code', () => {
  test('Get a single company', async () => {
    // Send GET request to /companies/test
    const res = await request(app).get('/companies/test');
    // Check the response is successful with the expected data
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      company: {
        code: 'test',
        name: 'Test Company',
        description: 'This is a test company',
      }
    });
  });

  test('Respond with 404 for invalid company code', async () => {
    // Send GET request to /companies/invalid
    const res = await request(app).get('/companies/invalid');
    // Check the response is 404
    expect(res.statusCode).toBe(404);
  });
});

// Test POST /companies
describe('POST /companies', () => {
  test('Create a new company', async () => {
    // Send POST request to /companies
    const res = await request(app)
      .post('/companies')
      .send({ code: 'new', name: 'New Company', description: 'This is a new company' });
    // Check the response is successful with the expected data
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ company: { code: 'new', name: 'New Company', description: 'This is a new company' } });
  });
});

// Test PUT /companies/:code
describe('PUT /companies/:code', () => {
  test('Update a company', async () => {
    // Send PUT request to /companies/test
    const res = await request(app)
      .put('/companies/test')
      .send({ name: 'Updated Company', description: 'This is an updated company' });
    // Check the response is successful with the expected data
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ company: { code: 'test', name: 'Updated Company', description: 'This is an updated company' } });
  });

  test('Respond with 404 for invalid company code', async () => {
    // Send PUT request to /companies/invalid
    const res = await request(app).put('/companies/invalid');
    // Check the response is 404
    expect(res.statusCode).toBe(404);
  });
});

// Test DELETE /companies/:code
describe('DELETE /companies/:code', () => {
  test('Delete a company', async () => {
    // Send DELETE request to /companies/test
    const res = await request(app).delete('/companies/test');
    // Check the response is successful with the expected data
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'deleted' });
  });

  test('Respond with 404 for invalid company code', async () => {
    // Send DELETE request to /companies/invalid
    const res = await request(app).delete('/companies/invalid');
    // Check the response is 404
    expect(res.statusCode).toBe(404);
  });
});