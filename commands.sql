CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author VARCHAR(255),
    url VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes)
VALUES
    ('Michael Chan', 'https://react.dev/blog', 'React Blog', 5),
    ('Dan Abramov', 'https://overreacted.io', 'Overreacted', 10);

SELECT * FROM blogs;
