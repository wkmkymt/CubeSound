# -*- coding: utf-8 -*-

$(document).ready ->
  app = new CubeSound2D "gameBoard", 6, 6, 4
  app.setConfig appConfig
  app.startGame()

  ### リセットボタンが押された時 ###
  $("#resetButton").bind "click touchstart", ->
    app.reset()
    app.startGame()
    return

  ### ウィンドウサイズ変更時 ###
  window.onresize = ->
    app.resizeElement $(".card:not(.card-selected)"), 5
    app.resizeElement $(".card-selected"), 2
    return

  return
