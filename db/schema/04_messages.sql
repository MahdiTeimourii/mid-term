-- Drop and recreate Messages table

DROP TABLE IF EXISTS messages CASCADE;

CREATE TABLE messages (
id INTEGER PRIMARY KEY NOT NULL,
message TEXT  NOT NULL ,
sent_time TIMESTAMP DEFAULT Now() NOT NULL ,
sender_id INTEGER  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
receiver_id INTEGER  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
item_id INTEGER  NOT NULL REFERENCES items(id) ON DELETE CASCADE
);
