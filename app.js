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
  var allergens = ["Cereals", "Shellfish", "Egg", "Fish", "Milk", "Peanuts","Sulfites","Tree Nuts",
                    "Soybean","Sesame Seeds","Gluten","Lactose","Corn","Wheat","Coconut"];
  var searchInput = '';
  var upc = [];
  var labelURL = ''; 
  var sid = '';

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
      // searchInput = $("#productInput").val().trim();
      $("#new-input").empty();
      for(i = 0; i < 20; i++){
        console.log("Name: " + response.productsArray[i].product_name);
        console.log("Description: " + response.productsArray[i].product_description);
        console.log("UPC: " + response.productsArray[i].upc);
        $("#new-input").append("<tr><td>" + response.productsArray[i].product_name + "</td><td>" + response.productsArray[i].upc);
      }   
    });
  });

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
      $("#new-input").empty();
      for(i = 0; i < 15; i++){
        $("#new-UPCinput").append(
          "<div class='col-md-12'>" + upcresponse.allergens[i].allergen_name + "<br>"  + "Allergen value: "
          + upcresponse.allergens[i].allergen_value + "<br>" + " Red: " + upcresponse.allergens[i].allergen_red_ingredients  
          + "<br>" +  " Yellow: " + upcresponse.allergens[i].allergen_yellow_ingredients + "<br><br>");
      } 
    })
  });


  //Render allergen buttons
  function renderButtons(){ 
    // Deletes the allergens prior to adding new allergens (this is necessary otherwise you will have repeat buttons)
    $('#buttons-appear-here').empty();
  
    // Loops through the array of allergens
    for (var i = 0; i < allergens.length; i++){   
      $("#buttons-appear-here").append("<button class='allergensButton' data-button='" + allergens[i] +"'>" + allergens[i] + "</button> ");
    }
  };
  
  // ========================================================
  // This function handles events where one button is clicked
  $('#add-allergens').on('click', function(){

    // This line of code will grab the input from the textbox
    var newAllergen = $('#allergensInput').val().trim();

    // The allergen from the textbox is then added to our array
    allergens.push(newAllergen);

    // Our array then runs which handles the processing of our allergens array
    renderButtons();

    $("#allergensInput").val("");

    // We have this line so that users can hit "enter" instead of clicking on ht button and it won't move to the next page
    return false;
  });

  // ========================================================
  //renderButtons();
