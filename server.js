const express = require('express');
const fs = require('fs');
const { clearScreenDown } = require('readline');

const app = express();
const PORT = process.env.PORT || 3000;

// reading data from json 
const rawData = fs.readFileSync('data.json');
const data = JSON.parse(rawData);

// get api to fetch all data

app.get('/api/data', (req, res) => {
  // extract the limit query parameter
  const { limit } = req.query;
  
  let responseData = data;
  
  // apply limit if provided and it's a valid positive integer
  if (limit && /^\d+$/.test(limit)) {
    responseData = data.slice(0, parseInt(limit));
  }
  
  // return the response data
  res.json(responseData);
});


// get api to filter data based on a parameter (e.g., "category")

app.get('/api/data/category', (req, res) => {
  // extract the 'category' and 'limit' query parameters
  const { category, limit } = req.query;

  let filteredData = data;

  // apply category filtering if provided
  if (category) {
    filteredData = filteredData.filter(item => item.category === category);
  }

  // apply limit if provided and it's a valid positive integer
  if (limit && /^\d+$/.test(limit)) {
    filteredData = filteredData.slice(0, parseInt(limit));
  }

  // send the filtered data as JSON response
  res.json(filteredData);
});


// get api based on id
app.get('/api/data/id/:id', (req, res) => {
  const { id } = req.params;
  
  // find the item by id
  const item = data.find(item => item.id === parseInt(id));
  
  if (item) {
    // if item is found, send it as JSON response
    res.json(item);
  } else {
    // if item is not found, send 404 with error message
    res.status(404).json({ message: 'Item not found' });
  }
});

// server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
