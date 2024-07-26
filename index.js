import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import fs from "fs";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

let posts = [];

function loadPosts() {
    try {
        const data = fs.readFileSync('posts.json', 'utf8');
        if (data.trim()) {
            posts = JSON.parse(data);
        } else {
            posts = [];
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            posts = [];
        } else {
            console.error("Error reading posts file:", error);
            posts = [];
        }
    }
}


function savePosts() {
    try {
        fs.writeFileSync('posts.json', JSON.stringify(posts, null, 2));
    } catch (error) {
        console.error("Error writing posts file:", error);
    }
}

loadPosts();

app.get("/", (req, res) => {
    res.render("index.ejs", { posts });
});

app.get("/posts/new", (req, res) => {
    res.render("new-post.ejs");
});

app.post("/posts", (req, res) => {
    const { title, content } = req.body;
    
    if (!title.trim() || !content.trim()) {
        res.render("new-post.ejs", { error: "Both title and content are required to create a post." });
    } else {
        const newPost = { id: posts.length + 1, title, content };
        posts.push(newPost);
        savePosts();
        res.redirect("/");
    }
});

app.get("/posts/:id/edit", (req, res) => {
    const { id } = req.params;
    const post = posts.find((post) => post.id === parseInt(id));
    if (!post) {
        res.redirect("/");
    } else {
        res.render("edit-post.ejs", { post });
    }
});

app.put("/posts/:id", (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const index = posts.findIndex((post) => post.id === parseInt(id));
    if (index === -1) {
        res.redirect("/");
    } else {
        posts[index].title = title;
        posts[index].content = content;
        savePosts();
        res.redirect("/");
    }
});

app.delete("/posts/:id", (req, res) => {
    const { id } = req.params;
    posts = posts.filter((post) => post.id !== parseInt(id));
    savePosts();
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`The server started on port ${port}`);
});
