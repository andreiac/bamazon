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

/*
function displayProductsConsole() {
    connection.connect(function (error) {
        if (error) {
            console.log(error);
        }
        else {
            connection.query("SELECT * FROM Products", function (error, res) {
                if (error) {
                    console.log(error);
                }
                else {
                    for (var i = 0; i < res.length; i++) {


                        console.log("Item ID: ", res[i].item_id);
                        console.log("Product Name: ", res[i].product_name);
                        console.log("Product Price: $", res[i].price);
                        console.log("Quantity Remaining: ", res[i].stock_quantity);
                        console.log("-------------------------")
                    }

                }
            })
        }
    })
};

displayProductsConsole();

*/

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
              var query = "SELECT product_name, price FROM Products WHERE ?";

              connection.query(query, { item_id: item_id.item_id }, function (err, res) {
                if (err) throw err;
                console.log(
                    "\nYou have selected: \nProduct Name: " +
                    res[0].product_name +
                    "\nPrice: $" +
                    res[0].price  + "\n"
                );
                addToCart(item_id.item_id)

            });
        })
};

function addToCart(item_id) {
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
                
                  " items to your cart.\n There are now "+parseFloat(item_id.stock_quantity)+" remaining.\n\n"
              );
              continueShopping();
          });
      }) 
};








function multiSearch() {
    var query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].artist);
        }
        runSearch();
    });
}

function rangeSearch() {
    inquirer
        .prompt([
            {
                name: "start",
                type: "input",
                message: "Enter starting position: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "end",
                type: "input",
                message: "Enter ending position: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
            connection.query(query, [answer.start, answer.end], function (err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                    console.log(
                        "Position: " +
                        res[i].position +
                        " || Song: " +
                        res[i].song +
                        " || Artist: " +
                        res[i].artist +
                        " || Year: " +
                        res[i].year
                    );
                }
                runSearch();
            });
        });
}

function songSearch() {
    inquirer
        .prompt({
            name: "song",
            type: "input",
            message: "What song would you like to look for?"
        })
        .then(function (answer) {
            console.log(answer.song);
            connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function (err, res) {
                if (err) throw err;
                console.log(
                    "Position: " +
                    res[0].position +
                    " || Song: " +
                    res[0].song +
                    " || Artist: " +
                    res[0].artist +
                    " || Year: " +
                    res[0].year
                );
                runSearch();
            });
        });
}







/*

function runWebsite(request, response) {
    response.writeHead(200, { "Content-Type": "text/html" });
    if (request.url == "/products") {


        fs.readFile("./products.html", function (error, data) {
            response.write(data);

            connection.query("SELECT * FROM Products", function (error, res) {

                for (var i = 0; i < res.length; i++) {

                    var id= res[i].item_id;
                    response.write("<hr/><hr/><div class='container' id=" + res[i].item_id + ">Product Name: " + res[i].product_name + "<br/>Product Price: $" + res[i].price + "<br/>Quantity Remaining: " + res[i].stock_quantity + "<br/><a href=# onclick='addToCart(" + id + ")' id=" + res[i].item_id + ".checkbox> add to cart</a></div>")


                }

                console.log("displayProductsOnline function working")
            });

        })


    }
    else if (request.url == "/cart") {
        fs.readFile("./cart.html", function (error, data) {
            response.end(data);
        })
    }
    else if (request.url == "/home") {
        fs.readFile("./index.html", function (error, data) {
            response.end(data)
        }
        )
    }

    else if (request.url == "/") {
        fs.readFile("./index.html", function (error, data) {
            response.end(data);

            if (error) {
                console.log(error);
            }
        })
    }
    else {

        connection.query("SELECT * FROM Products", function (error, res) {

            for (var i = 0; i < res.length; i++) {
                response.write("<div class='container' id=" + res[i].item_id + ">Product Name: " + res[i].product_name + "<br/>Product Price: $" + res[i].price + "<br/>Quantity Remaining: " + res[i].stock_quantity + "<br/><input type= 'checkbox' onclick='addToCart(" + res[i].item_id + ")' id=" + res[i].item_id + ".checkbox>add to cart</input><br/> ------------------------- </div><br/>")
            }
            console.log("displayProductsOnline function working")
        });
    }
};



var server2 = http.createServer(runWebsite);


server2.listen(7510, function () {
    console.log("the server is online listening to port 7510.");
});

*/