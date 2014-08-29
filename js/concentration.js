
/* =================================================
 * ==                    Board                    ==
 * ================================================= */

var Board = (function() {

  /* ===============
   *   Constructor
   * =============== */
  function Board(row, col) {
    /* Class / ID ̾ */
    this.BOARD_ID            = "gameBoard";     // �ܡ���
    this.SCORE_ID            = "score";         // ������
    this.CARD_CLASS          = "card";          // ������
    this.SELECTED_CARD_CLASS = "card-selected"; // ���򤵤줿������
    this.GOT_CARD_CLASS      = "card-got";      // �ڥ��ˤʤä�������
    this.USER_CARD_CLASS     = "card-user";     // �桼�����Υ�����
    this.CPU_CARD_CLASS      = "card-cpu";      // CPU�Υ�����

    /* �����ɤΥޡ����� */
    this.CARD_MARGIN          = 10; // .card�Υޡ�����
    this.SELECTED_CARD_MARGIN = 4;  // .card-selected�Υޡ�����

    /* ��������� */
    this.ROW      = row;       // ��
    this.COL      = col;       // ��
    this.CARD_NUM = row * col; // ���
    this.PAIR_NUM = 4;         // Ʊ�������ɤ����(2n)

    /* �����ɥꥹ�� */
    this.cards = new Array(row * col); // ��������
    this.selectedCards = [];           // ���򤵤줿������

    /* �ե饰 */
    this.isJudging = false; // ����å���Ƚ��

    /* ������ */
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
    /* ��������ɽ�� (score: 0) */
    $(getId(this.SCORE_ID)).text(this.score);

    /* �����ɤ�ꥹ�Ȥ��ɲ� */
    for(var i = 0; i < this.CARD_NUM; i++) {
      var card = new Card(Math.floor(i / this.PAIR_NUM)); // 1����4��ˤʤ�褦��IDȯ��
      card.setStyle();                                    // ������ID�˹�碌�ƥ��������ѹ�

      do {
        var index = Math.floor(Math.random() * this.CARD_NUM); // ��������ɲ�
      } while(typeof this.cards[index] !== "undefined");       // ����index�ͤˤʤ�ޤǥ롼��

      this.cards[index] = card;
    }

    /* �����ɤ�ܡ��ɤ�ɽ�� */
    for(i = 0; i < this.CARD_NUM; i++) {
      var cardElm = this.createCardElment(i, this.cards[i]); // ���������Ǥ����
      $(getId(this.BOARD_ID)).append(cardElm);          // �ܡ��ɤ��ɲ�
    }

    /* �����ɥ������ν���� */
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
    var boardWidth = $(getId(this.BOARD_ID)).width(); // �ܡ��ɥ�����
    var cardWidth  = (boardWidth / this.ROW);         // �ܡ��ɥ�������ROWʬ�䤷��������

    elm.css({ width:  (cardWidth - margin).toString() + "px",
              height: (cardWidth - margin).toString() + "px"});
  }


  /* ===============
   *   Select Card
   * =============== */
  function selectCard($this, self) {
    var cardIndex = $this.parent()[0].id.replace(self.CARD_CLASS, "");
    var card = self.cards[Number(cardIndex)];

    /* ����å��椸��ʤ��ʤ饫���ɤ᤯�� */
    if(!self.isJudging && !card.isTurning) {
      card.isTurning = true;                    // ���򳫻�
      card.sound.play();                        // SE����
      $this.addClass(self.SELECTED_CARD_CLASS);

      self.resizeElement($this, self.SELECTED_CARD_MARGIN); // ������ꥵ����

      self.selectedCards.push(card);
    }

    /* 2��᤯�ä��� */
    if(self.selectedCards.length >= 2)
      self.judgeCard(self.selectedCards, self);
  };


  /* ==============
   *   Judge Card
   * ============== */
  function judgeCard(cards, self) {
    self.isJudging = true;

    setTimeout(function() {
      /* 2��Ȥ�Ʊ���Ȥ� */
      if(cards[0].ID == cards[1].ID) {
        $(getClass(self.SELECTED_CARD_CLASS))
          .addClass(self.GOT_CARD_CLASS + " " + self.USER_CARD_CLASS);

        self.score += 100;
        $(getId(self.SCORE_ID)).text(self.score);
      }
      /* ��ä��Ȥ� */
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
    this.ID      = id;        // ������ID
    this.bgColor = "#fff";    // �����ɤ��طʿ�
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
