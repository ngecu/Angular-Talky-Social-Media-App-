CREATE TABLE post_user_tag (
    post_user_tag_id VARCHAR(500) PRIMARY KEY NOT NULL,
    post_id VARCHAR(500),
    user_id VARCHAR(500),
    sent INT Default 0,
    created_at VARCHAR(500) NOT NULL,

 FOREIGN KEY (post_id) REFERENCES post(post_id),
 FOREIGN KEY (user_id) REFERENCES user(user_id),


);