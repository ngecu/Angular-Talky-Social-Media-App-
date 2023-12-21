-- USE talky

CREATE TABLE Users (
    userID VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    fullname VARCHAR(255),
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(255) DEFAULT 'user',
    profileUrl VARCHAR(255) DEFAULT 'https://cdn.pixabay.com/photo/2023/11/21/00/13/ai-generated-8402129_640.png',
    profileCaption VARCHAR(5000) DEFAULT 'No Caption',
    isWelcomed BIT DEFAULT 0,
    isDeleted BIT DEFAULT 0,
    resetPassword BIT DEFAULT 0,
    resetToken VARCHAR (255) DEFAULT NULL,
    expiryTime DATETIME DEFAULT NULL,
    OTP vARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


SELECT * FROM Users;

DROP TABLE Users;
