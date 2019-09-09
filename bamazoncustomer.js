var http=require("http");
var fs=require("fs");
var mysql=require("mysql");

var connection=mysql.createConnection({
    host:"localhost",
    port:"8889",
    user:"root",
    password:"root",
    database:"BAMAZON"
});

connection.connect(function(error){
    if (error){
        console.log(error);
    }
    else {
connection.query("SELECT * FROM Products", function(error, res){
    if (error){
        console.log(error);
    }
    else{
        for (var i=0; i<res.length; i++){
           

            console.log("Item ID: ", res[i].item_id);
            console.log("Product Name: ", res[i].product_name);
            console.log("Product Price: $", res[i].price);
            console.log("Quantity Remaining: ", res[i].stock_quantity);
            console.log("-------------------------")
        }
    }
})    
}
});



function handleRequest2(request,response){
    response.writeHead(200, {"Content-Type":"text/html"});
    if (request.url=="/home"){
        fs.readFile("pages/index.html" , function(error,data){
            response.end(data);
        })
    }
    else if (request.url=="/foods"){
        fs.readFile("pages/favoriteFoods.html" , function(error,data){
            response.end(data);
        })
    }
    else if (request.url=="/movies"){
        fs.readFile("pages/favoriteMovies.html" , function(error,data){
            response.end(data);
        })
    }
    else if (request.url=="/css"){
        fs.readFile("pages/favoriteCSS.html" , function(error,data){
            response.end(data);
        })
    }
     else  {
         
        connection.query("SELECT * FROM Products", function(error, res){

        for (var i=0; i<res.length; i++){
        response.write("<body><div class='container' id=" + res[i].item_id + ">Product Name: " + res[i].product_name + "</br> Product Price: $" + res[i].price + "</br>Quantity Remaining: " + res[i].stock_quantity + "</br> <input type= 'checkbox' id=" + res[i].item_id + ">add to cart</input></br> ------------------------- </div></body>")
        console.log(response);
        }
        });
}};

var server2=http.createServer(handleRequest2);


server2.listen(7509, function(){
    console.log("the server is online listening to port 7500.");
});
