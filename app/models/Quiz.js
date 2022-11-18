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
  count_question_choices().then(function(no_correct_answers) {
    if (no_correct_answers > 0) {
      let reason = 'all questions must have an answer';
      console.log(reason);
      callback.call({ changes: 0, reason });
    }
    else {
      _db.serialize(function() {
        let saveData = _db.prepare(`UPDATE quiz SET status = 1, permalink = "${_data.permalink_code}" WHERE id = ${_data.id} AND created_by = ${_data.userID} AND status = 0`);
        saveData.run(_data.title, _data.questions, callback) // use this.lastID and this.changes in callback
    });
    }
  });
}

/**
 * Count questions
 */
function count_questions(callback) {
  if (typeof _data.id !== 'undefined') {
    _db.get(`SELECT COUNT(id) as count FROM question WHERE quiz_id = ${_data.id}`, function(err, row) {
      if (err) {
        console.log(err.message);
      }
      console.log(row);
      callback(row.count);
    })
  }
  return callback(0);
}

/**
 * Count correct choices
 * @param {Number} question_id
 * @param {Function} callback
 */
 function count_choices(question_id, callback) {
  if (typeof _data.id !== 'undefined') {
    _db.get(`SELECT COUNT(id) as count FROM choice WHERE question_id = ${question_id} AND is_correct = 1`, function(err, row) {
      if (err) {
        console.log(err.message);
      }
      console.log(row);
      callback(row.count);
    })
  }
  return callback(0);
}

/**
 * List questions and count correct answers [Edit/Publish checking]
 */
const count_question_choices = () => new Promise(function(resolve, reject) {
  if (typeof _data.id !== 'undefined') {
    let query = `SELECT q.id, q.text, COUNT(c.is_correct) AS correct_answers ${
      `FROM question q ` +
      `LEFT JOIN choice c ` +
      `ON c.question_id = q.id ` +
      `AND c.is_correct = 1 ` +
      `WHERE q.quiz_id = ? ` +
      `GROUP BY q.id`
    }`;
    const no_correct_answer = [];
    _db.each(query, _data.id, function(err, row){
      console.log({t: row.correct_answers, x: row.correct_answers == 0});
      if(row.correct_answers == 0) no_correct_answer.push(row)
    }, function(err, rows) {
      if (err) {
        reject(err);
      }
      // console.log({r:rows});
      // console.log({a:no_correct_answer.length});
      let no_correct_answers = (rows < 1) ? 999 : no_correct_answer.length;
      resolve(no_correct_answers);
    })
    return;
  }
  reject("no id set");
});

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