USE TALKY
SELECT * FROM USER
drop TABLE user

CREATE TABLE reaction (
    reaction_id VARCHAR(500) PRIMARY KEY,
    user_id VARCHAR(500) ,
    post_id VARCHAR(500) ,
    created_at VARCHAR(500) NOT NULL,

 FOREIGN KEY (user_id) REFERENCES user(user_id),
 FOREIGN KEY (post_id) REFERENCES post(post_id),


);