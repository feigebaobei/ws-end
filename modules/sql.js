var user = {
    // insert:'INSERT INTO users(id, name, age) VALUES(?,?,?)',
    insertUsers:'INSERT INTO users(username, passwordHash, role, name, id_card) VALUES(?,?,?,?,?)',
    insertTestUser:'INSERT INTO test_user(id, name, id_card, address) VALUES(?,?,?,?)',
    insertStudents:'INSERT INTO students(name, gender, project_grade, project, id_card, approval_enterprises, approval_date, cert_number, photo_path) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
    update:'UPDATE users SET name=?, age=? WHERE id=?',
    updateAdmin:'UPDATE users SET role=? WHERE id=?', // for test
    // updateStudentLevelCertUrl:'UPDATE students SET photo_path=? WHERE id=?',
    updateStudentLevelCertUrl:'UPDATE students SET name=?, gender=?, project_grade=?, project=?, id_card=?, approval_enterprises=?, approval_date=?, cert_number=?, photo_path=? WHERE id=?',
    delete: 'DELETE FROM users WHERE id=?',
    queryById: 'SELECT * FROM users WHERE id=?',
    queryByUsername: 'SELECT * FROM users WHERE username=?',
    // queryStudentByName: 'SELECT * FROM students WHERE name=?',
    queryStudentByCertNumber: 'SELECT * FROM students WHERE cert_number=?',
    queryStudentByIdCard: 'SELECT * FROM students WHERE id_card=?',
    queryAll: 'SELECT * FROM users'
};
module.exports = user;