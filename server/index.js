const express = require("express")
const axios = require("axios")
const { JSDOM } = require("jsdom")
const cors = require("cors")
const url = require("url")

const app = express()
const PORT = 8000

app.use(cors())
app.use(express.json())

app.post("/extract-links", async (req, res) => {
    const { url: pageLink } = req.body
    console.log(pageLink)

    try {
        const response = await axios.get(pageLink, { responseType: "text" })
        const dom = new JSDOM(response.data, { url: pageLink })

        const links = [...dom.window.document.querySelectorAll("a")]
            .map((anchor) => anchor.href)
            .filter((href) => href)
            .map((href) => {
                return url.resolve(pageLink, href)
            })

        const uniqueLinks = [...new Set(links)]

        const groupedLinks = uniqueLinks.reduce((acc, link) => {
            const { hostname } = new URL(link) // Extract hostname from the link
            if (!acc[hostname]) {
                acc[hostname] = []
            }
            acc[hostname].push(link) 
            return acc
        }, {})

        res.json({ groupedLinks })
    } catch (error) {
        console.error("Error fetching the website:", error.message)
        res.status(500).json({
            error: "Failed to extract links. Please check the URL.",
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
