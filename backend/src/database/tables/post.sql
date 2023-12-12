USE TALKY
SELECT * FROM USER
drop TABLE user

CREATE TABLE post (
    post_id VARCHAR(500) PRIMARY KEY,
    created_by_user_id VARCHAR(500) ,
    caption VARCHAR(500) ,
    postType VARCHAR(500) ,
    created_at VARCHAR(500) NOT NULL,

 FOREIGN KEY (created_by_user_id) REFERENCES user(user_id),
  FOREIGN KEY (post_type) REFERENCES post_type(post_type_id),
  
  
);