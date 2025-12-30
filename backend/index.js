const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.send('Video Downloader Backend is running');
});

// Get Video Info
app.post('/api/info', async (req, res) => {
    const { url } = req.body;
    if (!url || !ytdl.validateURL(url)) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    try {
        const info = await ytdl.getInfo(url);
        const videoDetails = {
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url, // Highest quality
            author: info.videoDetails.author.name,
            lengthSeconds: info.videoDetails.lengthSeconds,
        };

        // Filter for formats with both video and audio, or just video
        // We will simplify for the user: High, Medium, Low, Audio Only
        const formats = ytdl.filterFormats(info.formats, 'videoandaudio');

        // Map relevant data for frontend
        const availableFormats = formats.map(f => ({
            itag: f.itag,
            qualityLabel: f.qualityLabel,
            container: f.container,
            hasAudio: f.hasAudio,
            hasVideo: f.hasVideo,
        }));

        res.json({ videoDetails, formats: availableFormats });
    } catch (error) {
        console.error('Error fetching info:', error);
        res.status(500).json({ error: 'Failed to fetch video info' });
    }
});

// Download Video
app.get('/api/download', async (req, res) => {
    const { url, itag } = req.query;

    if (!url || !ytdl.validateURL(url)) {
        return res.status(400).send('Invalid URL');
    }

    try {
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality: itag });

        if (!format) {
            return res.status(400).send('Format not found');
        }

        res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title}.${format.container}"`);
        ytdl(url, { format: format }).pipe(res);

    } catch (error) {
        console.error('Error downloading:', error);
        res.status(500).send('Failed to download video');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
