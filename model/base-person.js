"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataBasePerson = void 0;
const _database_1 = require("./_database");
const moment = require("moment");
exports.dataBasePerson = {
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
            COALESCE(base_person.gender, "") AS 'gender' 
        FROM base_person `;
      let whereClause = ` WHERE 1 `;
      //   if (data.first_name.trim().length > 0) {
      //     let qAll = _database_1.db.escape(
      //       "%" + data.first_name.toLowerCase().trim() + "%"
      //     );
      //     whereClause += ` AND base_person.first_name LIKE ${qAll} `;
      //   }
      //   if (data.last_name.trim().length > 0) {
      //     let qAll = _database_1.db.escape(
      //       "%" + data.last_name.toLowerCase().trim() + "%"
      //     );
      //     whereClause += ` AND base_person.last_name LIKE ${qAll} `;
      //   }
      //   if (data.date_of_birth.trim().length > 0) {
      //     let qAll = _database_1.db.escape(
      //       "%" + data.date_of_birth.toLowerCase().trim() + "%"
      //     );
      //     whereClause += ` AND base_person.date_of_birth LIKE ${qAll} `;
      //   }
      //   if (data.selectionGender.trim().length > 0) {
      //     let qAll = _database_1.db.escape(
      //       "%" + data.selectionGender.toLowerCase().trim() + "%"
      //     );
      //     whereClause += ` AND base_person.selectionGender LIKE ${qAll} `;
      //   }
      //   if (data.citizen.trim().length > 0) {
      //     let qAll = _database_1.db.escape(
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
      _database_1.db.query(queryCount + whereClause, (err0, result) => {
        if (data.direction) {
          whereClause += ` ORDER BY ${data.active} ${data.direction}`;
        }
        if (data.pageSize) {
          whereClause += ` LIMIT ${data.pageOffset}, ${data.pageSize}`;
        }
        _database_1.db.query(query + whereClause, (err, results) => {
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
      _database_1.db.query(
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
      _database_1.db.query(
        `INSERT INTO base_person 
        (
          first_name, 
          last_name,
          date_of_birth,
          gender,
          date_created
        ) VALUES (
          ?,?,?,?,
          NOW()
        )`,
        [data.first_name, data.last_name, data.date_of_birth, data.gender],
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
      _database_1.db.query(
        `UPDATE base_person 
        SET
          first_name=?, 
          last_name=?,
          date_of_birth=?,
          gender=?
        WHERE
          id=?
        `,
        [
          data.first_name,
          data.last_name,
          data.date_of_birth,
          data.gender,
          data.id,
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
      _database_1.db.query(
        `DELETE FROM base_person WHERE id=?`,
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
};
