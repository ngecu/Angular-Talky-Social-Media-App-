CREATE TABLE message (
    message_id VARCHAR(500) PRIMARY KEY,
    from_user_id VARCHAR(500) NOT NULL,
    to_user_id VARCHAR(500) NOT NULL,
    group_id VARCHAR(500) NOT NULL,

    message_text VARCHAR(500) NOT NULL,
    created_at VARCHAR(500) NOT NULL,
    status VARCHAR(500) NOT NULL,

     FOREIGN KEY (from_user_id) REFERENCES user(user_id),
     FOREIGN KEY (to_user_id) REFERENCES user(user_id),
     FOREIGN KEY (group_id) REFERENCES message_group(group_id)

);