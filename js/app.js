$(document).ready(function() {

  $(".rotation-nav .top    .button").hover(function() { $(".cube").toggleClass("rotate-top"); });
  $(".rotation-nav .right  .button").hover(function() { $(".cube").toggleClass("rotate-right"); });
  $(".rotation-nav .bottom .button").hover(function() { $(".cube").toggleClass("rotate-bottom"); });
  $(".rotation-nav .left   .button").hover(function() { $(".cube").toggleClass("rotate-left"); });

//  var app = CubeSound3D("gameBoard", 3, 3, 6);

});
