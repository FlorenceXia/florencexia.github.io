const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg');
    }
});

const upload = multer({ storage: storage });

app.post('/saveImageData', upload.single('image'), (req, res) => {
    console.log('Image saved:', req.file.path);
    res.json({ message: 'Image saved successfully' });
});


app.use(express.static('public'));
app.use(express.json());

app.get('/analyzeSentiment', async (req, res) => {
    const text = req.query.text;

    const options = {
        method: 'GET',
        url: 'https://twinword-sentiment-analysis.p.rapidapi.com/analyze/',
        params: { text: text },
        headers: {
            // 'X-RapidAPI-Key': 
            'X-RapidAPI-Host': 'twinword-sentiment-analysis.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error occurred while fetching data');
    }
});

app.post('/saveImageData', upload.single('image'), (req, res) => {
    console.log('Image saved:', req.file.path);
    res.json({ message: 'Image saved successfully' });
});

app.post('/saveData', (req, res) => {
    saveToFile(req.body, res);
});

app.get('/loadData', (req, res) => {
    loadFromFile(res);
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

function saveToFile(newData, res) {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.log('File not found. Creating new file.');
                data = '[]';
            } else {
                console.error('Error reading file', err);
                return res.status(500).json({ message: 'Error occurred while reading data' });
            }
        }

        let currentData;
        try {
            currentData = JSON.parse(data);
            if (!Array.isArray(currentData)) {
                console.log('Data in file is not an array. Initializing to an empty array.');
                currentData = [];
            }
        } catch (parseErr) {
            console.error('Error parsing JSON', parseErr);
            return res.status(500).json({ message: 'Error occurred while parsing data' });
        }

        currentData.push(newData);
        fs.writeFile('data.json', JSON.stringify(currentData, null, 2), writeErr => {
            if (writeErr) {
                console.error('Error writing file', writeErr);
                return res.status(500).json({ message: 'Error occurred while saving data' });
            }
            res.json({ message: 'Data saved successfully' });
        });
    });
}



function loadFromFile(res) {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file', err);
            return res.status(500).send('Error occurred while reading data');
        }
        res.json(JSON.parse(data));
    });
}