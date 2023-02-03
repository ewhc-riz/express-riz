import { db } from "./_database";
import moment from "moment";

export let queryBaseEmpEd: any = {
  getStatusProperty(row) {
    return {
      status_label: "DEFAULT",
    };
  },
  getAll(data) {
    let _self = this;
    return new Promise((resolve, reject) => {
      let queryCount = `SELECT COUNT(1) AS 'totalCount' FROM base_employee_education `;
      let query = `SELECT 
                        base_employee_education.*, base_employee.*, base_person.*, base_employee_education.id as base_employee_education_id
                        FROM base_employee_education 
                        INNER JOIN base_employee ON (base_employee.id = base_employee_education.employee_id)
                        INNER JOIN base_person ON (base_person.id = base_employee.person_id)
                        `;
      let whereClause = ` WHERE 1 `;
      //   if (data.first_name.trim().length > 0) {
      //     let qAll = db.escape(
      //       "%" + data.first_name.toLowerCase().trim() + "%"
      //     );
      //     whereClause += ` AND base_employee_education.first_name LIKE ${qAll} `;
      //   }
      //   if (data.last_name.trim().length > 0) {
      //     let qAll = db.escape(
      //       "%" + data.last_name.toLowerCase().trim() + "%"
      //     );
      //     whereClause += ` AND base_employee_education.last_name LIKE ${qAll} `;
      //   }
      //   if (data.date_of_birth.trim().length > 0) {
      //     let qAll = db.escape(
      //       "%" + data.date_of_birth.toLowerCase().trim() + "%"
      //     );
      //     whereClause += ` AND base_employee_education.date_of_birth LIKE ${qAll} `;
      //   }
      //   if (data.selectionGender.trim().length > 0) {
      //     let qAll = db.escape(
      //       "%" + data.selectionGender.toLowerCase().trim() + "%"
      //     );
      //     whereClause += ` AND base_employee_education.selectionGender LIKE ${qAll} `;
      //   }
      //   if (data.citizen.trim().length > 0) {
      //     let qAll = db.escape(
      //       "%" + data.citizen.toLowerCase().trim() + "%"
      //     );
      //     whereClause += ` AND base_employee_education.citizen LIKE ${qAll} `;
      //   }
      // if (data.status) {
      //   whereClause += ` AND base_employee_education.status = '${data.status}' `;
      // }
      // if (data.name) {
      //   let qAll = db.escape("%" + data.name.trim() + "%");
      //   whereClause += ` AND base_employee_education.name LIKE ${qAll} `;
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
