$(document).ready(function() {

  var app = new Board(6, 6);
  app.initializeCards();

  $("#resetButton").bind("click touchstart", function() {
    app.reset();
    app.initializeCards();
  });

});
