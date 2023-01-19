import { db } from "./_database";

export let dataBasePerson: any = {
 
  getStatusProperty(row: any): any {
    return {
      status_label: "DEFAULT",
    };
  },

  getAll(data: any) {
    let _self = this;
    return new Promise((resolve, reject) => {
      let queryCount = `SELECT COUNT(1) AS 'totalCount' FROM base_person `;
      let query = `SELECT base_person.* FROM base_person `;
      let whereClause = ` WHERE 1 `;

      if (data.firstname.trim().length > 0) {
        let qAll = db.escape("%" + data.firstname.toLowerCase().trim() + "%");
        whereClause += ` AND base_person.first_name LIKE ${qAll} `;
      }
      if (data.lastname.trim().length > 0) {
        let qAll = db.escape("%" + data.lastname.toLowerCase().trim() + "%");
        whereClause += ` AND base_person.last_name LIKE ${qAll} `;
      }
      

      // if (data.status) {
      //   whereClause += ` AND base_person.status = '${data.status}' `;
      // }

      // if (data.name) {
      //   let qAll = db.escape("%" + data.name.trim() + "%");
      //   whereClause += ` AND base_person.name LIKE ${qAll} `;
      // }

      //<< count query >>
      db.query(queryCount + whereClause, (err0: any, result: any) => {
        if (data.direction) {
          whereClause += ` ORDER BY ${data.active} ${data.direction}`;
        }

        if (data.pageSize) {
          whereClause += ` LIMIT ${data.pageOffset}, ${data.pageSize}`;
        }

        db.query(query + whereClause, (err: any, results: any[]) => {
          if (err) {
            console.log("Reject error:", err);
            return reject(err);
          }

          results.map(function (row: any, index: number) {
            row["statusProperty"] = _self.getStatusProperty(row);
          });

          return resolve({
            list: results,
            totalCount: result && result[0] ? result[0].totalCount : 0,
          });
        });
      });
    });
  },

  get(id: number) {
    let _self = this;
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT base_person.* FROM base_person WHERE base_person.id=?`,
        [id],
        (err: any, results: any[]) => {
          if (err) {
            console.log("Reject error:", err);
            return reject(err);
          }

          results.map(function (row: any, index: number) {
            row["statusProperty"] = _self.getStatusProperty(row);
          });
          return resolve(results[0]);
        }
      );
    });
  },

  insert(data: any) {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO base_person 
        (
          firstname, 
          lastname 
        ) VALUES (
          ?,?
        )`,
        [data.firstname, data.lastname ],
        (err: any, results: any) => {
          if (err) {
            console.log("Reject error:", err);
            return reject(err);
          }
          return resolve(results);
        }
      );
    });
  },

  update(data: any) {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE base_person 
        SET
          firstname=?, 
          lastname=?
        WHERE
          id=?
        `,
        [
          data.firstname,
          data.lastname,
          data.id
        ],
        (err: any, results: any) => {
          if (err) {
            console.log("Reject error:", err);
            return reject(err);
          }
          return resolve(results);
        }
      );
    });
  },

  delete(id: number) {
    // TODO
    return new Promise((resolve, reject) => {
      db.query(
        `DELETE FROM base_person 
         WHERE id=?
        `,
        [
          id
        ],
        (err: any, results: any) => {
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