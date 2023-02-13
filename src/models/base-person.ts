import { db } from "./_database";
import moment from "moment";

export let queryBasePerson: any = {
  getStatusProperty(row) {
    return {
      status_label: "DEFAULT",
    };
  },
  getAll(data) {
    let _self = this;
    return new Promise((resolve, reject) => {
      let queryCount = `SELECT COUNT(1) AS 'totalCount' FROM base_person `;
      let query = `SELECT 
              base_person.*,
              COALESCE(base_person.gender, "") AS 'gender', base_employee.id as employee_id 
          FROM base_person LEFT JOIN base_employee on (base_person.id = base_employee.person_id) `;
      let whereClause = ` WHERE 1 `;
      if (data.query_employee_id == 1) {
        whereClause += ` AND base_employee.employee_id IS NULL`;
      }
      //   if (data.first_name.t rim().length > 0) {
      //     let qAll = db.escape(
      //       "%" + data.first_name.toLowerCase().trim() + "%"
      //     );
      //     whereClause += ` AND base_person.first_name LIKE ${qAll} `;
      //   }
      //   if (data.last_name.trim().length > 0) {
      //     let qAll = db.escape(
      //       "%" + data.last_name.toLowerCase().trim() + "%"
      //     );
      //     whereClause += ` AND base_person.last_name LIKE ${qAll} `;
      //   }
      //   if (data.date_of_birth.trim().length > 0) {
      //     let qAll = db.escape(
      //       "%" + data.date_of_birth.toLowerCase().trim() + "%"
      //     );
      //     whereClause += ` AND base_person.date_of_birth LIKE ${qAll} `;
      //   }
      //   if (data.selectionGender.trim().length > 0) {
      //     let qAll = db.escape(
      //       "%" + data.selectionGender.toLowerCase().trim() + "%"
      //     );
      //     whereClause += ` AND base_person.selectionGender LIKE ${qAll} `;
      //   }
      //   if (data.citizen.trim().length > 0) {
      //     let qAll = db.escape(
      //       "%" + data.citizen.toLowerCase().trim() + "%"
      //     );
      //     whereClause += ` AND base_person.citizen LIKE ${qAll} `;
      //   }
      // if (data.status) {
      //   whereClause += ` AND base_person.status = '${data.status}' `;
      // }
      // if (data.name) {
      //   let qAll = db.escape("%" + data.name.trim() + "%");
      //   whereClause += ` AND base_person.name LIKE ${qAll} `;
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
          results.map(function (row, index) {
            // row["statusProperty"] = _self.getStatusProperty(row);
            row["date_of_birth"] = moment(row.date_of_birth).format(
              "YYYY-MM-DD"
            );
          });
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
        `SELECT base_person.* FROM base_person WHERE base_person.id=?`,
        [id],
        (err, results) => {
          if (err) {
            console.log("Reject error:", err);
            return reject(err);
          }
          results.map(function (row, index) {
            // row["statusProperty"] = _self.getStatusProperty(row);
            row["date_of_birth"] = moment(row.date_of_birth).format(
              "YYYY-MM-DD"
            );
          });
          return resolve(results[0]);
        }
      );
    });
  },
  insert(data) {
    // console.log("??data: ", data);
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO base_person 
          (
            first_name, 
            last_name,
            date_of_birth,
            gender,
            citizen,
            date_created
          ) VALUES (
            ?,?,?,?,?,
            NOW()
          )`,
        [
          data.first_name,
          data.last_name,
          data.date_of_birth,
          data.gender,
          data.citizen,
        ],
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
    console.log('Employee Data Before Update:', data);
      db.query(
        `UPDATE base_person 
          SET
            first_name=?, 
            last_name=?,
            date_of_birth=?,
            gender=?,
            citizen=?
          WHERE
            id=?
          `,
        [
          data.first_name,
          data.last_name,
          data.date_of_birth,
          data.gender,
          data.citizen,
          data.person_id,
        ],
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
      db.query(`DELETE FROM base_person WHERE id=?`, [id], (err, results) => {
        if (err) {
          console.log("Reject error:", err);
          return reject(err);
        }
        return resolve(results);
      });
    });
  },
};
