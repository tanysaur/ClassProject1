$(window).on("orientationchange",function(){
      //alert("The orientation has changed!");
      if(window.orientation == 0){ // Portrait
        $("p").css({"background-color":"yellow"});
      }
      else { //Landscape
        $("p").css({"background-color":"pink"});
      }
  });

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
  var searchInput = '';
  var upc = [];
  var labelURL = ''; 
  var sid = '';

  window.onload = function(){
    var sessionURL = "http://cors-anywhere.herokuapp.com/http://api.foodessentials.com/createsession?uid=demoUID_01&devid=demoDev_01&appid=demoApp_01&f=json&api_key=x49rczhgarkyz7hzpxsez2nn";
    $.ajax({
      url: sessionURL,
      method: 'GET'
    }).done(function(session) {
      
      sid = session.session_id;
      console.log("SID: " +sid);

      database.ref().push({
        sessionID: sid
      })
    })
  }

  function getAllergens(upc) {
    upcURL = "http://cors-anywhere.herokuapp.com/http://api.foodessentials.com/label?u=" + upc + "&sid=" + "3bf8bb6f-99d8-42f6-a422-3a8c37a10de8" + "&appid=demoApp_01&f=json" + "&api_key=" + labelAPIkey;
    

    database.ref().push({
      upcInput: upcInput
    });

     $.ajax({
        url: upcURL,
        method: 'GET'
    }).done(function(upcresponse) {

    //Show results of all allergens active in the product's ingredient
    
    $(".resultPanels").removeClass("displayOff");
    $("#new-UPCInput-Allergen").empty();
    $("#new-UPCInput-Additive").empty();

    $(".thisProduct").empty();

      //Show product name as title of results panel div
      $(".thisProduct").append(upcresponse.product_name + " (" + upc + ")");
      //Loop through each allergen in the product
      for(i = 0; i < 15; i++){
        if (upcresponse.allergens[i].allergen_value >= 1){
          $("#new-UPCInput-Allergen").append(
          "<div><strong>" + upcresponse.allergens[i].allergen_name + "</strong><br>"  + "Allergen value: "
          + upcresponse.allergens[i].allergen_value + "<br>" + " <span class='redIngredients'>Red: " + upcresponse.allergens[i].allergen_red_ingredients  
          + "<br>" +  " <span class='yellowIngredients'>Yellow: " + upcresponse.allergens[i].allergen_yellow_ingredients + "<br><br>");
         }
      }

      //Loop through each additive in the product
      for(i = 0; i <21; i++){
        if (upcresponse.additives[i].additive_value >= 1){
          $("#new-UPCInput-Additive").append(
          "<div><strong>" + upcresponse.additives[i].additive_name + "</strong><br>"  + "Additive value: "
          + upcresponse.additives[i].additive_value + "<br>" + " <span class='redIngredients'>Red: " + upcresponse.additives[i].additive_red_ingredients  
          + "<br>" +  " <span class='yellowIngredients'>Yellow: " + upcresponse.additives[i].additive_yellow_ingredients + "<br><br>");
        }
      }

      //Scroll to results panel
      $('html, body').animate({
          scrollTop: $("#new-UPCInput-Allergen").offset().top
      }, 1500);

      relatedItems(upcresponse.product_name);
    });
  }

  function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
  }

  $(document).ready(function() {
    if(getQueryVariable('upc') != false) {
      console.log(getQueryVariable('upc'));
    }
  });


  //Toggles button
  $(".allergen-icons-button").on("click", function(){
      $(this).toggleClass('selected');
  })

  //Click event for searching products
  $(document).on("click", "#add-product", function() { // ---scrollTo
    searchInput = $("#productInput").val().trim();
    searchURL = "http://cors-anywhere.herokuapp.com/http://api.foodessentials.com/searchprods?q=" + searchInput + "&sid=" + sid + "&n=100&s=0&f=json&api_key=" + labelAPIkey;

    // Code for handling the push
    database.ref().push({
      searchInput: searchInput
    });

    $("#productInput").val("");
    $.ajax({
        url: searchURL,    
        method: 'GET'
    }).done(function(response) {
      //Displays 100 items related to the searched product
      $("#new-input").empty();
      for(i = 0; i < 100; i++){
        // $("#new-input").append("<tr><td>" + response.productsArray[i].product_name + "</td><td>" + response.productsArray[i].upc + "</td><td>" + selectedToggle[0]);
        var productVariable = window.location.pathname + '?upc=' + response.productsArray[i].upc;
        $("#new-input").append("<tr><td class='productLink'><a href='" + productVariable + "'>" + response.productsArray[i].product_name + "</a></td><td></td><td>");
      }  
    });
  });

  // Click event when searching by UPC
  $(document).on("click", "#add-upc", ".productLink", function(){
    getAllergens(getQueryVariable('upc'));
    //upcInput = $("#upcInput").val().trim();
  });

  //Call related items from Walmart API
  function relatedItems(data){
    $.ajax({
      url: "http://cors-anywhere.herokuapp.com/http://api.walmartlabs.com/v1/search?query=" + data + "&format=json&categoryId=976759&apiKey=2ahdxqdhzd7thd5u846wgf2m",
      method: 'GET'
    }).done(function(walmartResponse) {
      
      console.log(walmartResponse);
      $("#relatedItems").empty();
      $("#relatedItems").removeClass("displayOff");
      for (i = 0; i <10; i++){
        $("#relatedItems").append("<div class='imageInline'>" + "<br>" +
          walmartResponse.items[i].name + "<br>" + 
          "<a href='" +  walmartResponse.items[i].productUrl + "' target='_blank'>" + "<img class='relatedItemsFromWalmart' src=" + walmartResponse.items[i].thumbnailImage + "/>" + "</a>" +
          "<br>" + " Price: $" + walmartResponse.items[i].salePrice + "<br>" + "UPC: " + walmartResponse.items[i].upc + "</p></div> ");
      }
    })
  }



