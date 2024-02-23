// Imports & Configuration
const express = require('express');
const router = new express.Router();
const db = require('../db');
const ExpressError = require('../expressError');    

// Routes
// GET /companies
router.get('/companies', async (req, res, next) => {
// use try/catch to handle errors
  try {
    // use db.query to get all companies
    const results = await db.query(`SELECT * FROM companies`);
    // return the companies as JSON
    return res.json({ companies: results.rows });
  } catch (e) {
    return next(e);
  }
});

// GET /companies/:code
router.get('/companies/:code', async (req, res, next) => {
  try {
    // use db.query to get a single company by code
    const { code } = req.params;
    const companyResults = await db.query(
      `SELECT * FROM companies WHERE code = $1`,
      [code]
    );
    // if the company is not found, throw a 404 error
    if (companyResults.rows.length === 0) {
      throw new ExpressError(`No such company: ${code}`, 404);
    }
    // return the company as JSON
    const company = companyResults.rows[0];
    return res.json({ company });
  } catch (e) {
    return next(e);
  }
});

// POST /companies
router.post('/companies', async (req, res, next) => {
  try {
    // use db.query to create a new company
    const { code, name, description } = req.body;
    const results = await db.query(
      `INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`,
      [code, name, description]
    );
    // return the new company as JSON
    return res.status(201).json({ company: results.rows[0] });
  } catch (e) {
    return next(e);
  }
});

// PUT /companies/:code
router.put('/companies/:code', async (req, res, next) => {
  try {
    // use db.query to update a company
    const { code } = req.params;
    const { name, description } = req.body;
    const results = await db.query(
      `UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description`,
      [name, description, code]
    );
    // if the company is not found, throw a 404 error
    if (results.rows.length === 0) {
      throw new ExpressError(`No such company: ${code}`, 404);
    }
    // return the updated company as JSON
    return res.json({ company: results.rows[0] });
  } catch (e) {
    return next(e);
  }
});

// DELETE /companies/:code
router.delete('/companies/:code', async (req, res, next) => {
  try {
    // use db.query to delete a company
    const { code } = req.params;
    const results = await db.query(
      `DELETE FROM companies WHERE code=$1 RETURNING code`,
      [code]
    );
    // if the company is not found, throw a 404 error
    if (results.rows.length === 0) {
      throw new ExpressError(`No such company: ${code}`, 404);
    }
    // return a message as JSON
    return res.json({ status: 'deleted' });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;