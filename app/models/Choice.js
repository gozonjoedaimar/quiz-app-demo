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
      let saveData = _db.prepare(`INSERT INTO choice (question_id,text,is_correct) VALUES (?,?,?)`);
      saveData.run(_data.question_id, _data.text, _data.is_correct, callback) // use this.lastID and this.changes in callback
    }
  });
}

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