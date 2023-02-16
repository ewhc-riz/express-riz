import { db } from "./_database";
import moment from "moment";

export let queryBaseEmployee: any = {
  getStatusProperty(row) {
    return {
      status_label: "DEFAULT",
    };
  },

  getAll(data) {
    let _self = this;
    return new Promise((resolve, reject) => {
      let queryCount = `SELECT COUNT(1) AS 'totalCount' FROM base_employee `;
      let query = `
        SELECT 
          base_employee.id as employee_id, 
          base_employee.id as id,
          base_employee.employee_no,
          DATE_FORMAT(base_employee.date_hired, '%Y-%m-%d') AS date_hired, 
          person.id as person_id,
          person.first_name,
          person.last_name,
          person.gender,
          person.citizen,   
          DATE_FORMAT(person.date_of_birth, '%Y-%m-%d') AS date_of_birth, 
          COALESCE(_education.years, '--') AS educ_years,
          COALESCE(_education.levels, '--') AS educ_levels
        FROM base_employee
        LEFT JOIN base_person person
              ON person.id = base_employee.person_id
        LEFT JOIN (
          SELECT
            _education.employee_id,
            CONCAT(MIN(_education.year_graduated), '-', MAX(_education.year_graduated)) AS years,
            GROUP_CONCAT(DISTINCT _education.level) AS levels
          FROM base_employee_education _education
          WHERE _education.is_deleted = 0
          GROUP BY _education.employee_id
        ) _education 
        ON _education.employee_id = base_employee.id
       `;

      let whereClause = ` WHERE 1 `;

      if (data.employee_id > 0) {
        whereClause += ` AND base_employee.id = ${data.employee_id}`;
      }

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

  get(id: number) {
    let _self = this;
    return new Promise((resolve, reject) => {
      let query = `
        SELECT 
          base_employee.id as employee_id, 
          base_employee.id as id,
          base_employee.employee_no,
          DATE_FORMAT(base_employee.date_hired, '%Y-%m-%d') AS date_hired, 
          person.id as person_id,
          person.first_name,
          person.last_name,
          person.gender,
          person.citizen,   
          DATE_FORMAT(person.date_of_birth, '%Y-%m-%d') AS date_of_birth
        FROM base_employee
        LEFT JOIN base_person person
          ON person.id = base_employee.person_id
        WHERE base_employee.id=?
       `;

      db.query(query, [id], async (err, results) => {
        if (err) {
          console.log("Reject error:", err);
          return reject(err);
        }

        results[0]["educations"] = await this.getEducations({
          employee_id: id,
        });
        return resolve(results[0]);
      });
    });
  },

  insert(data) {
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
        [data.person_id, data.employee_no],
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
      db.query(
        `UPDATE base_employee 
                  SET date_hired=?
                  WHERE id=?`,
        [data.date_hired, data.id],
        (err, result) => {
          if (err) {
            console.log("Update Employee Info Error:", err.message);
            return reject(err);
          }
          return resolve(result);
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
        `SELECT * FROM base_employee WHERE person_id=?`,
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

  getEducations(data: any) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT  
          id, 
          level, 
          school_name, 
          year_graduated
        FROM 
          base_employee_education 
        WHERE employee_id=? 
        AND is_deleted = 0
      `;
      // console.log("query: ", query);
      db.query(query, [data.employee_id], (err, results) => {
        if (err) {
          console.log("Reject error:", err);
          return reject(err);
        }
        // console.log("results: ", results);
        return resolve(results);
      });
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
          SET 
            level=?, 
            school_name=?, 
            year_graduated=?, 
            is_deleted=? 
          WHERE id=?`,
        [
          data.level,
          data.school_name,
          data.year_graduated,
          data.for_deletion,
          data.id,
        ],
        (err, result) => {
          if (err) {
            console.log("Update Education Error : ", err.message);
            reject(err);
          }
          return resolve(result);
        }
      );
    });
  },
};
