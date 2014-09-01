$(document).ready(function() {

  $(".rotation-nav .top    .button").hover(function() { $(".cube").toggleClass("rotate-top"); });
  $(".rotation-nav .right  .button").hover(function() { $(".cube").toggleClass("rotate-right"); });
  $(".rotation-nav .bottom .button").hover(function() { $(".cube").toggleClass("rotate-bottom"); });
  $(".rotation-nav .left   .button").hover(function() { $(".cube").toggleClass("rotate-left"); });

  var app = new CubeSound3D("cube", 3, 3, 6);
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
