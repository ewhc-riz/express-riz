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
                    emp.id as employee_id, 
                    emp.id as id,
                    emp.employee_no,
                    DATE_FORMAT(emp.date_hired, '%Y-%m-%d') AS date_hired, 
                    person.id as person_id,
                    person.first_name,
                    person.last_name,
                    person.gender,
                    person.citizen,   
                    DATE_FORMAT(person.date_of_birth, '%Y-%m-%d') AS date_of_birth, 
                    COALESCE(_education.years, '--') AS educ_years,
                    COALESCE(_education.levels, '--') AS educ_levels
                  FROM base_employee emp
                  LEFT JOIN base_person person
                       ON (person.id = emp.person_id)
                  LEFT JOIN (
                    SELECT
                      _education.employee_id,
                      CONCAT(MIN(_education.year_graduated), '-', MAX(_education.year_graduated)) AS years,
                      GROUP_CONCAT(DISTINCT _education.level) AS levels
                    FROM base_employee_education _education
                    WHERE _education.is_deleted = 0
                    GROUP BY _education.employee_id
                  ) _education 
                  ON _education.employee_id = emp.id
       `;

      let whereClause = ` WHERE 1 `;
      if (data.employeeId > 0) {
        whereClause += ` AND emp.id = ${data.employeeId}`;
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
          list: results,
        });
      });
    });
  },

  // getPerson() {
  //   let _self = this;
  //   return new Promise((resolve, reject) => {
  //     db.query(
  //       `SELECT * FROM base_person INNER JOIN base_employee ON base_person.id = base_employee.person_id`,
  //       (err, results) => {
  //         if (err) {
  //           console.log("Reject error:", err);
  //           return reject(err);
  //         }
  //         // results.map(function (row, index) {
  //         //   // row["statusProperty"] = _self.getStatusProperty(row);
  //         //   row["date_of_birth"] = moment(row.date_of_birth).format(
  //         //     "YYYY-MM-DD"
  //         //   );
  //         // });
  //         return resolve(results[0]);
  //       }
  //     );
  //   });
  // },
  insert(data) {
    // console.log("??data: ", data);
    return new Promise((resolve, reject) => {
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
        [data.person_id,
        data.employee_no],
        (err, result) => {
          if (err) {
            console.log("Insert Employee Error: ", err);
            return reject(err);
          }
          resolve(result);
        }
      );
    });
  },

  update(data) {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE base_employee 
                  SET date_hired = ?
                  WHERE id = ?`, 
                  [data.date_hired, data.id],
                  (err, result) => {
                    if(err) {
                      console.log('Update Employee Info Error:', err.message);
                      return reject(err);
                    }
                    return resolve(result);
                  });
    })
  }
  ,
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
      db.query(
        `SELECT MAX(substring(employee_no, 5, 5)) + 1 as employee_no FROM base_employee `,
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
  checkPersonIfEmployee(personId) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM base_employee WHERE person_id = ?`,
        [personId],
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
  insertEducation(data) {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO base_employee_education 
          (
            employee_id,
            level,
            school_name,
            year_graduated
          ) VALUES (
            ?,?,?,?
          )`,
        [data.employee_id, data.level, data.school_name, data.year_graduated],
        (err, result) => {
          if (err) {
            console.log("Insert Employee Education Error: ", err);
            return reject(err);
          }
          console.log(
            "Inserted Employee Education of Employee ID :",
            data.employee_id
          );
          return resolve(result);
        }
      );
    });
  },

  updateEducation(data: any) {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE base_employee_education 
          SET level = ?, school_name = ?, year_graduated = ?, is_deleted = ? 
          WHERE id = ?`,
        [data.level, data.school_name, data.year_graduated, data.for_deletion, data.id],
        (err, result) => {
          if (err) {
            console.log("Update Education Error : ", err.message);
            reject(err);
          }
          return resolve(result);
        }
      );

    });

  }
};
