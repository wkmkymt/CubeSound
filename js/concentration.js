/* =========
 *   Board
 * ========= */
var Board = (function() {

  function Board(row, col) {
    /* Class / ID ̾ */
    this.BOARD_ID_NAME            = "gameBoard";     // �ܡ���
    this.SCORE_ID_NAME            = "score";         // ������
    this.CARD_CLASS_NAME          = "card";          // ������
    this.SELECTED_CARD_CLASS_NAME = "card-selected"; // ���򤵤줿������
    this.GOT_CARD_CLASS_NAME      = "card-got";      // �ڥ��ˤʤä�������
    this.USER_CARD_CLASS_NAME     = "card-user";     // �桼�����Υ�����
    this.CPU_CARD_CLASS_NAME      = "card-cpu";      // CPU�Υ�����

    /* �����ɤ�ɸ��ο� */
    this.ON_COLOR  = "#333";
    this.OFF_COLOR = "#ccc";

    /* ��������� */
    this._ROW = row;            // ��
    this._COL = col;            // ��
    this._CARD_NUM = row * col; // ���
    this._PAIR_NUM = 4;         // Ʊ�������ɤ����(2n)

    /* �����ɥꥹ�� */
    this._cards = new Array(row * col); // ��������
    this._selectedCards = [];           // ���򤵤줿������

    /* �ե饰 */
    this._isJudging = false; // ����å���Ƚ��

    this.score = 0; // ������
  }

  // function debug() {
  //   function log(name, item) {
  //     console.log(name + ": ");
  //     console.log(item);
  //   }

  //   log("Row", this._ROW);
  //   log("Col", this._COL);
  //   log("Cards", this._cards);
  // }

  function getId(id_name) {
    return "#" + id_name;
  }

  function getClass(class_name) {
    return "." + class_name;
  }

  function initializeCards() {
    /* ��������ɽ�� */
    $(getId(this.SCORE_ID_NAME)).text(this.score);

    /* �����ɤ�ꥹ�Ȥ��ɲ� */
    for(var i = 0; i < this._CARD_NUM; i++) {
      var card = new Card(Math.floor(i / this._PAIR_NUM)); // ��� (i / 4) * 4 ��
      card.setStyle();                                     // ������ID�˹�碌�ƥ��������ѹ�

      do {
        var index = Math.floor(Math.random() * this._CARD_NUM); // ��������ɲ�
      } while(typeof this._cards[index] !== "undefined");       // ����index�ͤˤʤ�ޤǥ롼��
      this._cards[index] = card;
    }

    /* �����ɤ�ܡ��ɤ�ɽ�� */
    for(i = 0; i < this._CARD_NUM; i++) {
      var cardElm = this.createCardElment(i, this._cards[i]); // ���������Ǥ����
      $(getId(this.BOARD_ID_NAME)).append(cardElm);          // �ܡ��ɤ��ɲ�
    }
  }

  function createCardElment(index, card) {
    var self = this; // Board

    var cardElm = $("<div>")
          .addClass(this.CARD_CLASS_NAME)
          .bind("click touchstart", function() { selectCard($(this), self); });
    var cardWrapper = $("<li>")
          .attr({ id: this.CARD_CLASS_NAME + index})
          .append(cardElm);

    return cardWrapper;
  }

  function selectCard($this, self) {
    var cardIndex = $this.parent()[0].id.replace(self.CARD_CLASS_NAME, "");
    var card = self._cards[Number(cardIndex)];
    self._selectedCards.push(card);

    /* ����å��椸��ʤ��ʤ饫���ɤ᤯�� */
    if(!self._isJudging) {
      card.sound.play();
      $this
        .css({ backgroundColor: card.bgColor })
        .addClass(self.SELECTED_CARD_CLASS_NAME);
    }

    /* 2��᤯�ä��� */
    if(self._selectedCards.length >= 2)
      judgeCard(self._selectedCards, self);
  };

  function judgeCard(cards, self) {
    self._isJudging = true;

    setTimeout(function() {
      /* 2��Ȥ�Ʊ���Ȥ� */
      if(cards[0].ID == cards[1].ID && cards[0] != cards[1]) {
        $(getClass(self.SELECTED_CARD_CLASS_NAME))
          .addClass(self.GOT_CARD_CLASS_NAME + " " + self.USER_CARD_CLASS_NAME)
          .css({ backgroundColor: self.ON_COLOR });

        self.score += 100;
        $(getId(self.SCORE_ID_NAME)).text(self.score);
      }
      /* ��ä��Ȥ� */
      else {
        $(getClass(self.CARD_CLASS_NAME) + ":not(" + getClass(self.GOT_CARD_CLASS_NAME) + ")")
          .css({ backgroundColor: self.OFF_COLOR });
      }

      $(getClass(self.CARD_CLASS_NAME)).removeClass(self.SELECTED_CARD_CLASS_NAME);
      self._selectedCards = [];
      self._isJudging = false;
    }, 750);
  }

  function reset() {
    $(getId(this.BOARD_ID_NAME)).empty();

    this._cards = new Array(this._CARD_NUM);
    this._selectedCards = [];
    this._isJudging = false;
    this.score = 0;
  }

  Board.prototype = {
    // Constructor
    constructor: Board,

    // Debug
    // debug: debug,

    // Public Method
    initializeCards: initializeCards,
    createCardElment: createCardElment,
    reset: reset

  };

  return Board;

}());


/* =========
 *   Card
 * ========= */
var Card = (function() {

  function Card(id) {
    this.ID      = id;     // ������ID
    this.bgColor = "#fff"; // �����ɤ��طʿ�
    this.sound   = undefined;
  }

  // function debug() {
  //   function log(name, item) {
  //     console.log(name + ": ");
  //     console.log(item);
  //   }

  //   log("ID", this.ID);
  //   log("BackGroundColor", this.bgColor);
  // }

  function setStyle() {
    // var colorList = ["#f00", "#0f0", "#00f", "#ff0", "#f0f", "#0ff",
    //                  "#fff", "#000", "#aaa", "#a00", "#8f8", "#88f",
    //                  "#f60", "#a0c", "#ff8", "#600", "#060", "#006"];
    var colorList = ["#f00", "#0f0", "#00f", "#ff0", "#f0f", "#0ff", "#fff", "#000", "#aaa"];
    this.bgColor = colorList[Math.floor(this.ID % colorList.length)];

    var soundLength = 9;
    var src = "sound/sound" + Math.floor(this.ID % soundLength).toString() + "." + getAudioExt();
    this.sound = new Audio(src);
  }

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

  Card.prototype = {
    // Constructor
    constructor: Card,

    // Debug
    // debug: debug,

    // Public Method
    setStyle: setStyle
  };

  return Card;

}());
