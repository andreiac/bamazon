var http = require("http");
var fs = require("fs");
var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
    host: "localhost",
    port: "8889",
    user: "root",
    password: "root",
    database: "BAMAZON"
});



function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "See all products",
                

                "exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "See all products":
                    seeAllProducts();
                    break;


                case "exit":
                    connection.end();
                    break;
            }
        });
}

function continueShopping() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Would you like to continue shopping or exit?",
            choices: [
                "Continue shopping",
                

                "exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Continue shopping":
                    seeAllProducts();
                    break;


                case "exit":
                    connection.end();
                    break;
            }
        });
}

runSearch();



function seeAllProducts() {
    connection.query("SELECT * FROM Products", function (error, res) {
        function itemsRemaining(){
            if (res[i].stock_quantity <= "15"){
                console.log("\nBuy now! Only " + res[i].stock_quantity + " in stock!")
            }
            else if (res[i].stock_quantity == "0"){
                console.log("Item is sold out")
            }
            else {
                console.log("")
            }
        }
            for (var i = 0; i < res.length; i++) {
                console.log("Product Name: " + res[i].product_name + "\nProduct ID: " + res[i].item_id + "\nProduct Price: $" + res[i].price ) 
                itemsRemaining();
                console.log("\n --o--o--o--o--o--o--o--o--o--o--o-- \n")
            }

            selectItemToBuy()

        });

};

 function selectItemToBuy() {
    inquirer
        .prompt(
            {
            name: "item_id",
            type: "input",
            message: "What product would you like to buy? (please enter Product ID)"
        }
    )
        .then(function (item_id) {
              var query = "SELECT product_name, price , stock_quantity FROM Products WHERE ?";

              connection.query(query, { item_id: item_id.item_id }, function (err, res) {
                if (err) throw err;
                console.log(
                    "\nYou have selected: \nProduct Name: " +
                    res[0].product_name +
                    "\nPrice: $" +
                    res[0].price  + "\n"
                );
                addToCart(item_id.item_id, res[0].stock_quantity);
                

            });
        })
};

function addToCart(item_id, in_stock) {
    inquirer
        .prompt(
        {
            name: "stock_quantity",
            type: "input",
            message: "How many would you like to buy?"
        }
    )
        .then(function (stock_quantity) {
            var query = "UPDATE Products SET stock_quantity = stock_quantity -" +(stock_quantity.stock_quantity)+" WHERE item_id=" +item_id;

            connection.query(query, { stock_quantity: item_id.stock_quantity }, function (err, res) {


              if (err) throw err;
              console.log(
                  "\nYou have added: \n" + parseFloat(stock_quantity.stock_quantity) +
                
                  " items to your cart.\n There are now "+(in_stock - stock_quantity.stock_quantity)+" remaining.\n\n"

              );
              continueShopping();
          });
      }
      ) 
};



