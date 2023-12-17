CREATE TABLE post (
    post_id VARCHAR(500) PRIMARY KEY,
    created_by_user_id VARCHAR(500),
    caption VARCHAR(500),
    postType VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_user_id) REFERENCES users(user_id)
);
