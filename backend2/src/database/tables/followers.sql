CREATE TABLE Followers(
    followerID VARCHAR(255) PRIMARY KEY, --TABLE ID
    following_userID VARCHAR(255) NOT NULL, --
    followed_userID VARCHAR(255) NOT NULL, --
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (following_userID) REFERENCES Users(userID),
    FOREIGN KEY (followed_userID) REFERENCES Users(userID)
)

SELECT * FROM Followers;

DROP TABLE Followers