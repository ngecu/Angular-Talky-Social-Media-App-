CREATE TABLE users (
    user_id VARCHAR(500) PRIMARY KEY,
    profileImage VARCHAR(500) DEFAULT "https://cvhrma.org/wp-content/uploads/2015/07/default-profile-photo.jpg" NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    phone_no VARCHAR(20) NOT NULL,
    welcomed INT Default 0,
    active INT Default 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    -- resetPassword BIT
);