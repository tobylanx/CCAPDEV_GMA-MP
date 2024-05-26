-- -----------------------------------------------------
-- Group `GMA`
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS labdb;
USE labdb;

-- -----------------------------------------------------
-- Table `user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS user;
CREATE TABLE IF NOT EXISTS user (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(75) NOT NULL,
    dlsu_email VARCHAR(50) UNIQUE NOT NULL,
    user_pass VARCHAR(25) UNIQUE NOT NULL,
    picture VARCHAR(100),
    user_desc VARCHAR(255),
    user_role ENUM('student', 'technician') NOT NULL
);

-- -----------------------------------------------------
-- Table `lab_room`
-- -----------------------------------------------------
DROP TABLE IF EXISTS lab_room;
CREATE TABLE IF NOT EXISTS lab_room (
    lab_id INT PRIMARY KEY AUTO_INCREMENT,
    capacity INT NOT NULL,
    location VARCHAR(25)NOT NULL UNIQUE
);

-- -----------------------------------------------------
-- Table `seat`
-- -----------------------------------------------------
DROP TABLE IF EXISTS seat;
CREATE TABLE IF NOT EXISTS seat (
    seat_id INT PRIMARY KEY AUTO_INCREMENT,
    lab_id INT,
    location VARCHAR(255),
    is_available ENUM('yes', 'no') NOT NULL,
    FOREIGN KEY (lab_id) REFERENCES lab_room(lab_id)
);

-- -----------------------------------------------------
-- Table `schedule`
-- -----------------------------------------------------
DROP TABLE IF EXISTS schedule;
CREATE TABLE IF NOT EXISTS schedule (
	sched_id INT PRIMARY KEY AUTO_INCREMENT,
    lab_id INT,
    seat_id INT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    FOREIGN KEY (lab_id) REFERENCES lab_room(lab_id),
    FOREIGN KEY (seat_id) REFERENCES seat(seat_id)
);

-- -----------------------------------------------------
-- Table `reservation`
-- -----------------------------------------------------
DROP TABLE IF EXISTS reservation;
CREATE TABLE IF NOT EXISTS reservation (
	reservation_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    lab_id INT,
    seat_id INT,
    schedule_id INT,
    date_reserved DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES student_user(user_id),
    FOREIGN KEY (lab_id) REFERENCES lab_room(lab_id),
    FOREIGN KEY (seat_id) REFERENCES seat(seat_id),
    FOREIGN KEY (schedule_id) REFERENCES schedule(sched_id)
);