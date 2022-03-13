let mysql = require('mysql')
let mysqlConfig = require('../config/mysql')
const { connect } = require('../routes')
let poolextend = require('./poolextend')
let sql = require('./sql')

let pool = mysql.createPool(poolextend({}, mysqlConfig))

let {log} = console

let userData = {
    add: (req, res, next) => {
        pool.getConnection((err, connection) => {
            // ...
        })
    },
    queryById: (id) => {
        return new Promise((s, j) => {
            pool.getConnection((err, connection) => {
                if (!err) {
                    connection.query(sql.queryById, id, (err, result) => {
                        connection.release() // 释放
                        if (!err) {
                            s(result[0])
                        } else {
                            j(err)
                        }
                    })
                } else {
                    j(err)
                }
            })
        })
    },
    queryByUsername: (username) => {
        return new Promise((s, j) => {
            pool.getConnection((err, connection) => {
                if (!err) {
                    connection.query(sql.queryByUsername, username, (err, result) => {
                        connection.release() // 释放
                        if (!err) {
                            s(result[0])
                        } else {
                            j(err)
                        }
                    })
                } else {
                    j(err)
                }
            })
        })
    },
    // queryStudentByName: (name) => {
    //     return new Promise((s, j) => {
    //         pool.getConnection((err, connection) => {
    //             if (!err) {
    //                 connection.query(sql.queryStudentByName, name, (err, result) => {
    //                     connection.release()
    //                     if (!err) {
    //                         s(result)
    //                     } else {
    //                         j(err)
    //                     }
    //                 })
    //             } else {
    //                 j(err)
    //             }
    //         })
    //     })
    // },
    queryStudentByCertNumber: (certNumber) => {
        return new Promise((s, j) => {
            pool.getConnection((err, connection) => {
                if (!err) {
                    connection.query(sql.queryStudentByCertNumber, certNumber, (err, result) => {
                        connect.release()
                        if (!err) {
                            s(result)
                        } else {
                            j(err)
                        }
                    })
                } else {
                    j(err)
                }
            })
        })
    },
    queryStudentByIdCard: (idCard) => {
        return new Promise((s, j) => {
            pool.getConnection((err, connection) => {
                if (!err) {
                    connection.query(sql.queryStudentByIdCard, idCard, (err, result) => {
                        // result: [{}]
                        connection.release()
                        if (!err) {
                            s(result)
                        } else {
                            j(err)
                        }
                    })
                } else {
                    j(err)
                }
            })
        })
    },
    // for test
    insertTestUser: (username, passwordHash, role = 100, name = '', idCard = '') => {
        // connection.query(sql.insert, [param.id, param.name, param.age], function(err, result) {
        //     if (result) {
        //         result = 'add'
        //     }
        //     // 以json形式，把操作结果返回给前台页面
        //     json(res, result);
        //     // 释放连接 
        //     connection.release();
        // });
        return new Promise((s, j) => {
            pool.getConnection((err, connection) => {
                if (!err) {
                    // username, passwordHash, role, name, idCard
                    connection.query(sql.insertTestUser, [5000, 'name', 123, 'beijing'], (err, result) => {
                        log('insertUsers', err, result)
                        if (!err) {
                            // for test
                            s(result)
                            // if (result) {
                            
                            // }
                        } else {
                            j(err)
                        }
                        connection.release();
                    })
                } else {
                    j(err)
                }
            })
        })
    },
    insertUsers: (username, passwordHash, role = 100, name, idCard) => {
        return new Promise((s, j) => {
            pool.getConnection((err, connection) => {
                if (!err) {
                    connection.query(sql.insertUsers, [username, passwordHash, role, name, idCard], (err, result) => {
                        if (!err) {
                            s(result)
                        } else {
                            j(err)
                        }
                        connection.release();
                    })
                } else {
                    j(err)
                }
            })
        })
    },
    insertStudents: (idCard, levelCertUrl, certNumber) => {
        return new Promise((s, j) => {
            pool.getConnection((err, connection) => {
                if (!err) {
                    connection.query(sql.insertStudents, [idCard, levelCertUrl, certNumber], (err, result) => {
                        if (!err) {
                            s(result)
                        } else {
                            j(err)
                        }
                    })
                } else {
                    j(err)
                }
            })
        })
    },
    update: () => {},
    // for test
    updateAdmin: () => {
        return new Promise((s, j) => {
            pool.getConnection((err, connection) => {
                if (!err) {
                    connection.query(sql.updateAdmin, [1000, 7], (err, result) => {
                        connection.release();
                        if (!err) {
                            s(result)
                        } else {
                            j(err)
                        }
                    })
                } else {
                    j(err)
                }
            })
        })
    },
    updateStudentLevelCertUrl: (levelCertUrl, id) => {
        return new Promise((s, j) => {
            pool.getConnection((err, connection) => {
                if (!err) {
                    connection.query(sql.updateStudentLevelCertUrl, [levelCertUrl, id], (err, result) => {
                        connection.release()
                        if (!err) {
                            s(result)
                        } else {
                            j(err)
                        }
                    })
                } else {
                    j(err)
                }
            })
        })
    },
    delete: () => {}
}

module.exports = userData