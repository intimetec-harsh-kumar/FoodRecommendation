Create database Cafeteria;
use Cafeteria;

-- User
CREATE TABLE User (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name varchar(20) not null,
  email VARCHAR(100) NOT NULL UNIQUE,
  role_id INT,
  preference_id int not null default 1,
  FOREIGN KEY (role_id) REFERENCES Role(id),
  Foreign key(preference_id) references Preference(id)
);

-- Role
CREATE TABLE Role (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE
);

-- Item
CREATE TABLE Item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    availability_status BOOLEAN NOT NULL,
    meal_type_id INT,
    food_type nvarchar(20) not null default 'vegeterian',
    spice_level nvarchar(20) default 'medium',
    originality nvarchar(20) default 'others',
    is_sweet bool default true,
    FOREIGN KEY (meal_type_id) REFERENCES Meal_Type(id)
);

-- Meal_Type
CREATE TABLE Meal_Type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_name varchar(20) NOT NULL
);

-- Preference
create table Preference(
	id int AUTO_INCREMENT PRIMARY KEY,
    food_type nvarchar(20),
    spice_level nvarchar(20),
    originality nvarchar(20),
    sweet_tooth bool
);

-- Notification
CREATE TABLE Notification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    notification_type_id INT,
    message VARCHAR(200) NOT NULL,
    Date Date NOT NULL,
    FOREIGN KEY (notification_type_id) REFERENCES Notification_Type(Id)
);

-- Notification_Type
CREATE TABLE Notification_Type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL
);

-- Feedback
CREATE TABLE Feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    food_item_id INT,
    user_email varchar(50),
    rating DECIMAL(2,1) NOT NULL,
    comment VARCHAR(200) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES User(email),
    FOREIGN KEY (food_item_id) REFERENCES Item(Id)
	ON DELETE CASCADE
);

-- Log
CREATE TABLE Log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email varchar(50),
    action VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Food_Item_Audit
CREATE TABLE Food_Item_Audit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    food_item_id INT,
    rating DECIMAL(2,1) NOT NULL,
    vote INT NOT NULL,
    sentiment DECIMAL(2,1) NOT NULL,
    no_of_times_prepared INT NOT NULL,
    FOREIGN KEY (food_item_id) REFERENCES Item(Id)
    ON DELETE CASCADE
);

-- Voted_Item
CREATE TABLE Voted_Item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    food_item_id INT,
    user_email varchar(50),
    Date DATETIME NOT NULL,
    FOREIGN KEY (user_email) REFERENCES User(email),
    FOREIGN KEY (food_item_id) REFERENCES Item(id)
    ON DELETE CASCADE
);

select * from User;
select * from Preference;
select * from Item;
select * from Meal_Type;
select * from Log;
select * from Food_Item_Audit;
select * from Notification;
select * from Notification_Type;
select * from Feedback;
select * from Voted_Item;
select * from Preference;

---- Update_Food_Item_Audit_After_Insert_In_Feedback_Table Trigger
DELIMITER //
create TRIGGER Update_Food_Item_Audit_After_Insert_In_Feedback_Table
AFTER INSERT ON Feedback
FOR EACH ROW
BEGIN
    DECLARE new_vote INT DEFAULT 0;
    DECLARE new_rating DECIMAL(2,1) DEFAULT 0.0;
    DECLARE new_sentiment DECIMAL(2,1) DEFAULT 0.0;
    IF EXISTS (SELECT 1 FROM Food_Item_Audit WHERE food_item_id = NEW.food_item_id) THEN

        SELECT vote, rating, sentiment INTO new_vote, new_rating, new_sentiment
        FROM Food_Item_Audit
        WHERE food_item_id = NEW.food_item_id;

        SET new_vote = new_vote + 1;
        SET new_rating = ((new_rating * (new_vote - 1)) + NEW.rating) / new_vote;
        SET new_sentiment = ((new_sentiment * (new_vote - 1)) + @Sentiment_Score) / new_vote;
        
        UPDATE Food_Item_Audit
        SET rating = new_rating, vote = new_vote, sentiment = new_sentiment
        WHERE food_item_id = NEW.food_item_id;
    ELSE
        INSERT INTO Food_Item_Audit (food_item_id, rating, vote, sentiment, no_of_times_prepared)
        VALUES (NEW.food_item_id, NEW.rating, 1, @Sentiment_Score, 0);
    END IF;
END //
DELIMITER ;