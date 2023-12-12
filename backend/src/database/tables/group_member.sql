CREATE TABLE group_member (
    group_member_id VARCHAR(500) PRIMARY KEY,
    user_id VARCHAR(500) NOT NULL,
    group_id VARCHAR(500) NOT NULL,

    joined_datetime VARCHAR(500), 
    left_datetime VARCHAR(500)   


         FOREIGN KEY (user_id) REFERENCES user(user_id),
     FOREIGN KEY (group_id) REFERENCES message_group(group_id)
  

);