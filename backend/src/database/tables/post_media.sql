CREATE TABLE post_media (
    post_media_id VARCHAR(500),
    post_id VARCHAR(500),
    media_file VARCHAR(500) ,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (post_id) REFERENCES post(post_id),
);
