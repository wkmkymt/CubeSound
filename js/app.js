$(document).ready(function() {

  var app = new CubeSound3D("cube", 3, 3, 6);
  app.setConfig(appConfig);
  app.startGame();

  /* リセット */
  $("#resetButton").bind("click touchstart", function() {
    app.reset();
    app.startGame();
  });

  /* リサイズ */
  window.onresize = function() {
    app.resizeElement($(".card:not(.card-selected)"), 5);
    app.resizeElement($(".card-selected"), 2);
  };

  /* 回転 */
  var angles = {
    side: {
      up:    { x:  90, y:   0, z:  0 },
      down:  { x: -90, y:   0, z:  0 },
      right: { x:  0,  y:  90, z:  0 },
      left:  { x:  0,  y: -90, z:  0 }
    },
    bottom: {
      up:    { x:  90, y:  0, z:   0 },
      down:  { x: -90, y:  0, z:   0 },
      right: { x:   0, y:  0, z:  90 },
      left:  { x:   0, y:  0, z: -90 }
    }
  };

  $(".rotate-button").bind("click touchstart", function() {
    var angleName = $(this).parent()[0].className;
    var faceType  = (app.angle.X % 180) ? "bottom" : "side";
    app.rotate(angles[faceType][angleName]);
  });

});
