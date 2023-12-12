USE TALKY
SELECT * FROM USER
drop TABLE user

CREATE TABLE comment (
    comment_id VARCHAR(500) PRIMARY KEY,
    created_by_user_id VARCHAR(500) NOT NULL,
    post_id VARCHAR(500) NOT NULL,
    comment VARCHAR(500) NOT NULL,
    comment_replied_to_id VARCHAR(500),
    created_at VARCHAR(500) NOT NULL,

     FOREIGN KEY (created_by_user_id) REFERENCES users(user_id),
     FOREIGN KEY (post_id) REFERENCES post(post_id),
FOREIGN KEY (comment_replied_to_id) REFERENCES comment(comment_id)

);