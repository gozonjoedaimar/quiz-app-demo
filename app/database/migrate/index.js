const bcrypt = require('bcrypt');
const { Database } = require('sqlite3');

/**
 * Migrate
 * 
 * @param {Database} db Database connection
 */
function migrate(db) {
  db.serialize(function () {
    db.get("PRAGMA foreign_keys = ON");
    // User table
    db.run(`CREATE TABLE IF NOT EXISTS user (${
      "id INTEGER PRIMARY KEY, " +
      "email TEXT NOT NULL UNIQUE, " +
      "password TEXT NOT NULL, " +
      "verified INTEGER DEFAULT 0, " +
      "CHECK ( LENGTH (email) > 0 AND LENGTH (password) > 0 ) "
    })`);

    // Sample user data
    // const user = db.prepare('INSERT INTO user (email, password) VALUES (?,?)');
    // let password = bcrypt.hashSync("somePassword", 10);
    // user.run("bar@example.com", password);
    // user.run("baz@example.com", password);
    // user.run("bax@example.com", password);
    // user.run("bay@example.com", password);
    // user.finalize();
    // END: Sample user data

    // Quiz table
    db.run(`CREATE TABLE IF NOT EXISTS quiz (${
      "id INTEGER PRIMARY KEY, " +
      "created_by INTEGER NOT NULL, " +
      "title TEXT NOT NULL, " +
      "status INTEGER DEFAULT 0, " +
      "items INTEGER NOT NULL, " +
      "permalink TEXT UNIQUE, " +
      "FOREIGN KEY (created_by) REFERENCES user (id), " +
      "CHECK ( items > 0 AND items <= 20 )"
    })`);

    // Question Type table
    db.run(`CREATE TABLE IF NOT EXISTS question_type (${
      "id INTEGER PRIMARY KEY, " +
      "title TEXT NOT NULL UNIQUE, " +
      "CHECK ( LENGTH (title) > 0 )"
    })`);

    // Question Type data
    const question_type = db.prepare('INSERT INTO question_type (title) VALUES (?)');
    const question_types = [
      'Single correct answer',
      'Multiple correct answer'
    ]
    question_types.map(function(item, index) {
      db.get(`SELECT id FROM question_type WHERE title = '${item}'`, function(err, row) {
        if (!row) {
          question_type.run(item);
        }
        if (index === question_types.length - 1) {
          question_type.finalize();
        }
      })
    })

    // Question table
    db.run(`CREATE TABLE IF NOT EXISTS question (${
      "id INTEGER PRIMARY KEY, " +
      "quiz_id INTEGER NOT NULL, " +
      "question TEXT NOT NULL, " +
      "type INTEGER NOT NULL, " +
      "answers INTEGER NOT NULL, " +
      "FOREIGN KEY (quiz_id) REFERENCES quiz (id), " +
      "FOREIGN KEY (type) REFERENCES question_type (id), " +
      "CHECK ( LENGTH (question) > 0 AND ( answers > 0 AND answers <= 10 ) )"
    })`);

    // Choice table
    db.run(`CREATE TABLE IF NOT EXISTS choice (${
      "id INTEGER PRIMARY KEY, " +
      "question_id INTEGER NOT NULL, " +
      "text TEXT NOT NULL, " +
      "is_correct INTEGER DEFAULT 0, " +
      "FOREIGN KEY (question_id) REFERENCES question (id), " +
      "CHECK ( LENGTH (text) > 0 )"
    })`);

    // Answer Sheet table
    db.run(`CREATE TABLE IF NOT EXISTS answer_sheet (${
      "id INTEGER PRIMARY KEY, " +
      "quiz_id INTEGER NOT NULL, " +
      "FOREIGN KEY (quiz_id) REFERENCES quiz (id) " 
    })`);

    // Answer table
    db.run(`CREATE TABLE IF NOT EXISTS answer (${
      "id INTEGER PRIMARY KEY, " +
      "sheet_id INTEGER NOT NULL, " +
      "question_id INTEGER NOT NULL, " +
      "choice_id INTEGER NOT NULL, " +
      "FOREIGN KEY (sheet_id) REFERENCES answer_sheet (id), " +
      "FOREIGN KEY (question_id) REFERENCES question (id), " +
      "FOREIGN KEY (choice_id) REFERENCES choice (id) "
    })`);

    //
  });
}

module.exports = migrate;