//Connect socket
const socket = new WebSocket("ws://localhost:3000/stocks");
const stockForm = document.getElementById("stock-form");
const stockInputField = document.getElementById("stock-input");
const stockList = document.getElementById("stocks");

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);

  switch (message.type) {
    case "update":
      Object.keys(message.stockData).forEach((stockTicker) => {
        let stockElement = document.getElementById(stockTicker);
        if (!stockElement) {
          stockElement = document.createElement("li");
          stockElement.id = stockTicker;
          stockElement.innerHTML = `${stockTicker}:<span> </span>`;
          stockList.appendChild(stockElement);
        }
        const stockPriceElement = stockElement.querySelector("span");
        stockPriceElement.textContent = `$${message.stockData[
          stockTicker
        ].toFixed(2)}`;
      });
      break;
  }
});

stockForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newStockTicker = stockInputField.value;
  if (newStockTicker.length > 0) {
    socket.send(
      JSON.stringify({
        type: "add-stock",
        newStockTicker: newStockTicker,
      })
    );
    stockInputField.value = "";
  }
});

//Add event listener to listen for new socket messages
//Add event listener to handle sending the form data via the socket.
