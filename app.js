//Initialize Firebase
  var config = {
    apiKey: "AIzaSyD5XYZHecNShIOC9c69lKZgIVPYyHyysF8",
    authDomain: "project-allergi.firebaseapp.com",
    databaseURL: "https://project-allergi.firebaseio.com",
    storageBucket: "project-allergi.appspot.com",
    messagingSenderId: "149119827295"
  };
  firebase.initializeApp(config);

  database = firebase.database();

  //LabelAPI key: x49rczhgarkyz7hzpxsez2nn
  var labelAPIkey = "x49rczhgarkyz7hzpxsez2nn";
  var walmartAPIkey = "2ahdxqdhzd7thd5u846wgf2m";
  // var allergens = ["Cereals", "Shellfish", "Egg", "Fish", "Milk", "Peanuts","Sulfites","Tree Nuts",
  //                   "Soybean","Sesame Seeds","Gluten","Lactose","Corn","Wheat","Coconut"];
  var searchInput = '';
  var upc = [];
  var labelURL = ''; 
  var sid = '';

  //Click event for searching products
  $(document).on("click", "#add-product", function() {
    searchInput = $("#productInput").val().trim();
    searchURL = "http://cors-anywhere.herokuapp.com/http://api.foodessentials.com/searchprods?q=" + searchInput + "&sid=" + "ad257332-9bf5-4866-997c-9847dbd29f07" + "&n=20&s=0&f=json&api_key=" + labelAPIkey;

    // Code for handling the push
    database.ref().push({
      searchInput: searchInput
    });

    $("#productInput").val("");
    $.ajax({
        url: searchURL,    
        method: 'GET'
    }).done(function(response) {
      //Displays 20 items related to the searched product
      $("#new-input").empty();
      for(i = 0; i < 20; i++){
        console.log("Name: " + response.productsArray[i].product_name);
        console.log("Description: " + response.productsArray[i].product_description);
        console.log("UPC: " + response.productsArray[i].upc);
        $("#new-input").append("<tr><td>" + response.productsArray[i].product_name + "</td><td>" + response.productsArray[i].upc);
      }   
    });
  });

  // Click event when searching by UPC
  $(document).on("click", "#add-upc", function(){
    upcInput = $("#upcInput").val().trim();
    upcURL = "http://cors-anywhere.herokuapp.com/http://api.foodessentials.com/label?u=" + upcInput + "&sid=" + "3bf8bb6f-99d8-42f6-a422-3a8c37a10de8" + "&appid=demoApp_01&f=json" + "&api_key=" + labelAPIkey;
    database.ref().push({
      upcInput: upcInput
    });

    $("#upcInput").val("");
    $.ajax({
      url: upcURL,
      method: 'GET'
    }).done(function(upcresponse) {

      //Show results of all allergens active in the product's ingredient
      $("#new-UPCinput").empty();
      $("#thisProduct").empty();
      $("#thisProduct").append(upcresponse.product_name + " (" + upcInput + ")");
      for(i = 0; i < 15; i++){
        if (upcresponse.allergens[i].allergen_value >= 1){
          $("#new-UPCinput").append(
          "<div class='col-md-12'><strong>" + upcresponse.allergens[i].allergen_name + "</strong><br>"  + "Allergen value: "
          + upcresponse.allergens[i].allergen_value + "<br>" + " <span class='redIngredients'>Red: " + upcresponse.allergens[i].allergen_red_ingredients  
          + "<br>" +  " <span class='yellowIngredients'>Yellow: " + upcresponse.allergens[i].allergen_yellow_ingredients + "<br><br>");
         
          //Display allergen icon
          //If allergen name is in the list, compare the tag with the allergene name, if same, remove displayOff class        
          // if (upcresponse.allergens[i].allergen_name == data-allergenName) {
          //   $("#" + upcresponse.allergens[i].allergen_name + "Icon").removeClass("displayOff");
          // }
        }
      } 
      relatedItems(upcresponse.product_name);
    })

  });

  //Call related items from Walmart
  function relatedItems(data){
    $.ajax({
      url: "http://cors-anywhere.herokuapp.com/http://api.walmartlabs.com/v1/search?query=" + data + "&format=json&apiKey=2ahdxqdhzd7thd5u846wgf2m",
      method: 'GET'
    }).done(function(walmartResponse) {
      console.log(walmartResponse.items);
      $("#relatedItems").empty();
      for (i = 0; i <10; i++){
        console.log(walmartResponse.items[i].salePrice);
        console.log(walmartResponse.items[i].name);
        $("#relatedItems").append("<div class='imageInline'>" + "<br>" +
         walmartResponse.items[i].name + "<br>" + 
         "<a href='" +  walmartResponse.items[i].productUrl + "' target='_blank'>" + "<img class='relatedItemsFromWalmart' src=" + walmartResponse.items[i].thumbnailImage + "/>" + "</a>" +
          "<br>" + " Price: $" + walmartResponse.items[i].salePrice + "<br>" + "Check by UPC: " + walmartResponse.items[i].upc + "</p></div> ");
      }
    })
  }

  //Displays allegen value, red and yellow of a UPC
  // // function displayResults(x){
  //    $("#new-input").empty();
  //         for(i = 0; i < 15; i++){
  //           var x = response;
  //           if (x.allergens[i].allergen_value >= 1){
  //             $("#new-UPCinput").append(
  //             "<div class='col-md-12'>" + upcresponse.allergens[i].allergen_name + "<br>"  + "Allergen value: "
  //             + upcresponse.allergens[i].allergen_value + "<br>" + " Red: " + upcresponse.allergens[i].allergen_red_ingredients  
  //             + "<br>" +  " Yellow: " + upcresponse.allergens[i].allergen_yellow_ingredients + "<br><br>");
             
  //             //Display allergen icon
  //             //If allergen name is in the list, compare the tag with the allergene name, if same, remove displayOff class        
  //             // if (upcresponse.allergens[i].allergen_name == data-allergenName) {
  //             //   $("#" + upcresponse.allergens[i].allergen_name + "Icon").removeClass("displayOff");
  //             // }
  //           }
  //         }
  // }


