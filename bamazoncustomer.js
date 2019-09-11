var http = require("http");
var fs = require("fs");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: "8889",
    user: "root",
    password: "root",
    database: "BAMAZON"
});

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
