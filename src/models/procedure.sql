DELIMITER $$
DROP PROCEDURE IF EXISTS PROC_CALC_EMPLOYEE_EDUCATION_SUMMARY $$
CREATE PROCEDURE PROC_CALC_EMPLOYEE_EDUCATION_SUMMARY ()
    BEGIN
        UPDATE base_employee
        LEFT JOIN (
            SELECT 
                employee_id,
                COUNT(1) AS 'count'
            FROM base_employee_education
            WHERE is_deleted='0'
            GROUP BY employee_id
        ) AS _education 
            ON _education.employee_id = base_employee.id
        SET base_employee.education_count = _education.count;

    END $$
    DELIMITER ;