# -*- coding: utf-8 -*-

###
 * ======================================================================
 * ==========                                                  ==========
 * ==========                    Cube Sound                    ==========
 * ==========                                                  ==========
 * ======================================================================
###
class CubeSound
  ###
   * ===============
   *   Constructor
   * ===============
  ###
  constructor: (row = 6, col = 6, pairNum = 4) ->
    ### カード枚数 ###
    @ROW      = row
    @COL      = col
    @PAIR_NUM = pairNum
    @CARD_NUM = row * col

    ### スコア ###
    @score = 0

    ### カードリスト ###
    @cards         = []
    @selectedCards = []

    ### 判定中フラグ ###
    @isJudging = false

    ### 設定 ###
    @CONFIG =
      ID:
        SCORE: "score"
      CLASS:
        NORMAL:   "card"
        SELECTED: "card-selected"
        GOT:      "card-got"
        USER:     "card-user"
        CPU:      "card-cpu"
      SOUND:
        SRC: "sound/sound"
        NUM: 9
      MARGIN:
        NORMAL:   5
        SELECTED: 2


  ###
   * ===============
   *   Set Config
   * ===============
  ###
  setConfig: (config) ->
    jQuery.each config, (type, configType) =>
      jQuery.each configType, (key, val) =>
        @CONFIG[type][key] = if (typeof val is "undefined") then @CONFIG[type][key] else val
        return
      return
    return


  ###
   * ==============
   *   Start Game
   * ==============
  ###
  startGame: ->
    return


  ###
   * ===============
   *   Entry Cards
   * ===============
  ###
  _entryCards: ->
    ### Get Empty Index ###
    _getEmptyIndex =  (array, max) ->
      loop
        index = Math.floor(Math.random() * max)
        break unless (typeof array[index] isnt "undefined")

      return index


    ### Get Sound Extension ###
    _getSoundExt = ->
      ext   = "."
      audio = new Audio()

      if audio.canPlayType("audio/mp3") is "maybe"
        ext = ".mp3"
      else if audio.canPlayType("audio/ogg") is "maybe"
        ext = ".ogg"
      else if audio.canPlayType8("audio/wav") is "maybe"
        ext = ".wav"

      return ext


    ### Create Card Object ###
    _createCardObject = (id, src) ->
      card = new Card id, src
      card.loadSound()

      return card

    ### Main ###
    for i in [0...@CARD_NUM]
      cardIndex    = _getEmptyIndex(@cards, @CARD_NUM)
      cardID       = Math.floor(i / @PAIR_NUM)
      cardSoundSrc = @CONFIG.SOUND.SRC + (cardID % @CONFIG.SOUND.NUM) + _getSoundExt()

      @cards[cardIndex] = _createCardObject(cardID, cardSoundSrc)

    return


  ###
   * =========================
   *   Get Card Element List
   * =========================
  ###
  _getCardElementList: (max, index) ->
    ### Create Card Element ###
    _createCardElement = (className, index, touchEvent) ->
      cardMain = $("<div>")
        .addClass className
        .bind "click touchstart", touchEvent
      cardElement = $("<li>")
        .attr id: className + index
        .append cardMain

      return cardElement


    func = ($this) ->
      console.log $this


    ### Main ###
    self = @
    cardList = $("<ul>")
    for i in [0...max]
      cardElm = _createCardElement(@CONFIG.CLASS.NORMAL, index + i, ->
        self._selectCard($(this), self)
        return
      )
      cardList.append cardElm

    return cardList


  ###
   * ========================
   *   Initialize Card Size
   * ========================
  ###
  _initCardSize: ->
    @resizeElement getClass(@CONFIG.CLASS.NORMAL), @CONFIG.MARGIN.NORMAL

    cardListRate = (100.0 / @ROW) + "%"
    $("[id^='" + @CONFIG.CLASS.NORMAL + "']").css width: cardListRate, height: cardListRate

    return


  ###
   * ==================
   *   Resize Element
   * ==================
  ###
  resizeElement: (elm, margin) ->
    boardWidth = @_mainBoard.width()
    cardWidth  = boardWidth / @ROW
    cardSize   = (cardWidth - margin * 2).toString() + "px"

    elm.css width: cardSize, height: cardSize, backgroundSize: cardSize

    return


  ###
   * ===============
   *   Select Card
   * ===============
  ###
  _selectCard: ($this, self) ->
    ### Judge Card ###
    judgeCard = (cards) ->
      self.isJudging = true

      setTimeout(->
        ### 2枚とも同じ時 ###
        if cards[0].ID == cards[1].ID
          getClass(self.CONFIG.CLASS.SELECTED).addClass self.CONFIG.CLASS.GOT + " " + self.CONFIG.CLASS.USER

          self.score += 100
          self.updateScore()

          ### 違ったとき ###
        else
          cards[0].isTurning = false
          cards[1].isTurning = false

        getClass(self.CONFIG.CLASS.NORMAL).removeClass self.CONFIG.CLASS.SELECTED
        self.selectedCards = []
        self.isJudging = false

        self.resizeElement getClass(self.CONFIG.CLASS.NORMAL), self.CONFIG.MARGIN.NORMAL

        return
      , 750)

      return

    ### Main ###
    cardIndex = $this.parent()[0].id.replace self.CONFIG.CLASS.NORMAL, ""
    card      = self.cards[Number(cardIndex)]

    if (not self.isJudging) && (not card.isTurning)
      card.isTurning = true
      card.playSound()
      card.loadSound()
      $this.addClass self.CONFIG.CLASS.SELECTED

      self.resizeElement $this, self.CONFIG.MARGIN.SELECTED

      self.selectedCards.push(card)

      if self.selectedCards.length >= 2
        judgeCard(self.selectedCards)

    return


  ###
   * ================
   *   Update Score
   * ================
  ###
  updateScore: ->
    getID(@CONFIG.ID.SCORE).text(@score)

    return


  ###
   * =========
   *   Reset
   * =========
  ###
  reset: ->
    @_mainBoard.empty()

    @cards = []
    @selectedCards = []
    @isJudging = false
    @score = 0

    return



###
 * =========================================================================
 * ==========                                                     ==========
 * ==========                    2D Cube Sound                    ==========
 * ==========                                                     ==========
 * =========================================================================
###
class CubeSound2D extends CubeSound
  ###
   * ===============
   *   Constructor
   * ===============
  ###
  constructor: (boardID = "gameBoard", row, col, pairNum) ->
    super(row, col, pairNum)

    ### 設定 ###
    @setConfig ID: BOARD: boardID

    ### 実際に操作するボード ###
    @_mainBoard = getID @CONFIG.ID.BOARD


  ###
   * ==============
   *   Start Game
   * ==============
  ###
  startGame: ->
    ### カードオブジェクトをリストに追加 ###
    @_entryCards()

    ### カードをボードに表示 ###
    cardList = @_getCardElementList(@CARD_NUM, 0)
    @_mainBoard.append cardList

    ### カードサイズの初期化 ###
    @_initCardSize()

    ### スコアの表示 ###
#    @updateScore()

    return



###
 * ================================================================
 * ==========                                            ==========
 * ==========                    Card                    ==========
 * ==========                                            ==========
 * ================================================================
###
class Card
  ###
   * ===============
   *   Constructor
   * ===============
  ###
  constructor: (cardID, soundSrc) ->
    @ID        = cardID
    @soundSrc  = soundSrc
    @isTurning = false


  ###
   * ==============
   *   Load Sound
   * ==============
  ###
  loadSound: ->
    @sound = new Audio @soundSrc
    @sound.load()
    return


  ###
   * ==============
   *   Play Sound
   * ==============
  ###
  playSound: ->
    @sound.play()
    return


###
 * ==========================
 *   Get ID / Class Element
 * ==========================
###
getID = (id_name) ->       return $("##{id_name}")
getClass = (class_name) -> return $(".#{class_name}")
