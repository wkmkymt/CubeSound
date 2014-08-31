$(document).ready(function() {

  var app = new CubeSound2D("gameBoard", 6, 6, 4);
  app.setConfig(appConfig);
  app.startGame();

  /* �ꥻ�åȥܥ��󤬲����줿�� */
  $("#resetButton").bind("click touchstart", function() {
    app.reset();
    app.startGame();
  });

  /* ������ɥ��������ѹ��� */
  window.onresize = function() {
    app.resizeElement($(".card:not(.card-selected)"), 5);
    app.resizeElement($(".card-selected"), 2);
  };

});
