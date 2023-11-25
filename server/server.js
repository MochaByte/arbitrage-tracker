const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cache = require('memory-cache');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3001;

app.use(cors());

const lyraApiKey = 'YOUR_LYRA_API_KEY';

const fetchLyraData = async () => {
  try {
    const response = await axios.get('https://lyra-api.com/ticker', {
      headers: {
        'Authorization': `Bearer ${lyraApiKey}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching Lyra data:', error);
    return [];
  }
};

const fetchOtherExchangeData = async () => {
  // Implement fetching data from other exchanges
  // ...

  return [];
};

const calculateArbitrage = (data) => {
  // Implement your arbitrage calculation logic
  // ...

  return data.filter(entry => entry.sellPrice - entry.buyPrice > 0);
};

app.get('/arbitrage', async (req, res) => {
  try {
    const lyraData = await fetchLyraData();
    const otherExchangeData = await fetchOtherExchangeData();

    const combinedData = [...lyraData, ...otherExchangeData];

    const arbitrageOpportunities = calculateArbitrage(combinedData);

    res.json(arbitrageOpportunities);

    io.emit('updateData', arbitrageOpportunities);
  } catch (error) {
    console.error('Error in /arbitrage endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

io.on('connection', (socket) => {
  console.log('A client connected');
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
