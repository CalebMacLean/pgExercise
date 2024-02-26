// Imports and Configurations
const express = require('express');
const router = new express.Router();
const db = require('../db');
const ExpressError = require('../expressError');

// Routes
// GET /invoices
router.get('/', async (req, res, next) => {
// use try/catch to handle errors
  try {
    // use db.query to get all invoices
    const results = await db.query(`SELECT * FROM invoices`);
    // return the invoices as JSON
    return res.json({ invoices: results.rows });

  } catch (e) {
    return next(e);
  }
});

// GET /invoices/:id
router.get('/:id', async (req, res, next) => {
  try {
    // use req.params to get the id
    const { id } = req.params;
    const invoiceResults = await db.query(
      `SELECT * FROM invoices WHERE id = $1`,
      [id]
    );
    const invoice = invoiceResults.rows[0];
    // console.log("invoice",invoice);
    // if the invoice is not found, throw a 404 error
    if (invoiceResults.rows.length === 0) {
      throw new ExpressError(`No such invoice: ${id}`, 404);
    }
    // return the invoice as JSON
    return res.json({ invoice });

  } catch (e) {
    return next(e);
  }
});

// POST /invoices
router.post('/', async (req, res, next) => {
  try {
    // use req.body to get the required data
    const { comp_code, amt } = req.body;
    const results = await db.query(
      `INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [comp_code, amt]
    );
    // return the new invoice as JSON
    return res.status(201).json({ invoice: results.rows[0] });

  } catch (e) {
    return next(e);
  }
});

// PUT /invoices/:id
router.put('/:id', async (req, res, next) => {
  try {
    // use req.params to get the id and req.body to get the required data
    const { id } = req.params;
    const { amt } = req.body;
    const results = await db.query(
      `UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [amt, id]
    );
    // if the invoice is not found, throw a 404 error
    if (results.rows.length === 0) {
      throw new ExpressError(`No such invoice: ${id}`, 404);
    }
    // return the updated invoice as JSON
    return res.json({ invoice: results.rows[0] });

  } catch (e) {
    return next(e);
  }
});

// DELETE /invoices/:id
router.delete('/:id', async (req, res, next) => {
  try {
    // use req.params to get the id
    const { id } = req.params;
    const results = await db.query(
      `DELETE FROM invoices WHERE id=$1 RETURNING id`,
      [id]
    );
    // if the invoice is not found, throw a 404 error
    if (results.rows.length === 0) {
      throw new ExpressError(`No such invoice: ${id}`, 404);
    }
    // return a message as JSON
    return res.json({ status: "deleted" });

  } catch (e) {
    return next(e);
  }
});

module.exports = router;