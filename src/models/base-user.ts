import { db } from "./_database";
import moment from "moment";
import { query } from "express";
import { request } from "http";

export let queryBaseUser: any = {
  getStatusProperty(row) {
    return {
      status_label: "DEFAULT",
    };
  },
  getAll(data) {
    let _self = this;
    return new Promise((resolve, reject) => {
      let queryCount = `SELECT COUNT(1) AS 'totalCount' FROM base_user `;
      let query = `SELECT 
            base_user.* 
            FROM base_user`;
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
        `SELECT base_user.* FROM base_user WHERE base_user.id=?`,
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
        `SELECT id, person_id FROM base_user ORDER by person_id DESC`,
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
      db.query(
        `INSERT INTO base_user 
              (
                person_id,
                username,
                password,
                date_created
              ) VALUES (
                ?,?,?,
                NOW()
              )`,
        [data.person_id, data.username, data.password],
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
        `UPDATE base_user 
          SET
            person_id=?, 
            username=?,
            password=?,
            date_created=?
          WHERE
            id=?
          `,
        [data.person_id, data.username, data.password, data.date_created, data.id],
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
      db.query(`DELETE FROM base_user WHERE id=?`, [id], (err, results) => {
        if (err) {
          console.log("Reject error:", err);
          return reject(err);
        }
        return resolve(results);
      });
    });
  },
};
