//Initialize Firebase
  var config = {
    apiKey: "AIzaSyD5XYZHecNShIOC9c69lKZgIVPYyHyysF8",
    authDomain: "project-allergi.firebaseapp.com",
    databaseURL: "https://project-allergi.firebaseio.com",
    storageBucket: "project-allergi.appspot.com",
    messagingSenderId: "149119827295"
  };
  firebase.initializeApp(config);

  var allergens = ["corn", "shellfish", "egg", "milk", "peanuts"];
  var upc = [];
  
  //LabelAPI key: x49rczhgarkyz7hzpxsez2nn
  var labelAPIkey = "x49rczhgarkyz7hzpxsez2nn";
  var searchInput = $("#productInput").val().trim();

  var queryURL = "https://api.foodessentials.com/searchprods?q=bacon&sid=f8f501c8-4980-4433-8437-66ca0f01018d&n=10&s=0&f=json&api_key=x49rczhgarkyz7hzpxsez2nn";
  //"http://api.foodessentials.com/ingredientsearch?q=" + "peanut" + "&sid=3ea500b1-5ce7-4b8c-88bf-c644da9d728b&n=10&s=1&f=json&api_key=" + labelAPIkey;
	
 	var getAllergen =  "http://api.foodessentials.com/getallergenadditive?u=+%09++" + upc + "&sid=test&f=json&property=" + "allergens[j]" + "&propType=allergen&api_key=" + labelAPIkey;	

  //Render allergen buttons
  function renderButtons(){ 

    // Deletes the allergens prior to adding new allergens (this is necessary otherwise you will have repeat buttons)
    $('#buttons-appear-here').empty();
  
    // Loops through the array of allergens
    for (var i = 0; i < allergens.length; i++){   
        $("#buttons-appear-here").append("<button class='allergensButton' data-button='" + allergens[i] +"'>" + allergens[i] + "</button>");
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

  // This calls the renderButtons() function
  renderButtons();

  $.ajax({
        url: queryURL,
        headers: {'X-Originating-Ip': '72.20.129.155'},
        method: 'GET'
    }).done(function(response) {
    	// searchInput = $("#productInput").val().trim();
    	console.log(response);
    	//console.log(response.arrayIngredients[0][1]);
    	// $("#new-input").append("<tr><td>" + )
        
    });

