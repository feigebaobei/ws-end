var user = {
    // insert:'INSERT INTO users(id, name, age) VALUES(?,?,?)',
    insertUsers:'INSERT INTO users(username, passwordHash, role, name, idCard) VALUES(?,?,?,?,?)',
    insertTestUser:'INSERT INTO test_user(id, name, idCard, address) VALUES(?,?,?,?)',
    insertStudents:'INSERT INTO students(idCard, levelCertUrl, certNumber) VALUES(?,?,?)',
    update:'UPDATE users SET name=?, age=? WHERE id=?',
    updateAdmin:'UPDATE users SET role=? WHERE id=?', // for test
    updateStudentLevelCertUrl:'UPDATE students SET levelCertUrl=? WHERE id=?',
    delete: 'DELETE FROM users WHERE id=?',
    queryById: 'SELECT * FROM users WHERE id=?',
    queryByUsername: 'SELECT * FROM users WHERE username=?',
    // queryStudentByName: 'SELECT * FROM students WHERE name=?',
    queryStudentByCertNumber: 'SELECT * FROM students WHERE certNumber=?',
    queryStudentByIdCard: 'SELECT * FROM students WHERE idCard=?',
    queryAll: 'SELECT * FROM users'
};
module.exports = user;