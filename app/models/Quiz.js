const sqlite3 = require('sqlite3')

/** @type {sqlite3.Database} */
let _db = db;

let _data = {}

function getData(name) {
  return _data[name];
}

/**
 * Set data
 * @param {Object} data 
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

function publish(callback) {
  _db.serialize(function() {
      let saveData = _db.prepare(`UPDATE quiz SET status = 1 WHERE id = ${_data.id} AND created_by = ${_data.userID} AND status = 0`);
      saveData.run(_data.title, _data.questions, callback) // use this.lastID and this.changes in callback
  });
}

function clean() {
  _data = {};
  return this;
}

module.exports = {
  getData, 
  setData,
  save,
  publish,
  clean
}