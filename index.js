import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import pgPromise from "pg-promise";

const app = express();
const port = 3000;

const pgp = pgPromise();
const db = pgp({
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "Aziret7bklassAfisha",
    port: 5432,
});


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

db.none(`CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL
);`).catch(error => {
    console.error("Error creating posts table:", error);
});

app.get("/", async (req, res) => {
    try {
        const posts = await db.any("SELECT * FROM posts ORDER BY id ASC");
        res.render("index.ejs", { posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/posts/new", (req, res) => {
    res.render("new-post.ejs");
});

app.post("/posts", async (req, res) => {
    const { title, content } = req.body;

    if (!title.trim() || !content.trim()) {
        res.render("new-post.ejs", { error: "Both title and content are required to create a post." });
    } else {
        try {
            await db.none("INSERT INTO posts (title, content) VALUES ($1, $2)", [title, content]);
            res.redirect("/");
        } catch (error) {
            console.error("Error creating post:", error);
            res.status(500).send("Internal Server Error");
        }
    }
});

app.get("/posts/:id/edit", async (req, res) => {
    const { id } = req.params;
    try {
        const post = await db.oneOrNone("SELECT * FROM posts WHERE id = $1", [id]);
        if (!post) {
            res.redirect("/");
        } else {
            res.render("edit-post.ejs", { post });
        }
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.put("/posts/:id", async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        await db.none("UPDATE posts SET title = $1, content = $2 WHERE id = $3", [title, content, id]);
        res.redirect("/");
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.delete("/posts/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await db.none("DELETE FROM posts WHERE id = $1", [id]);
        res.redirect("/");
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).send("Internal Server Error");
    }
});
app.get("/search", async (req, res) => {
    const { query } = req.query;
    console.log("Search query:", query); // Логируем запрос
    try {
        const posts = await db.any("SELECT * FROM posts WHERE title ILIKE $1 OR content ILIKE $1", [`%${query}%`]);
        console.log("Posts found:", posts); // Логируем найденные записи
        res.render("index.ejs", { posts });
    } catch (error) {
        console.error("Error searching posts:", error);
        res.status(500).send("Internal Server Error");
    }
});
app.listen(port, () => {
    console.log(`The server started on port ${port}`);
});
