-- Drop and recreate Likes table

DROP TABLE IF EXISTS likes CASCADE;

CREATE TABLE likes (
id INTEGER PRIMARY KEY ,
user_id INTEGER  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
item_id INTEGER  NOT NULL REFERENCES items(id) ON DELETE CASCADE
);
