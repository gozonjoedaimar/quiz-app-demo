/**
 * Choice Model
 * app/models/Choice.js
 */
const sqlite3 = require('sqlite3')

/** @type {sqlite3.Database} used for autocompletion */
let _db = db;

/** Model data */
let _data = {}

/**
 * Get model data
 * @param {string} name 
 * @returns {string}   
 */
function getData(name) {
  return _data[name];
}

/**
 * Set data
 * @param {Object|string} name 
 * @param {string} value optional if first param is an object
 */
function setData(name, value) {
  if (typeof name === 'object') {
    _data = { ..._data, ...name }
  }
  else {
    _data[name] = value;
  }
  return this;
}

/**
 * Save
 * @param {Function} callback 
 */
function save(callback) {
  _db.serialize(function() {
    if (typeof _data.id !== 'undefined') {
      let saveData = _db.prepare(`UPDATE choice SET text = ?, is_correct = ? WHERE id = ${_data.id} AND question_id = ${_data.question_id}`);
      saveData.run(_data.text, _data.is_correct, callback) // use this.lastID and this.changes in callback
    }
    else {
      check_add().then(function() {
        let saveData = _db.prepare(`INSERT INTO choice (question_id,text,is_correct) VALUES (?,?,?)`);
        saveData.run(_data.question_id, _data.text, _data.is_correct, callback) // use this.lastID and this.changes in callback
      })
      .catch(function(e) {
        console.log(e);
        callback.call({ changes: 0, reason: 'Limit reached' });
      })
    }
  });
}

/**
 * Check add
 */
const check_add = () => new Promise(function(resolve, reject) {
  const query = `SELECT q.id, q.text, q.choices, COUNT(c.id) count ${
    `FROM question q ` +
    `LEFT JOIN choice c ` +
    `ON q.id = c.question_id ` +
    `WHERE q.id = ${_data.question_id} ` +
    `GROUP BY q.id `
  }`;
  db.get(query, function(err, row) {
    if (err) {
      reject(err)
    }
    if (row.id) {
      if (row.choices > row.count) {
        resolve()
      }
      else{
        reject()
      }
    }
    else {
      reject('no data')
    }
  })
});

/** Clear model data */
function clean() {
  _data = {};
  return this;
}

module.exports = {
  getData, 
  setData,
  save,
  clean
}