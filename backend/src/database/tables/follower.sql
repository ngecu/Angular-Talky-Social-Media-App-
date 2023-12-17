CREATE TABLE follower (
    follower_id VARCHAR(500) PRIMARY KEY,
    following_user_id VARCHAR(500) NOT NULL,
    followed_user_id VARCHAR(500) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

     FOREIGN KEY (following_user_id) REFERENCES users(user_id),
     FOREIGN KEY (followed_user_id) REFERENCES users(user_id),


);