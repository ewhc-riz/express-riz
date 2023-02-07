import { db } from "./_database";
import moment from "moment";
import { query } from "express";
import { request } from "http";

export let queryBaseEmp: any = {
  getStatusProperty(row) {
    return {
      status_label: "DEFAULT",
    };
  },
  getAll(data) {
    let _self = this;
    return new Promise((resolve, reject) => {
      let queryCount = `SELECT COUNT(1) AS 'totalCount' FROM base_employee `;
      let query = `SELECT  base_employee.id as employee_id, base_person.*, base_employee.* FROM base_person INNER JOIN base_employee ON base_person.id = base_employee.person_id`;
      let whereClause = ` WHERE 1 `;
      //   if (data.first_name.trim().length > 0) {
      //     let qAll = db.escape(
      //       "%" + data.first_name.toLowerCase().trim() + "%"
      //     );
      //     whereClause += ` AND base_employee.first_name LIKE ${qAll} `;
      //   }
      //   if (data.last_name.trim().length > 0) {
      //     let qAll = db.escape(
      //       "%" + data.last_name.toLowerCase().trim() + "%"
      //     );
      //     whereClause += ` AND base_employee.last_name LIKE ${qAll} `;
      //   }
      //   if (data.date_of_birth.trim().length > 0) {
      //     let qAll = db.escape(
      //       "%" + data.date_of_birth.toLowerCase().trim() + "%"
      //     );
      //     whereClause += ` AND base_employee.date_of_birth LIKE ${qAll} `;
      //   }
      //   if (data.selectionGender.trim().length > 0) {
      //     let qAll = db.escape(
      //       "%" + data.selectionGender.toLowerCase().trim() + "%"
      //     );
      //     whereClause += ` AND base_employee.selectionGender LIKE ${qAll} `;
      //   }
      //   if (data.citizen.trim().length > 0) {
      //     let qAll = db.escape(
      //       "%" + data.citizen.toLowerCase().trim() + "%"
      //     );
      //     whereClause += ` AND base_employee.citizen LIKE ${qAll} `;
      //   }
      // if (data.status) {
      //   whereClause += ` AND base_employee.status = '${data.status}' `;
      // }
      // if (data.name) {
      //   let qAll = db.escape("%" + data.name.trim() + "%");
      //   whereClause += ` AND base_employee.name LIKE ${qAll} `;
      // }
      //<< count query >>
      db.query(queryCount + whereClause, (err0, result) => {
        if (data.direction) {
          whereClause += ` ORDER BY ${data.active} ${data.direction}`;
        }
        if (data.pageSize) {
          whereClause += ` LIMIT ${data.pageOffset}, ${data.pageSize}`;
        }
        db.query(query + whereClause, (err, results) => {
          if (err) {
            console.log("Reject error:", err);
            return reject(err);
          }
          // results.map(function (row, index) {
          //   // row["statusProperty"] = _self.getStatusProperty(row);
          //   row["date_of_birth"] = moment(row.date_of_birth).format(
          //     "YYYY-MM-DD"
          //   );
          // });
          return resolve({
            list: results,
            totalCount: result && result[0] ? result[0].totalCount : 0,
          });
        });
      });
    });
  },
  get(id) {
    let _self = this;
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT base_employee.* FROM base_employee WHERE base_employee.id=?`,
        [id],
        (err, results) => {
          if (err) {
            console.log("Reject error:", err);
            return reject(err);
          }
          //   results.map(function (row, index) {
          //     // row["statusProperty"] = _self.getStatusProperty(row);
          //     row["date_of_birth"] = moment(row.date_of_birth).format(
          //       "YYYY-MM-DD"
          //     );
          //   });
          return resolve(results[0]);
        }
      );
    });
  },
  getPerson() {
    let _self = this;
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM base_person INNER JOIN base_employee ON base_person.id = base_employee.person_id`,
        (err, results) => {
          if (err) {
            console.log("Reject error:", err);
            return reject(err);
          }
          // results.map(function (row, index) {
          //   // row["statusProperty"] = _self.getStatusProperty(row);
          //   row["date_of_birth"] = moment(row.date_of_birth).format(
          //     "YYYY-MM-DD"
          //   );
          // });
          return resolve(results[0]);
        }
      );
    });
  },
  insert(data) {
    // console.log("??data: ", data);
    return new Promise((resolve, reject) => {

      let person_id = data.person_id;
      let insertEmployeeId: number;
      if (person_id == "") {
        db.query(
          `INSERT INTO base_person 
                      (
                        first_name,
                        last_name,
                        date_of_birth,
                        gender,
                        citizen,
                        date_created
                      ) 
                      VALUES
                      (
                          ?,
                          ?,
                          ?,
                          ?,
                          ?,
                          NOW()
                      )`, [data.first_name,
        data.last_name,
        moment(data.date_of_birth).format('YYYY-MM-DD'),
        data.gender,
        data.citizen == "on" ? 1 : 0
        ],
          (err, result) => {
            if (err) {
              console.log('Insert Person Error: ', err);
              reject(err);
            }
            person_id = result.insertId;
            console.log('Insert Employee ID: ', person_id);
            //      return resolve(person_id);
            db.query(
              `INSERT INTO base_employee 
                      (
                        person_id,
                        employee_no,
                        date_created
                      ) VALUES (
                        ?,?,
                        NOW()
                      )`,
              [person_id, data.employee_no],
              (err, result) => {
                if (err) {
                  console.log("Insert Employee Error: ", err);
                  return reject(err);
                }
                insertEmployeeId = result.insertId;
                for (let educ of data.employee_educations) {
                  db.query(
                    `INSERT INTO base_employee_education 
                            (
                              employee_id,
                              level,
                              school_name,
                              year_graduated
                            ) VALUES (
                              ?,?,?, ?
                            )`,
                    [insertEmployeeId, educ.level, educ.school_name, educ.year_graduated],
                    (err, result) => {
                      if (err) {
                        console.log("Insert Employee Education Error: ", err);
                        return reject(err);
                      }
                      console.log('Inserted Employee Education of Employee ID :', insertEmployeeId);
                      return resolve(result)  ;  }
                  );
                }
                resolve(insertEmployeeId);
              }
            );
      
  

          })


      }
      if (+person_id > 0)
      {
        db.query(
          `INSERT INTO base_employee 
                  (
                    person_id,
                    employee_no,
                    date_created
                  ) VALUES (
                    ?,?,
                    NOW()
                  )`,
          [person_id, data.employee_no],
          (err, result) => {
            if (err) {
              console.log("Insert Employee Error: ", err);
              return reject(err);
            }
            insertEmployeeId = result.insertId;
            for (let educ of data.employee_educations) {
              db.query(
                `INSERT INTO base_employee_education 
                        (
                          employee_id,
                          level,
                          school_name,
                          year_graduated
                        ) VALUES (
                          ?,?,?, ?
                        )`,
                [insertEmployeeId, educ.level, educ.school_name, educ.year_graduated],
                (err, result) => {
                  if (err) {
                    console.log("Insert Employee Education Error: ", err);
                    return reject(err);
                  }
                  console.log('Inserted Employee Education of Employee ID :', insertEmployeeId);
                  return resolve(result)  ;  }
              );
            }
            resolve(insertEmployeeId);
          }
        );
  
      }
    
     

    });
  },


  update(data) {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE base_employee 
          SET
            person_id=?, 
            employee_no=?,
            date_created=?
          WHERE
            id=?
          `,
        [data.person_id, data.employee_no, data.date_created, data.id],
        (err, results) => {
          if (err) {
            console.log("Reject error:", err);
            return reject(err);
          }
          return resolve(results);
        }
      );
    });
  },
  delete(id) {
    return new Promise((resolve, reject) => {
      db.query(`DELETE FROM base_employee WHERE id=?`, [id], (err, results) => {
        if (err) {
          console.log("Reject error:", err);
          return reject(err);
        }
        return resolve(results);
      });
    });
  },

  getNewEmployeeNo() {
    return new Promise((resolve, reject) => {
      db.query(`SELECT MAX(substring(employee_no, 5, 5)) + 1 as employee_no FROM base_employee `, (err, results) => {
        if (err) {
          console.log("Reject error:", err);
          return reject(err);
        }

        return resolve(results);
      });
    });
  },
  checkPersonIfEmployee(personId) {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM base_employee WHERE person_id = ?`, [personId], (err, results) => {
        if (err) {
          console.log("Reject error:", err);
          return reject(err);
        }

        return resolve(results);
      });
    });
  },


};
