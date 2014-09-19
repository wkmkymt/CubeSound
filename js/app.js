$(document).ready(function() {

  var app = new CubeSound3D("cube", 3, 3, 6);
  app.setConfig(appConfig);
  app.startGame();

  /* �ꥻ�å� */
  $("#resetButton").bind("click touchstart", function() {
    app.reset();
    app.startGame();
  });

  /* �ꥵ���� */
  window.onresize = function() {
    app.resizeElement($(".card:not(.card-selected)"), 5);
    app.resizeElement($(".card-selected"), 2);
  };

  /* ��ž */
  $(".rotate-button").bind("click touchstart", function() {
    var position = $(this).parent()[0].className;
    app.rotate(position);
    app.changeRotateBtnColor();
  });

});
