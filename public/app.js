// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    //  $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    $("#articles").append(`
    <div class="card">
  <h3 class="card-header">
    <a href= "${data[i].link}">${data[i].title}</a>
  </h3>
  <div class="card-body">
    <h5 class="card-title">${data[i].summary}</h5>
    <p data-id="${data[i]._id}" class="btn btn-primary">Add Note</p>
  </div>
</div>

<br>
    `)
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h4>" + data.title + "</h4>");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<br>");
      $("#notes").append("<button class='btn btn-danger' data-title='" + data.title + "' data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title:  $(this).attr("data-title"),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#bodyinput").val("");
});




/*function handleArticleSave() {
  // This function is triggered when the user wants to save an article
  // When we rendered the article initially, we attached a javascript object containing the headline id
  // to the element using the .data method. Here we retrieve that.
  var articleToSave = $(this)
    .parents(".card")
    .data();

  // Remove card from page
  $(this)
    .parents(".card")
    .remove();

  articleToSave.saved = true;
  // Using a patch method to be semantic since this is an update to an existing record in our collection
  $.ajax({
    method: "PUT",
    url: "/api/headlines/" + articleToSave._id,
    data: articleToSave
  }).then(function(data) {
    // If the data was saved successfully
    if (data.saved) {
      // Run the initPage function again. This will reload the entire list of articles
      initPage();
    }
  });
}*/