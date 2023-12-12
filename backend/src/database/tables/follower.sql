USE TALKY
SELECT * FROM USER
drop TABLE user

CREATE TABLE follower (
    follower_id VARCHAR(500) PRIMARY KEY,
    following_user_id VARCHAR(500) NOT NULL,
    followed_user_id VARCHAR(500) NOT NULL,
    created_at VARCHAR(500) NOT NULL,

     FOREIGN KEY (following_user_id) REFERENCES user(user_id),
     FOREIGN KEY (followed_user_id) REFERENCES user(user_id),


);