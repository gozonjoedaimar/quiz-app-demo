/**
 * Question Model
 * app/models/Question.js
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
      let saveData = _db.prepare(`UPDATE question SET text = ?, type = ?, choices = ? WHERE id = ${_data.id} AND quiz_id = ${_data.quiz_id}`);
      saveData.run(_data.question, _data.type, _data.choices, callback) // use this.lastID and this.changes in callback
    }
    else {
      let saveData = _db.prepare(`INSERT INTO question (quiz_id,text,type,choices) VALUES (?,?,?,?)`);
      saveData.run(_data.quiz_id, _data.question, _data.type, _data.choices, callback) // use this.lastID and this.changes in callback
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