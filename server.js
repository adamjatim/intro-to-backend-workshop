const express = require('express')
const app = express()
const PORT = 3000

const { AsyncDatabase } = require('promised-sqlite3')
async function dbConnect() {
    const db = await AsyncDatabase.open('./blog.db')
    return db
}

app.use(express.json())

app.get('/articles', async function (req, res) {
    const db = await dbConnect()
    const articles = await db.all('SELECT * FROM articles')
    res.json(articles)

    db.close()
})

app.post('/articles', async function (req, res) {
    const db = await dbConnect()
    const title = req.body.title
    const content = req.body.content

    const query = await db.run(
        'INSERT INTO articles (title, content) VALUES ($title, $content)',
        {
            $title: title,
            $content: content,
        }
    )

    res.status(201).json({
        id: query.lastID,
        title: title,
        content: content,
    })

    db.close()
})

app.delete('/articles/:id', async function (req, res) {
    const db = await dbConnect()
    const query = await db.run('DELETE FROM articles WHERE id = $id', {
        $id: req.params.id,
    })

    res.json({
        message: 'Article deleted',
    })

    db.close()
})

app.listen(PORT, function () {
    console.log('Blog REST API running on port', PORT)
})
