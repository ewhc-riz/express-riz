DELIMITER $$ 
DROP FUNCTION IF EXISTS FN_FULLNAME2 $$
    CREATE FUNCTION `FN_FULLNAME2`(
            first_name VARCHAR(55),  
            middle_name VARCHAR(55), 
            last_name VARCHAR(55)
        ) RETURNS VARCHAR(120)
        DETERMINISTIC
    BEGIN
        IF (TRIM(COALESCE(middle_name, '')) != '') THEN 
            RETURN TRIM(
                CONCAT(
                    TRIM(COALESCE(first_name,'')), ' ', 
                    TRIM(COALESCE(middle_name, '')), ' ', 
                    TRIM(COALESCE(last_name, '')
                )
            )); 
        END IF;

        RETURN TRIM(
            CONCAT(
                TRIM(COALESCE(first_name,'')), ' ', 
                TRIM(COALESCE(last_name, ''))
            )); 
    END$$
DELIMITER ;