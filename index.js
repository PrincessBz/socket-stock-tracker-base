const express = require('express');
const expressWs = require('express-ws');
const path = require('path');

const app = express();
expressWs(app); // Enable WebSocket support

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const clientSockets = [];
const stockPrices = {
    AAPL: 150,
    TSLA: 800,
    MSFT: 300,
};


// Route to render the main page
app.get('/', (request, response) => {
    response.render('index', { stocks: Object.keys(stockPrices) });
});

// WebSocket route for stock updates
app.ws('/stocks', (socket) => {
    // TODO: Handle incoming socket connections
    console.log("Client connected via WebSocket");
   clientSockets.push(socket);

   socket.send(
         JSON.stringify({
            type: 'update',
            stockData: stockPrices,
         })
   );

   // TODO: Handle incoming data from the client
   socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        switch (message.type) {
            case 'add-stock':
               stockPrices[message.newStockTicker] = Math.random() * (1000 - 100) + 100;

                break;
        }
    });


   // TODO: Handle socket disconnection
   socket.addEventListener('close', (event) => {
        console.log('Client disconnected');
        const index = clientSockets.indexOf(socket);
        if (index !== -1) {
            clientSockets.splice(index, 1);
        }
    });
    
});

// Update stock prices periodically
setInterval(() => {
    Object.keys(stockPrices).forEach((stock) => {
        stockPrices[stock] += (Math.random() - 0.5) * 10;
     
    });

    clientSockets.forEach((socket) => {
        console.log("Sending stock price update!");
        socket.send(
            JSON.stringify({
                type: 'update',
                stockData: stockPrices,
            })
        );
    });

   
}, 2000);

// Start server
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
