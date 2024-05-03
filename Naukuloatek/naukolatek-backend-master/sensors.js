const express = require('express');
const db = require('./database'); 
const router = express.Router();

const sensors = {
    humidity: { value: 50, unit: '%' },
    temperature: { value: 22, unit: '°C' },
    light: { value: 100, unit: 'lux' }
};

function generateRandomData(sensor) {
    switch (sensor) {
        case 'humidity':
            return Math.round((Math.random() * (100 - 30) + 30) * 10) / 10;
        case 'temperature':
            return Math.round((Math.random() * (35 - (-5)) + (-5)) * 10) / 10;
        case 'light':
            return Math.round((Math.random() * (1000 - 0) + 0) * 10) / 10;
        default:
            return 0;
    }
}

router.get('/:sensor/value', (req, res) => {
    const { sensor } = req.params;
    if (sensors[sensor]) {
        db.get('SELECT value, unit FROM sensors WHERE sensor = ? ORDER BY id DESC', [sensor], (err, row) => {
            if (err) {
                res.status(400).json({ error: 'Error in database operation' });
            } else {
                res.json(row || sensors[sensor]);
            }
        });
    } else {
        res.status(404).json({ error: 'Sensor not found' });
    }
});

function parseSearchQuery(query) {
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

router.get('/:sensor/list', (req, res) => {
    const { sensor } = req.params;
    const { search, after } = req.query;
    let { page } = req.query;
    const limit = 100;
    page = page && page > 0 ? page : 1;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, value, unit FROM sensors WHERE sensor = ?';
    const queryParams = [sensor];

    try {
        if (search) {
            const { operator, value } = parseSearchQuery(search);
            query += ` AND value ${operator} ?`;
            queryParams.push(value);
        }

        if (after) {
            if (isNaN(after)) {
                throw new Error('Invalid after parameter: must be a number');
            }
            query += ' AND id > ?';
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

router.get('/list', (req, res, next) => {
    const query = 'SELECT DISTINCT sensor, unit FROM sensors';

    db.all(query, [], (err, rows) => {
        if (err) {
            return next({ statusCode: 400, message: 'Error in database operation' });
        }
        res.json({ sensors: rows });
    });
});

router.post('/:sensor/value', (req, res) => {
    const { sensor } = req.params;
    const { value } = req.body;
    if (sensors[sensor] && value !== undefined) {
        const isDummy = 0; 
        const unit = sensors[sensor].unit;
        db.run('INSERT INTO sensors (sensor, isDummy, value, unit) VALUES (?, ?, ?, ?)', [sensor, isDummy, value, unit], (err) => {
            if (err) {
                res.status(400).json({ error: 'Error in database operation' });
            } else {
                sensors[sensor].value = value; 
                res.json({ message: `${sensor} sensor value updated to ${value}${unit}` });
            }
        });
    } else {
        res.status(400).json({ error: 'Invalid sensor name or value' });
    }
});

setInterval(() => {
    Object.keys(sensors).forEach(sensor => {
      const newValue = generateRandomData(sensor);
      sensors[sensor].value = newValue;
      const isDummy = 1; 
      const unit = sensors[sensor].unit;
      db.run('INSERT INTO sensors (sensor, isDummy, value, unit) VALUES (?, ?, ?, ?)', [sensor, isDummy, newValue, unit], (err) => {
        if (err) {
          console.error('Error inserting data into the database');
        } else {
          console.log(`${sensor} sensor value updated to ${newValue}${unit} in the database`);
        }
      });
    });
  }, 10000);


module.exports = router;