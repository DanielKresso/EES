const sqlite3 = require('sqlite3').verbose();
const dbName = 'sensorsData.db';
let db = new sqlite3.Database(dbName, (err) => {
  if (err) {
    console.error('Error opening database ' + err.message);
  } else {
    db.run('CREATE TABLE sensors (\
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
      sensor TEXT NOT NULL,\
      isDummy INTEGER NOT NULL,\
      value REAL NOT NULL,\
      unit TEXT NOT NULL\
    )', (err) => {
      if (err) {
        console.log('Table already exists.');
      }
    });
    db.run('CREATE TABLE IF NOT EXISTS grades (\
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
      grade INTEGER NOT NULL,\
      teacherName TEXT NOT NULL,\
      timestamp TEXT NOT NULL\
    )', (err) => {
      if (err) {
        console.error('Error creating grades table: ' + err.message);
      }
    });
  }
});

module.exports = db;