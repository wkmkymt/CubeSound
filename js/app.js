$(document).ready(function() {

  var app = new Board(6, 6);
  app.initializeCards();

  /* �ꥻ�åȥܥ��󤬲����줿�� */
  $("#resetButton").bind("click touchstart", function() {
    app.reset();
    app.initializeCards();
  });

  /* ������ɥ��������ѹ��� */
  window.onresize = function() {
    app.resizeElement($(".card:not(.card-selected)"), 10);
    app.resizeElement($(".card-selected"), 4);
  };

});
