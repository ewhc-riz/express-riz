DROP VIEW IF EXISTS view_base_employee;
CREATE VIEW view_base_employee AS
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
        ON person.id = base_employee.person_id;     