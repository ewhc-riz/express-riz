import { db } from "./_database";
import moment from "moment";

export let queryBaseEmployeeEducation: any = {
  getStatusProperty(row) {
    return {
      status_label: "DEFAULT",
    };
  },
  getAll(data) {
    let _self = this;
    return new Promise((resolve, reject) => {
      let queryCount = `SELECT COUNT(1) AS 'totalCount' FROM base_employee_education `;
      let query = `
        SELECT 
          base_employee_education.*, 
          base_employee.employee_no, 
          base_employee.date_hired, 
          base_person.first_name, 
          base_person.last_name, 
          base_person.date_of_birth, 
          base_employee_education.id AS 'base_employee_education_id'
        FROM base_employee_education 
        INNER JOIN base_employee 
          ON (base_employee.id = base_employee_education.employee_id)
        INNER JOIN base_person 
          ON (base_person.id = base_employee.person_id)
                        `;
      let whereClause = ` WHERE 1 `;
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
          return resolve({
            list: results,
            totalCount: result && result[0] ? result[0].totalCount : 0,
          });
        });
      });
    });
  },
  getEducation(id) {
    let _self = this;

    return new Promise((resolve, reject) => {
      db.query(
        `SELECT base_employee_education.* FROM base_employee_education WHERE base_employee_education.id=?`,
        [id],
        (err, results) => {
          if (err) {
            console.log("Reject error:", err);
            return reject(err);
          }
          //console.log(results);
          return resolve(results[0]);
        }
      );
    });
  },
  insert(data) {
    // console.log("??data: ", data);
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO base_employee_education 
          (
            employee_id, 
            level,
            school_name,
            year_graduated,
            date_created
          ) VALUES (
            ?,?,?,?,
            NOW()
          )`,
        [data.employee_id, data.level, data.school_name, data.year_graduated],
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
  update(data) {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE base_employee_education 
          SET
            level = ?,
            school_name = ?,
            year_graduated = ?
            
            WHERE
            id=?
          `,
        [data.level, data.school_name, data.year_graduated, data.id],
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
      db.query(
        `DELETE FROM base_employee_education WHERE id=?`,
        [id],
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

  checkEducationIfExists(employee_id: number, level: string) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM base_employee_education WHERE employee_id = ? AND level = ?`,
        [employee_id, level],
        (err, results) => {
          if (err) {
            console.log("Reject error:", err);
            return reject(err);
          }
          if (results.length > 0) {
            return resolve(true);
          } else {
            return resolve(false);
          }
        }
      );
    });
  },
};
