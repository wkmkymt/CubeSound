/* ===============================================================
 * =====                                                     =====
 * =====                    3D Cube Sound                    =====
 * =====                                                     =====
 * =============================================================== */

var CubeSound3D = (function() {

  /* ===============
   *   Constructor
   * =============== */
  function CubeSound3D(cubeID, row, col, pairNum) {
    /* ��������� */
    this.FACE          = 6;
    this.ROW           = defaultArg(row, 3);
    this.COL           = defaultArg(col, 3);
    this.PAIR_NUM      = defaultArg(pairNum, 4);
    this.FACE_CARD_NUM = this.ROW * this.COL;
    this.CARD_NUM      = this.FACE_CARD_NUM * this.FACE;

    /* ���� */
    this.CONFIG = {
      // ID̾
      ID: {
        CUBE: defaultArg(cubeID, "cube"),
        SCORE: "score"
      },
      // Class̾
      CLASS: {
        // Face
        FACE:     "face",

        // Card
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

    /* ������ */
    this.score = 0;

    /* �����ɥꥹ�� */
    this.cards         = [];
    this.selectedCards = [];

    /* Ƚ����ե饰 */
    this.isJudging = false;
  }


  /* =========
   *   Debug
   * ========= */
  function debug() {
    function log(name, item) {
      console.log("===== " + name + " =====");
      console.log(item);
    }

    // log("Face", this.FACE);
    // log("Row", this.ROW);
    // log("Col", this.COL);
    // log("Pair", this.PAIR_NUM);
    // log("FaceCardMax", this.FACE_CARD_NUM);
    // log("CardMax", this.CARD_NUM);

    // log("Config", this.CONFIG);

    log("Cards", this.cards);
  }


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


  /* ==============
   *   Set Config
   * ============== */
  function setConfig(config) {
    this.CONFIG.ID.CUBE        = defaultArg(config.id.cube,         this.CONFIG.ID.CUBE);
    this.CONFIG.ID.SCORE        = defaultArg(config.id.score,         this.CONFIG.ID.SCORE);

    this.CONFIG.CLASS.FACE      = defaultArg(config.class.face,       this.CONFIG.CLASS.FACE);
    this.CONFIG.CLASS.NORMAL    = defaultArg(config.class.normal,     this.CONFIG.CLASS.NORMAL);
    this.CONFIG.CLASS.SELECTED  = defaultArg(config.class.selected,   this.CONFIG.CLASS.SELECTED);
    this.CONFIG.CLASS.GOT       = defaultArg(config.class.got,        this.CONFIG.CLASS.GOT);
    this.CONFIG.CLASS.USER      = defaultArg(config.class.user,       this.CONFIG.CLASS.USER);
    this.CONFIG.CLASS.CPU       = defaultArg(config.class.cpu,        this.CONFIG.CLASS.CPU);

    this.CONFIG.SOUND.SRC       = defaultArg(config.sound.src,        this.CONFIG.SOUND.SRC);
    this.CONFIG.SOUND.NUM       = defaultArg(config.sound.num,        this.CONFIG.SOUND.NUM);

    this.CONFIG.MARGIN.NORMAL   = defaultArg(config.margin.normal,    this.CONFIG.MARGIN.NORMAL);
    this.CONFIG.MARGIN.SELECTED = defaultArg(config.margin.selected,  this.CONFIG.MARGIN.SELECTED);
  }


  /* ==============
   *   Start Game
   * ============== */
  function startGame() {
    /* �����ɤ�ꥹ�Ȥ��ɲ� */
    for(var i = 0; i < this.CARD_NUM; i++) {
      var cardID = Math.floor(i / this.PAIR_NUM);
      var cardSoundSrc = this.CONFIG.SOUND.SRC + (cardID % this.CONFIG.SOUND.NUM).toString() + getSoundExt();

      do {
        var index = Math.floor(Math.random() * this.CARD_NUM);
      } while(typeof this.cards[index] !== "undefined");

      this.cards[index] = createCard(cardID, cardSoundSrc);
    }

    /* �����ɤ�ܡ��ɤ�ɽ�� */
    var self = this;
    getClass(this.CONFIG.CLASS.FACE).each(function(index) {
      var cardList = $("<ul>");
      for(var i = 0; i < self.FACE_CARD_NUM; i++) {
        var cardElm = createCardElement(self.CONFIG.CLASS.NORMAL,
                                        self.FACE_CARD_NUM * index + i,
                                        function() { selectCard($(this), self); });
        cardList.append(cardElm);
      }
      $(this).append(cardList);
    });

    /* �����ɥ������ν���� */
    this.resizeElement(getClass(this.CONFIG.CLASS.NORMAL), this.CONFIG.MARGIN.NORMAL);

    var cardListRate = (100.0 / this.ROW).toString + "%";
    $("[id^='" + this.CONFIG.CLASS.NORMAL + "']").css({ width: cardListRate, height: cardListRate });

    /* ��������ɽ�� */
    this.updateScore();
  }


  /* =======================
   *   Get Sound Extension
   * ======================= */
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


  /* ===============
   *   Create Card
   * =============== */
  function createCard(id, src) {
    var card = new Card(id);
    card.setSoundSrc(src);
    card.loadSound();

    return card;
  }


  /* =======================
   *   Create Card Element
   * ======================= */
  function createCardElement(class_name, index, touchEvent) {
    var cardMain = $("<div>")
          .addClass(class_name)
          .bind("click touchstart", touchEvent);
    var cardElm = $("<li>")
          .attr({ id: class_name + index.toString() })
          .append(cardMain);

    return cardElm;
  }


  /* ===================
   *   Reseize Element
   * =================== */
  function resizeElement(elm, margin) {
    var cubeWidth = getClass(this.CONFIG.CLASS.FACE).width();
    var cardWidth  = cubeWidth / this.ROW;
    var cardSize   = (cardWidth - margin * 2).toString() + "px";

    elm.css({ width: cardSize, height: cardSize, backgroundSize: cardSize });
  }


  /* ===============
   *   Select Card
   * =============== */
  function selectCard($this, self) {
    var cardIndex = $this.parent()[0].id.replace(self.CONFIG.CLASS.NORMAL, "");
    var card      = self.cards[Number(cardIndex)];

    if(!self.isJudging && !card.isTurning) {
      card.isTurning = true;
      card.sound.play();
      card.loadSound();
      $this.addClass(self.CONFIG.CLASS.SELECTED);

      self.resizeElement($this, self.CONFIG.MARGIN.SELECTED);

      self.selectedCards.push(card);

      if(self.selectedCards.length >= 2)
        judgeCard(self, self.selectedCards);
    }
  }


  /* ==============
   *   Judge Card
   * ============== */
  function judgeCard(self, cards) {
    self.isJudging = true;

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
      self.selectedCards = [];
      self.isJudging = false;

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
    getClass(this.CONFIG.CLASS.FACE).empty();

    this.cards = [];
    this.selectedCards = [];
    this.isJudging = false;
    this.score = 0;
  }


  /* ====================
   *   Define Prototype
   * ==================== */
  CubeSound3D.prototype = {
    /* Constructor */
    constructor: CubeSound3D,

    /* Debug */
    debug: debug,

    /* Public Method */
    setConfig: setConfig,
    startGame: startGame,
    resizeElement: resizeElement,
    updateScore: updateScore,
    reset: reset
  };


  return CubeSound3D;

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


  /* =========
   *   Debug
   * ========= */
  function debug() {
    function log(name, item) {
      console.log(name + ": ");
      console.log(item);
    }
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

    // Debug
    debug: debug,

    // Public Method
    setSoundSrc: setSoundSrc,
    loadSound: loadSound
  };

  return Card;

})();
