const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');


const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const MONGO_URL = "mongodb://sakthi:123@ac-0oycnms-shard-00-00.5wbchyz.mongodb.net:27017,ac-0oycnms-shard-00-01.5wbchyz.mongodb.net:27017,ac-0oycnms-shard-00-02.5wbchyz.mongodb.net:27017/?ssl=true&replicaSet=atlas-9sihaf-shard-0&authSource=admin&appName=Cluster0";

const DB_NAME = 'moviedb';
const COLLECTION_NAME = 'movies';


const PORT = 3000;


const client = new MongoClient(MONGO_URL)
let db;


app.get('/', (req, res) => {
  res.send('<h1>Backend is running</h1>');
});


app.post('/submited', async (req, res) => {
  try {
    const movieData = {
      name: req.body.name,
      link: req.body.link,
      genre: req.body.genre,
      rating: req.body.rating || req.body.rate,
      time: req.body.time,
    };


    const result = await db.collection(COLLECTION_NAME).insertOne(movieData);
    res.json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error('Error saving movie:', error);
    res.status(500).json({ success: false, error: 'Unable to save movie' });
  }
});


app.get('/allMovies', async (req, res) => {
  try {
    const movies = await db.collection(COLLECTION_NAME).find({}).toArray();
    res.json({ success: true, data: movies });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ success: false, error: 'Unable to fetch movies' });
  }
});


app.delete('/movies/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(movieId) });


    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Movie not found' });
    }


    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ success: false, error: 'Unable to delete movie' });
  }
});


client.connect()
  .then(() => {
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Fatal: MongoDB connection failed:', err);
    process.exit(1);
  });
