# This is a Node.js client application that interacts with the BetaCrew mock exchange server to retrieve stock ticker data and generate a JSON file as output.

# Prerequisites
 Node.js version 16.17.0 or higher installed on your system

 # Getting Started
   # Installation

   1.Clone the repository:
   ```
git clone https: https://github.com/nagendragt12/Node_client_App.git
```

2.Install the required dependencies:

```
npm install
```

# Running the Client

  Start the BetaCrew mock exchange server by running the following command in the extracted folder:

# Run the server application:
```
node server.js
```
# Run the anthor client application 
```
node node.js
```
The client will connect to the BetaCrew mock exchange server, retrieve the stock ticker data, and generate a output.json file in the project directory.

# Output
 The client generates a output.json file in the project directory. The JSON file contains an array of objects, where each object represents a packet of data with increasing sequences. The output format is as follows:

 ```
[
  {
    "symbol": "MSFT",
    "buyOrSell": "B",
    "quantity": 100,
    "price": 200,
    "sequence": 1
  },
  {
    "symbol": "AAPL",
    "buyOrSell": "S",
    "quantity": 50,
    "price": 150,
    "sequence": 2
  },
  ...
]
```
