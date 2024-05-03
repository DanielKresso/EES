const express = require('express');
const db = require('./database'); 
const router = express.Router();

function parseGradesSearchQuery(query) {
    const comparisonOperators = ['>', '<', '>=', '<='];
    let operator = '=';
    let value = query;

    comparisonOperators.forEach((op) => {
        if (query.startsWith(op)) {
            operator = op;
            value = query.substring(op.length);
        }
    });

    if (isNaN(value)) {
        throw new Error('Invalid query value: must be a number');
    }

    value = Number(value);

    return { operator, value };
}

router.post('/add', (req, res) => {
    const { grade, teacherName } = req.body;
    const timestamp = new Date().toISOString();

    console.log(req.params)

    if (!grade || isNaN(grade) || grade < 1 || grade > 6) {
        return res.status(400).json({ error: 'Invalid grade: must be an integer from 1 to 6' });
    }

    if (!teacherName || typeof teacherName !== 'string') {
        return res.status(400).json({ error: 'Invalid teacher name: must be a string' });
    }

    db.run('INSERT INTO grades (grade, teacherName, timestamp) VALUES (?, ?, ?)', [grade, teacherName, timestamp], (err) => {
        if (err) {
            res.status(400).json({ error: 'Error in database operation' });
        } else {
            res.json({ message: 'Grade added successfully' });
        }
    });
});

router.get('/list', (req, res) => {
    const { search, after, teacher } = req.query;
    let { page } = req.query;
    const limit = 100;
    page = page && page > 0 ? page : 1;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, grade, teacherName, timestamp FROM grades';
    const queryParams = [];

    try {
        if (search) {
            const { operator, value } = parseGradesSearchQuery(search);
            query += ` WHERE grade ${operator} ?`;
            queryParams.push(value);
        }

        if (teacher) {
            query += queryParams.length > 0 ? ' AND' : ' WHERE';
            query += ' teacherName LIKE ?';
            queryParams.push(`%${teacher}%`);
        }

        if (after) {
            if (isNaN(after)) {
                throw new Error('Invalid after parameter: must be a number');
            }
            query += queryParams.length > 0 ? ' AND' : ' WHERE';
            query += ' id > ?';
            queryParams.push(after);
        }

        query += ' ORDER BY id LIMIT ? OFFSET ?';
        queryParams.push(limit, offset);

        db.all(query, queryParams, (err, rows) => {
            if (err) {
                res.status(400).json({ error: 'Error in database operation' });
            } else {
                res.json({ data: rows, page, limit });
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;