import { db } from "./_database";
import moment from "moment";


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
      let query = `SELECT 
                    base_employee.*,
                    base_employee.id as employee_id, 
                    base_person.first_name,
                    base_person.last_name,
                    base_person.date_of_birth,
                    base_person.gender,
                    base_person.citizen,   
                    DATE_FORMAT(base_person.date_of_birth, '%Y-%m-%d') AS date_of_birth, 
                    COALESCE(_education.educ_years, '--') AS educ_years,
                    COALESCE(_education.levels, '--') AS educ_levels,
                  FROM base_employee 
                  LEFT JOIN base_person 
                    ON base_person.id = base_employee.person_id
                  LEFT JOIN (
                    SELECT
                      _education.employee.id,
                      CONCAT(MIN(educ.year_graduated), '-', MAX(educ.year_graduated)) AS educ_years,
                      GROUP_CONCAT(DISTINCT _education.level) AS educ_levels
                    FROM base_employee_education _education
                    WHERE _education.is_delete = 0
                    GROUP BY _education.employee.id
                  ) _education
                  LEFT JOIN base_employee_education  educ on (base_employee.id = educ.employee_id AND educ.is_deleted = 0)
       `;

      let whereClause = ` WHERE 1 `;
      if (data.employeeId > 0) {
        whereClause += ` AND base_employee.id = ${data.employeeId}`
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
        });
      });
    });
  },
  getEmployeeEducation(employeeId: number) {
    return new Promise((resolve, reject) => {
      let queryCount = `SELECT COUNT(1) AS 'totalCount' FROM base_employee `;
      let query = `
        SELECT  
          id, 
          level, 
          school_name, 
          year_graduated
        FROM 
          base_employee_education `;

      let whereClause = ` WHERE 1 AND employee_id=${employeeId} AND is_deleted = 0`;

      db.query(query + whereClause, (err, results) => {
        if (err) {
          console.log("Reject error:", err);
          return reject(err);
        }
        return resolve({
          list: results
        });
      });
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
      console.log('Person ID:', person_id)
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
                  if(+educ.for_deletion == 0) {
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
                        return resolve(result);
                      }
                    );
   
                  }
                  
                }
                resolve(insertEmployeeId);
              }
            );
          })


      }


    });
  },


  update(data) {
    return new Promise((resolve, reject) => {

      db.query(`UPDATE base_person 
                 SET first_name=?, last_name=?, date_of_birth=?, gender=?, citizen=?
                 WHERE id = ?`,
        [data.first_name, data.last_name, 
          moment(data.date_of_birth).format('YYYY-MM-DD'), data.gender, data.citizen == 'on' ? 1 : 0,
        data.person_id],
        (err, result) => {
          if (err) {
            console.log("Update Person Info Error: ", err.message);
            reject(err);
          }
          return resolve(result);
        });
      for (let educ of data.employee_educations) {
          if(educ.id > 0) {

              if(educ.for_deletion == 0) {
                db.query(`UPDATE base_employee_education 
                SET level = ?, school_name = ?, year_graduated = ? 
                WHERE id = ?`,
                [educ.level, educ.school_name, educ.year_graduated, educ.id],
                (err, result) => {
                  if(err) {
                    console.log('Update Education Error : ', err.message);
                  }
                  return resolve(result);
                })
              }
              else {
                db.query(`UPDATE base_employee_education SET is_deleted = 1 WHERE id=?`, [educ.id], 
                (err, result) => {
                  if(err) {
                    console.log('Education Deletion Error: ', err.message);
                    return reject(err);
                  }
                  else {
                    return resolve(result);
                  }
                })
              }
          }
          else {

            if(educ.for_deletion == 0) {
              db.query(`INSERT INTO base_employee_education (employee_id, level, school_name, year_graduated) 
              VALUES(?, ?, ?, ?) `, [data.id, educ.level, educ.school_name, educ.year_graduated],
              (err, result) => {
                if(err) {
                  console.log('Insert New Education Error : ', err.message);
                }
                return resolve(result);
              })

            }
     }
      }
      return resolve({status : 1, message: 'Successfully updated Employee Info.'});
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
