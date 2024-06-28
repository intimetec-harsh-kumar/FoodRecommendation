Create database Cafeteria;
use Cafeteria;

---- User
CREATE TABLE User (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name varchar(20) not null,
  email VARCHAR(100) NOT NULL UNIQUE,
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES Role(id)
);

---- Role
CREATE TABLE Role (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE
);

---- Item
CREATE TABLE Item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    availability_status BOOLEAN NOT NULL,
    meal_type_id INT,
    FOREIGN KEY (meal_type_id) REFERENCES Meal_Type(id)
);

---- Meal_Type
CREATE TABLE Meal_Type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_name varchar(20) NOT NULL
);

---- Notification
CREATE TABLE Notification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    notification_type_id INT,
    message VARCHAR(200) NOT NULL,
    Date Date NOT NULL,
    FOREIGN KEY (notification_type_id) REFERENCES Notification_Type(Id)
);

----Notification_Type
CREATE TABLE Notification_Type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL
);

----Feedback
drop table Feedback
CREATE TABLE Feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    foodItemId INT,
    user_email varchar(50),
    rating DECIMAL(2,1) NOT NULL,
    comment VARCHAR(200) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (foodItemId) REFERENCES Item(Id),
    FOREIGN KEY (user_email) REFERENCES User(email)
);

---- Log
CREATE TABLE Log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email varchar(50),
    action VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---- Food_Item_Audit
CREATE TABLE Food_Item_Audit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    food_item_id INT,
    rating DECIMAL(2,1) NOT NULL,
    vote INT NOT NULL,
    sentiment DECIMAL(2,1) NOT NULL,
    no_of_times_prepared INT NOT NULL,
    FOREIGN KEY (food_item_id) REFERENCES Item(Id)
);

---- Voted_Item
CREATE TABLE Voted_Item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    food_item_id INT,
    user_email varchar(50),
    Date DATETIME NOT NULL,
    FOREIGN KEY (food_item_id) REFERENCES Item(id),
    FOREIGN KEY (user_email) REFERENCES User(email)
);

select * from User;
select * from Item;
select * from Log;
select * from Food_Item_Audit;
select * from Notification;
select * from Notification_Type;
select * from Feedback;
select * from Voted_Item;