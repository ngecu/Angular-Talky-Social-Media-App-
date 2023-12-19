CREATE TABLE token (
    token_id VARCHAR(500) PRIMARY KEY,
    user_id VARCHAR(500) ,
    token VARCHAR(500) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) 
);
