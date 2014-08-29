$(document).ready(function() {

  var app = new Board(6, 6);
  app.initializeCards();

  /* リセットボタンが押された時 */
  $("#resetButton").bind("click touchstart", function() {
    app.reset();
    app.initializeCards();
  });

  /* ウィンドウサイズ変更時 */
  window.onresize = function() {
    app.resizeElement($(".card:not(.card-selected)"), 10);
    app.resizeElement($(".card-selected"), 4);
  };

});
