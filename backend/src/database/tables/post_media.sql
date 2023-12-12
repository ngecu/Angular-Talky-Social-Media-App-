USE TALKY

CREATE TABLE post_media (
    post_media_id VARCHAR(500),
    post_id VARCHAR(500),

    media_file VARCHAR(500) ,
    -- position VARCHAR(500) ,
    -- latitude VARCHAR(500) ,
    -- longitude VARCHAR(500) ,

    created_at VARCHAR(500) NOT NULL

     FOREIGN KEY (post_id) REFERENCES post(post_id),


);