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
 * Save quiz
 * @param {Function} callback 
 */
function save(callback) {
  _db.serialize(function() {
    if (typeof _data.id !== 'undefined') {
      let saveData = _db.prepare(`UPDATE quiz SET title = ?, items = ? WHERE id = ${_data.id} AND created_by = ${_data.userID} AND status = 0`);
      saveData.run(_data.title, _data.questions, callback) // use this.lastID and this.changes in callback
    }
    else {
      let saveData = _db.prepare(`INSERT INTO quiz (created_by,title,items) VALUES (?,?,?)`);
      saveData.run(_data.userID, _data.title, _data.questions, callback) // use this.lastID and this.changes in callback
    }
  });
}

/**
 * Publish quiz
 * @param {Function} callback 
 */
function publish(callback) {
  _data.permalink_code = code();
  _db.serialize(function() {
      let saveData = _db.prepare(`UPDATE quiz SET status = 1, permalink = "${_data.permalink_code}" WHERE id = ${_data.id} AND created_by = ${_data.userID} AND status = 0`);
      saveData.run(_data.title, _data.questions, callback) // use this.lastID and this.changes in callback
  });
}

/** Clear model data */
function clean() {
  _data = {};
  return this;
}

/** Generate permalink code */
function code() {
  let characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  let length = 12
  for (let i = length; i > 0; --i) result += characters[Math.round(Math.random() * (characters.length - 1))]
  return result;
}

module.exports = {
  getData, 
  setData,
  save,
  publish,
  clean
}