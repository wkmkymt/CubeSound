/* ======================================================================
 * ==========                                                  ==========
 * ==========                    Cube Sound                    ==========
 * ==========                                                  ==========
 * ====================================================================== */

var CubeSound = (function() {

  /* ===============
   *   Constructor
   * =============== */
  function CubeSound(appID, row, col, pairNum) {
    /* ��������� */
    this.ROW      = defaultArg(row, 6);     // �ܡ��ɤβ�
    this.COL      = defaultArg(col, 6);     // �ܡ��ɤν�
    this.PAIR_NUM = defaultArg(pairNum, 4); // 1������Ф��ƤΥڥ������
    this.CARD_NUM = this.ROW * this.COL;    // ���������

    /* �ºݤ�����ܡ��� */
    this._mainBoard = undefined;

    /* ������ */
    this.score = 0;

    /* �����ɥꥹ�� */
    this.cards          = [];
    this._selectedCards = [];

    /* Ƚ����ե饰 */
    this._isJudging = false;

    /* ���� */
    this.CONFIG = {
      // ID̾
      ID: {
        SCORE: "score"
      },
      // Class̾
      CLASS: {
        NORMAL:   "card",
        SELECTED: "card-selected",
        GOT:      "card-got",
        USER:     "card-user",
        CPU:      "card-cpu"
      },
      // �������
      SOUND: {
        SRC: "sound/sound",
        NUM: 9
      },
      // �ޡ�����
      MARGIN: {
        NORMAL  : 5,
        SELECTED: 2
      }
    };
  }


  /* ==============
   *   Set Config
   * ============== */
  function setConfig(config) {
    var self = this;
    jQuery.each(config, function(type, configType) {
      jQuery.each(configType, function(key, val) {
        self.CONFIG[type][key] = defaultArg(val, self.CONFIG[type][key]);
      });
    });
  }


  /* ==============
   *   Start Game
   * ============== */
  function startGame() {
  }


  /* ===============
   *   Entry Cards
   * =============== */
  function entryCards() {
    for(var i = 0; i < this.CARD_NUM; i++) {
      var cardIndex    = getEmptyIndex(this.cards, this.CARD_NUM); // ���Υ���ǥå����ͼ���
      var cardID       = Math.floor(i / this.PAIR_NUM);            // IDȯ�� [CARD_NUM / PAIR_NUM]����
      var cardSoundSrc = this.CONFIG.SOUND.SRC + (cardID % this.CONFIG.SOUND.NUM) + getSoundExt();

      this.cards[cardIndex] = createCardObj(cardID, cardSoundSrc);
    }

    /* ===== Get Empty Index ===== */
    function getEmptyIndex(array, max) {
      do {
        var index = Math.floor(Math.random() * max);
      } while(typeof array[index] !== "undefined");

      return index;
    }

    /* ===== Get Sound Extension ===== */
    function getSoundExt() {
      var ext   = ".";
      var audio = new Audio();

      if(audio.canPlayType("audio/mp3") == "maybe")
        ext = ".mp3";
      else if(audio.canPlayType("audio/ogg") == "maybe")
        ext = ".ogg";
      else if(audio.canPlayType("audio/wav") == "maybe")
        ext = ".wav";

      return ext;
    }

    /* ===== Create Card Object ===== */
    function createCardObj(id, src) {
      var card = new Card(id);
      card.setSoundSrc(src);
      card.loadSound();

      return card;
    }
  }


  /* =========================
   *   Get Card Element List
   * ========================= */
  function getCardElmList(self, max, index) {
    var cardList = $("<ul>");
    for(var i = 0; i < max; i++) {
      var cardElm = createCardElm(this.CONFIG.CLASS.NORMAL, index + i, function() { selectCard($(this), self); });
      cardList.append(cardElm);
    }

    return cardList;

    /* ===== Create Card Element ===== */
    function createCardElm(class_name, index, touchEvent) {
      var cardMain = $("<div>")
            .addClass(class_name)
            .bind("click touchstart", touchEvent);
      var cardElm = $("<li>")
            .attr({ id: class_name + index })
            .append(cardMain);

      return cardElm;
    }
  }


  /* ========================
   *   Initialize card size
   * ======================== */
  function initCardSize() {
    this.resizeElement(getClass(this.CONFIG.CLASS.NORMAL), this.CONFIG.MARGIN.NORMAL);

    var cardListRate = (100.0 / this.ROW) + "%";
    $("[id^='" + this.CONFIG.CLASS.NORMAL + "']").css({ width: cardListRate, height: cardListRate });
  }


  /* ===================
   *   Reseize Element
   * =================== */
  function resizeElement(elm, margin) {
    var boardWidth = this._mainBoard.width();
    var cardWidth  = boardWidth / this.ROW;
    var cardSize   = (cardWidth - margin * 2).toString() + "px";

    elm.css({ width: cardSize, height: cardSize, backgroundSize: cardSize });
  }


  /* ===============
   *   Select Card
   * =============== */
  function selectCard($this, self) {
    var cardIndex = $this.parent()[0].id.replace(self.CONFIG.CLASS.NORMAL, "");
    var card      = self.cards[Number(cardIndex)];

    if(!self._isJudging && !card.isTurning) {
      card.isTurning = true;
      card.sound.play();
      card.loadSound();
      $this.addClass(self.CONFIG.CLASS.SELECTED);

      self.resizeElement($this, self.CONFIG.MARGIN.SELECTED);

      self._selectedCards.push(card);

      if(self._selectedCards.length >= 2)
        judgeCard(self, self._selectedCards);
    }
  }


  /* ==============
   *   Judge Card
   * ============== */
  function judgeCard(self, cards) {
    self._isJudging = true;

    setTimeout(function() {
      /* 2��Ȥ�Ʊ���Ȥ� */
      if(cards[0].ID == cards[1].ID) {
        getClass(self.CONFIG.CLASS.SELECTED).addClass(self.CONFIG.CLASS.GOT + " " + self.CONFIG.CLASS.USER);

        self.score += 100;
        self.updateScore();
      }
      /* ��ä��Ȥ� */
      else {
        cards[0].isTurning = false;
        cards[1].isTurning = false;
      }

      getClass(self.CONFIG.CLASS.NORMAL).removeClass(self.CONFIG.CLASS.SELECTED);
      self._selectedCards = [];
      self._isJudging = false;

      self.resizeElement(getClass(self.CONFIG.CLASS.NORMAL), self.CONFIG.MARGIN.NORMAL);
    }, 750);
  }


  /* ================
   *   Update Score
   * ================ */
  function updateScore() {
    getId(this.CONFIG.ID.SCORE).text(this.score);
  }


  /* =========
   *   Reset
   * ========= */
  function reset() {
    this._mainBoard.empty();

    this.cards = [];
    this._selectedCards = [];
    this._isJudging = false;
    this.score = 0;
  }


  /* ====================
   *   Define Prototype
   * ==================== */
  CubeSound.prototype = {
    /* Constructor */
    constructor: CubeSound,

    /* Public Method */
    setConfig: setConfig,
    startGame: startGame,
    entryCards: entryCards,
    getCardElmList: getCardElmList,
    initCardSize: initCardSize,
    selectCard: selectCard,
    resizeElement: resizeElement,
    updateScore: updateScore,
    reset: reset
  };


  return CubeSound;

})();



/* ===============================================================
 * =====                                                     =====
 * =====                    2D Cube Sound                    =====
 * =====                                                     =====
 * =============================================================== */
var CubeSound2D = (function() {

  /* ===============
   *   Constructor
   * =============== */
  function CubeSound2D(boardID, row, col, pairNum) {
    CubeSound.call(this, boardID, row, col, pairNum);

    /* ���� */
    this.setConfig({ ID: { BOARD: defaultArg(boardID, "gameBoard") } });

    /* �ºݤ�����ܡ��� */
    this._mainBoard = getId(this.CONFIG.ID.BOARD);

    console.log(getId(this.CONFIG.ID.BOARD));
  }


  /* ==============
   *   Start Game
   * ============== */
  function startGame() {
    /* �����ɥ��֥������Ȥ�ꥹ�Ȥ��ɲ� */
    this.entryCards();

    /* �����ɤ�ܡ��ɤ�ɽ�� */
    var cardList = this.getCardElmList(this, this.CARD_NUM, 0);
    this._mainBoard.append(cardList);

    /* �����ɥ������ν���� */
    this.initCardSize();

    /* ��������ɽ�� */
    this.updateScore();
  }


  /* ====================
   *   Define Prototype
   * ==================== */
  var Super = function Super () {};
  Super.prototype = CubeSound.prototype;
  var _super = Super.prototype;

  CubeSound2D.prototype = new Super();
  CubeSound2D.prototype.startGame = startGame;


  return CubeSound2D;

})();



/* ======================================================
 * =====                                            =====
 * =====                    Card                    =====
 * =====                                            =====
 * ====================================================== */

var Card = (function() {

  /* ===============
   *   Constructor
   * =============== */
  function Card(id) {
    this.ID        = id;

    this.sound     = undefined;
    this.soundSrc  = "";

    this.isTurning = false;
  }


  /* ======================
   *   Set Sound Resource
   * ====================== */
  function setSoundSrc(src) {
    this.soundSrc = src;
  }


  /* ==============
   *   Load Sound
   * ============== */
  function loadSound() {
    this.sound = new Audio(this.soundSrc);
    this.sound.load();
  }


  /* ====================
   *   Define Prototype
   * ==================== */
  Card.prototype = {
    // Constructor
    constructor: Card,

    // Public Method
    setSoundSrc: setSoundSrc,
    loadSound: loadSound
  };

  return Card;

})();



/* ====================
 *   Default Argument
 * ==================== */
function defaultArg(variable, value) {
  return (typeof variable === "undefined") ? value : variable;
}


/* ==========================
 *   Get ID / Class Element
 * ========================== */
function getId(id_name)       { return $("#" + id_name); }
function getClass(class_name) { return $("." + class_name); }
