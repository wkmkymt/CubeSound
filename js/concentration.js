
/* =================================================
 * ==                    Board                    ==
 * ================================================= */

var Board = (function() {

  /* ===============
   *   Constructor
   * =============== */
  function Board(row, col) {
    /* Class / ID 名 */
    this.BOARD_ID            = "gameBoard";     // ボード
    this.SCORE_ID            = "score";         // スコア
    this.CARD_CLASS          = "card";          // カード
    this.SELECTED_CARD_CLASS = "card-selected"; // 選択されたカード
    this.GOT_CARD_CLASS      = "card-got";      // ペアになったカード
    this.USER_CARD_CLASS     = "card-user";     // ユーザーのカード
    this.CPU_CARD_CLASS      = "card-cpu";      // CPUのカード

    /* カードのマージン */
    this.CARD_MARGIN          = 10; // .cardのマージン
    this.SELECTED_CARD_MARGIN = 4;  // .card-selectedのマージン

    /* カード枚数 */
    this.ROW      = row;       // 横
    this.COL      = col;       // 縦
    this.CARD_NUM = row * col; // 合計
    this.PAIR_NUM = 4;         // 同じカードの枚数(2n)

    /* カードリスト */
    this.cards = new Array(row * col); // 全カード
    this.selectedCards = [];           // 選択されたカード

    /* フラグ */
    this.isJudging = false; // ジャッジ中判定

    /* スコア */
    this.score = 0;
  }


  /* =========
   *   Debug
   * ========= */
  function debug() {
    function log(name, item) {
      console.log(name + ": ");
      console.log(item);
    }

    log("Cards", this.cards);
    log("Selected Cards", this.selectedCards);
  }


  /* ==================
   *   Get ID / Class
   * ================== */
  function getId(id_name)       { return "#" + id_name; }
  function getClass(class_name) { return "." + class_name; }


  /* ====================
   *   Default Argument
   * ==================== */
  function defaultArg(variable, value) {
    return (typeof variable === "undefined") ? value : variable;
  }


  /* ====================
   *   Initialize Cards
   * ==================== */
  function initializeCards() {
    /* スコアの表示 (score: 0) */
    $(getId(this.SCORE_ID)).text(this.score);

    /* カードをリストに追加 */
    for(var i = 0; i < this.CARD_NUM; i++) {
      var card = new Card(Math.floor(i / this.PAIR_NUM)); // 1種類4枚になるようにID発行
      card.setStyle();                                    // カードIDに合わせてスタイル変更

      do {
        var index = Math.floor(Math.random() * this.CARD_NUM); // ランダムに追加
      } while(typeof this.cards[index] !== "undefined");       // 空なindex値になるまでループ

      this.cards[index] = card;
    }

    /* カードをボードに表示 */
    for(i = 0; i < this.CARD_NUM; i++) {
      var cardElm = this.createCardElment(i, this.cards[i]); // カード要素を作成
      $(getId(this.BOARD_ID)).append(cardElm);          // ボードに追加
    }

    /* カードサイズの初期化 */
    this.resizeElement($(getClass(this.CARD_CLASS)), this.CARD_MARGIN);
  }


  /* =======================
   *   Create Card Element
   * ======================= */
  function createCardElment(index, card) {
    var self = this; // Board

    var cardElm = $("<div>")
          .addClass(this.CARD_CLASS)
          .bind("click touchstart", function() { self.selectCard($(this), self); });
    var cardWrapper = $("<li>")
          .attr({ id: this.CARD_CLASS + index})
          .append(cardElm);

    return cardWrapper;
  }


  /* ===================
   *   Reseize Element
   * =================== */
  function resizeElement(elm, margin) {
    var boardWidth = $(getId(this.BOARD_ID)).width(); // ボードサイズ
    var cardWidth  = (boardWidth / this.ROW);         // ボードサイズをROW分割したサイズ

    elm.css({ width:  (cardWidth - margin).toString() + "px",
              height: (cardWidth - margin).toString() + "px"});
  }


  /* ===============
   *   Select Card
   * =============== */
  function selectCard($this, self) {
    var cardIndex = $this.parent()[0].id.replace(self.CARD_CLASS, "");
    var card = self.cards[Number(cardIndex)];

    /* ジャッジ中じゃないならカードめくる */
    if(!self.isJudging && !card.isTurning) {
      card.isTurning = true;                    // 選択開始
      card.sound.play();                        // SE再生
      $this.addClass(self.SELECTED_CARD_CLASS);

      self.resizeElement($this, self.SELECTED_CARD_MARGIN); // 選択時リサイズ

      self.selectedCards.push(card);
    }

    /* 2枚めくったら */
    if(self.selectedCards.length >= 2)
      self.judgeCard(self.selectedCards, self);
  };


  /* ==============
   *   Judge Card
   * ============== */
  function judgeCard(cards, self) {
    self.isJudging = true;

    setTimeout(function() {
      /* 2枚とも同じとき */
      if(cards[0].ID == cards[1].ID) {
        $(getClass(self.SELECTED_CARD_CLASS))
          .addClass(self.GOT_CARD_CLASS + " " + self.USER_CARD_CLASS);

        self.score += 100;
        $(getId(self.SCORE_ID)).text(self.score);
      }
      /* 違ったとき */
      else {
        cards[0].isTurning = false;
        cards[1].isTurning = false;
      }

      $(getClass(self.CARD_CLASS)).removeClass(self.SELECTED_CARD_CLASS);
      self.selectedCards = [];
      self.isJudging = false;

      self.resizeElement($(getClass(self.CARD_CLASS)), self.CARD_MARGIN);
    }, 750);
  }


  /* =========
   *   Reset
   * ========= */
  function reset() {
    $(getId(this.BOARD_ID)).empty();

    this.cards = new Array(this.CARD_NUM);
    this.selectedCards = [];
    this.isJudging = false;
    this.score = 0;
  }


  /* ====================
   *   Define Prototype
   * ==================== */
  Board.prototype = {
    // Constructor
    constructor: Board,

    // Debug
    debug: debug,

    // Public Method
    initializeCards: initializeCards,
    createCardElment: createCardElment,
    resizeElement: resizeElement,
    selectCard: selectCard,
    judgeCard: judgeCard,
    reset: reset
  };

  return Board;

}());



/* ================================================
 * ==                    Card                    ==
 * ================================================ */
var Card = (function() {

  /* ===============
   *   Constructor
   * =============== */
  function Card(id) {
    this.ID      = id;        // カードID
    this.bgColor = "#fff";    // カードの背景色
    this.sound   = undefined;

    this.isTurning = false;
  }


  /* =========
   *   Debug
   * ========= */
  function debug() {
    function log(name, item) {
      console.log(name + ": ");
      console.log(item);
    }

    log("ID", this.ID);
    log("BackGroundColor", this.bgColor);
  }


  /* =============
   *   Set Style
   * ============= */
  function setStyle() {
    // var colorList = ["#f00", "#0f0", "#00f", "#ff0", "#f0f", "#0ff",
    //                  "#fff", "#000", "#aaa", "#a00", "#8f8", "#88f",
    //                  "#f60", "#a0c", "#ff8", "#600", "#060", "#006"];
    // var colorList = ["#f00", "#0f0", "#00f", "#ff0", "#f0f", "#0ff", "#fff", "#000", "#aaa"];
    // this.bgColor = colorList[Math.floor(this.ID % colorList.length)];

    var soundLength = 9;
    var src = "sound/sound" + Math.floor(this.ID % soundLength).toString() + "." + getAudioExt();
    this.sound = new Audio(src);
  }


  /* =======================
   *   Get Audio Extension
   * ======================= */
  function getAudioExt() {
    var ext   = "";
    var audio = new Audio();

    if(audio.canPlayType("audio/mp3") == "maybe")
      ext = "mp3";
    else if(audio.canPlayType("audio/ogg") == "maybe")
      ext = "ogg";
    else if(audio.canPlayType("audio/wav") == "maybe")
      ext = "wav";

    return ext;
  }


  /* ====================
   *   Define Prototype
   * ==================== */
  Card.prototype = {
    // Constructor
    constructor: Card,

    // Debug
    debug: debug,

    // Public Method
    setStyle: setStyle
  };

  return Card;

}());
