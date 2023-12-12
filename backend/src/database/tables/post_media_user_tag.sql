CREATE TABLE post_media_user_tag (
    post_media_user_tag_id VARCHAR(500) PRIMARY KEY NOT NULL,
    post_media_id VARCHAR(500),
    user_id VARCHAR(500),
    created_at VARCHAR(500) NOT NULL,

 FOREIGN KEY (post_media_id) REFERENCES post_media(post_media_id),
 FOREIGN KEY (user_id) REFERENCES user(user_id),


);