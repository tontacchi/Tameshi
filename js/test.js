//---[ Object Constructors ]---------------------------------------------------
 /**
  * @param {string} question 
  * @param {[string]} answerList 
  * @param {string} questionType 
  */
 function Question(question, answerList, questionType) {
    this.question     = question;
    this.answerList   = answerList;
    this.questionType = questionType;
    this.response     = "";
    this.answered     = false;
    this.isCorrect    = null;
 }

 function Test() {
    // attributes
    this.questionBank = Array();
    this.currentQuestion = 0;
    
    // accessors
    this.getQuestion = function (arrIndex) {
        if (arrIndex < 0 || arrIndex > this.getNumQuestions()) {
            return null;
        }

        return this.questionBank[arrIndex];
    }
    this.getNumQuestions = function () {
        return this.questionBank.length;
    }
    this.getCurrentQuestion = function () {
        return this.questionBank[this.currentQuestion];
    }
    
    // mutators
    /**
     * @param {string} question 
     * @param {[string]} answerList 
     * @param {string} questionType 
     */
    this.addQuestion = (question, answerList, questionType) => {
        log("Test addQuestion", `q: ${question}, aList: ${answerList}, qType: ${questionType}`);
        this.questionBank.push(new Question(question, answerList, questionType));
    }

    this.incrementQuestion = () => {
        if (this.currentQuestion < this.getNumQuestions()) {
            this.currentQuestion++;
        }
    }

    // utilities
    this.shuffleQuestions = () => {
        // modified Fisher-Yates algorithm
        const numIterations = 100

        for (let _ = 0; _ < numIterations; _++) {
            for (let i = 0; i < this.getNumQuestions(); i++) {
                let j = Math.floor(Math.random() * this.getNumQuestions());

                let temp = this.getQuestion(i);
                this.questionBank[i] = this.getQuestion(j);
                this.questionBank[j] = temp;
            }
        }

    }

    this.validateResponse = function (response, questionIndex) {
        let answers = this.questionBank[questionIndex].answerList;
        let isCorrect = false;

        for (const answer of answers) {
            if (response === answer) {
                isCorrect = true;
                break;
            }
        }

        return isCorrect;
    }

    this.testOver = () => {
        return this.currentQuestion >= this.getNumQuestions();
    }
 }

 /**
  * @param {string | null} kanji 
  * @param {string} reading 
  * @param {[string]} meaningList 
  * 
  * @returns {GenkiTerm}
 */
 function GenkiTerm(kanji, reading, meaningList) {
    this.kanji       = kanji;
    this.reading     = reading;
    this.meaningList = meaningList;
 }
//*--[ Object Constructors ]---------------------------------------------------


//---[ Main Function ]---------------------------------------------------------
 function main() {
    const test = makeGenkiNumbersTest();
    console.log(test);

    displayQuestion(test);
 }
//*--[ Main Function ]---------------------------------------------------------


//---[ Document Setup ]--------------------------------------------------------
 function displayQuestion(test) {
    const questionBox   = document.querySelector(".question-box");
    const responseField = document.querySelector(".response");
     
    const question = test.getCurrentQuestion();
    console.log(question);

    // set question & reset input box
    questionBox.textContent = question.question;
    responseField.value = "";

    // convert english -> hiragana as needed
    if (question.questionType === "reading") {
        responseField.addEventListener("input", setConvertFunc);
    }
    else {
        responseField.removeEventListener("input", setConvertFunc);
    }

    const tempFunc = (event) => {
        if (event.key === "Enter" && !test.testOver()) {
            const currentQuestion = test.getCurrentQuestion();

            setResponse(currentQuestion);
            checkAnswer(currentQuestion);

            if (currentQuestion.isCorrect) {
                console.log(test);
                test.incrementQuestion();
                console.log(test);

                if (test.currentQuestion >= test.getNumQuestions()) {
                    const contentContainer  = document.querySelector(".content-container");
                    const questionContainer = document.querySelector(".question-container");
                    contentContainer.removeChild(questionContainer);
                }
                else
                    displayQuestion(test);
            }
        }
    };

    // move to own function later
    responseField.addEventListener("keydown", tempFunc);

    return;
 }
//*--[ Document Setup ]--------------------------------------------------------


//---[ Callback Functions ]----------------------------------------------------
 /**
  * @param {InputEvent} inputEvent
  */
 function replaceEnglishWithHiragana(inputEvent) {
    const hiraganaMap = getHiraganaReplaceMap();
    const targetNode  = inputEvent.target;
    
    let cursorPos = targetNode.selectionStart;
    let inputText = targetNode.value;


    for (let key in hiraganaMap) {
        inputText = inputText.replace(new RegExp(key, 'g'), hiraganaMap[key]);
    }
    
    // changes the text, sets cursor to end of changed text
    cursorPos += inputText.length - targetNode.value.length;
    targetNode.value = inputText;
    targetNode.setSelectionRange(cursorPos, cursorPos);
 }

 function setConvertFunc(event) {
    replaceEnglishWithHiragana(event);
 }

 function setResponse(question) {
    const inputBox = document.querySelector(".response");
    question.response = inputBox.value;
 }

 function checkAnswer(question) {
    for (const answer of question.answerList) {
        if (question.response.toLowerCase() === answer.toLowerCase()) {
            question.answered = true;
            question.isCorrect = true;
            break;
        }
    }
 }
//*--[ Callback Functions ]----------------------------------------------------


//---[ Utility Functions ]-----------------------------------------------------
 function loadHiraganaMeaningQuestions(test, mapsList) {
    for (const map of mapsList) {
        for (const genkiTerm of map) {
            if (genkiTerm.kanji === null) {
                test.addQuestion(genkiTerm.reading, genkiTerm.meaningList, "meaning");
            }
        }
    }
 }

 function loadEnglishReadingQuestions(test, mapsList) {
    for (const map of mapsList) {
        for (const genkiTerm of map) {
            if (genkiTerm.kanji === null) {
                for (const meaning of genkiTerm.meaningList) {
                    test.addQuestion(meaning, [genkiTerm.reading], "reading");
                }
            }
        }
    }
 }

 function makeKanjiReadingTest() {

 }

 function loadKanjiMeaningTest(test, mapsList) {
    for (const map of mapsList) {
        for (const genkiTerm of map) {
            log("loadKanji", genkiTerm.kanji);
            test.addQuestion(genkiTerm.kanji, genkiTerm.meaningList, "meaning");
        }
    }
 }

 // wanikani kanji tests

 // wanikani vocabulary tests

 // genki vocabulary tests
 function makeGenkiNumbersTest() {
    const test = new Test();
    const numbersList = getGenkiNumbersList();

    loadKanjiMeaningTest(test, [numbersList]);

    test.shuffleQuestions();
    return test;
 }

 function makeGenkiLesson1VocabularyTest() {
    const test = new Test();
    const vocabList = getGenkiLessonOneVocabularyList();

    loadEnglishReadingQuestions(test, [vocabList]);
    loadHiraganaMeaningQuestions(test, [vocabList]);

    test.shuffleQuestions();
    return test;
 }

 function makeGenkiGreetingsTest() {
    const test = new Test();
    const greetingList = getGenkiGreetingsList();

    loadEnglishReadingQuestions(test, [greetingList]);
    loadHiraganaMeaningQuestions(test, [greetingList]);
    
    test.shuffleQuestions();
    return test;
 }

 function makeGenkiNamesTest() {
    const test = new Test();
    const namesList = getGenkiCharacterNamesList();
 
    loadHiraganaMeaningQuestions(test, [namesList]);
    test.shuffleQuestions();

    return test;
 }

 // kana reading tests
 function makeHiraganaTest() {
    const test = new Test();
    const hiraMap = {...getSmallTsuHiraganaMap(), ...getHiraganaMap()};
    console.log(hiraMap);

    for (const pair of Object.entries(hiraMap)) {
        test.addQuestion(pair[0], [pair[1]], "meaning");
    }
    test.shuffleQuestions();

    return test;
 }

 function makeKatakanaTest() {
    const test    = new Test();
    const kataMap = getKatakanaMap();

    for (const pair of Object.entries(kataMap)) {
        test.addQuestion(pair[0], [pair[1]], "meaning");
    }
    test.shuffleQuestions();

    return test;
 }

//*--[ Utility Functions ]-----------------------------------------------------


//---[ Genki Vocabulary Maps ]-------------------------------------------------
 /**
  * @returns {[GenkiTerm]}
  */
 function getGenkiNumbersList() {
    const numbersList = [
        new GenkiTerm("十", "じゅう", ["ten"]),
        new GenkiTerm("十一", "じゅういち", ["eleven"]),
        new GenkiTerm("十二", "じゅうに", ["twelve"]),
        new GenkiTerm("十三", "じゅうさん", ["thirteen"]),
        new GenkiTerm("十四", "じゅうよん", ["fourteen"]),
        new GenkiTerm("十四", "じゅうし", ["fourteen"]),
    ];

    return numbersList;
 }

 /**
  * @returns {[GenkiTerm]}
  */
 function getGenkiLessonOneVocabularyList() {
    const vocabList = [
        new GenkiTerm(null, "たんご", ["vocabulary", "word"]),

        new GenkiTerm(null, "がっこう", ["school"]),
        new GenkiTerm(null, "しょうがく", ["primary school"]),
        new GenkiTerm(null, "ちゅうがく", ["middle school"]),
        new GenkiTerm(null, "こうこう", ["high school"]),
        new GenkiTerm(null, "だいがく", ["college", "university"]),
        new GenkiTerm(null, "がくせい", ["student"]),
        new GenkiTerm(null, "だいがくせい", ["college student"]),
        new GenkiTerm(null, "りゅうがくせい", ["international student"]),
        new GenkiTerm(null, "せんせい", ["teacher"]),
        new GenkiTerm(null, "～ねんせい", ["~year student"]),
        new GenkiTerm(null, "いちねんせい", ["first-year student"]),
        new GenkiTerm(null, "にねんせい", ["second-year student"]),
        new GenkiTerm(null, "さんねんせい", ["third-year student"]),
        new GenkiTerm(null, "よねんせい", ["fourth-year student"]),
        new GenkiTerm(null, "ごねんせい", ["fifth-year student"]),
        new GenkiTerm(null, "ろくねんせい", ["sixth-year student"]),
        new GenkiTerm(null, "せんこう", ["major"]),

        
    ];

    return vocabList;
 }

 /**
  * @returns {[GenkiTerm]}
  */
 function getGenkiGreetingsList() {
    const greetingList = [
        new GenkiTerm(null, "あいさつ", ["Greetings"]),
        new GenkiTerm(null, "おはよう", ["Good Morning"]),
        new GenkiTerm(null, "おはようございます", ["Good Morning (polite)"]),
        new GenkiTerm(null, "こんにちは", ["Good Afternoon"]),
        new GenkiTerm(null, "こんばんは", ["Good Evening"]),
        new GenkiTerm(null, "さよなら", ["Goodbye"]),
        new GenkiTerm(null, "おやすみ", ["Goodnight"]),
        new GenkiTerm(null, "おやすみなさい", ["Goodnight (polite)"]),
        new GenkiTerm(null, "ありがとう", ["Thank you"]),
        new GenkiTerm(null, "ありがとうございます", ["Thank you (polite)"]),
        new GenkiTerm(null, "すみません", ["Excuse me", "I'm sorry"]),
        new GenkiTerm(null, "いいえ", ["No", "Not at all"]),
        new GenkiTerm(null, "いってきます", ["I'll go and come back", "I'm heading out"]),
        new GenkiTerm(null, "いってらっしゃい", ["Please go and come back", "Come back safely"]),
        new GenkiTerm(null, "ただいま", ["I'm home", "I'm back"]),
        new GenkiTerm(null, "おかえり", ["Welcome home", "Welcome back"]),
        new GenkiTerm(null, "おかえりなさい", ["Welcome home (polite)"]),
        new GenkiTerm(null, "いただきます", ["Thank you for the meal (before eating)"]),
        new GenkiTerm(null, "ごちそうさま", ["Thank you for the meal (after eating)"]),
        new GenkiTerm(null, "ごちそうさまでした", ["Thank you for the meal (after eating, polite)"]),
        new GenkiTerm(null, "はじめまして", ["How do you do"]),
        new GenkiTerm(null, "よろしく", ["Nice to meet you"]),
        new GenkiTerm(null, "よろしくおねがいします", ["Nice to meet you, please take care of me"]),
        new GenkiTerm(null, "おじぎ", ["Bowing"]),
    ];

    return greetingList;
 }

 function getGenkiCharacterNamesList() {
    const namesList = [
        new GenkiTerm(null, "メアリー・ハート", ["Hart Mary"]),
        new GenkiTerm(null, "メアリー", ["Mary"]),
        new GenkiTerm(null, "ハート", ["Hart"]),
        new GenkiTerm(null, "木村たけし", ["Kimura Takeshi"]),
        new GenkiTerm(null, "たけし", ["Takeshi"]),
        new GenkiTerm(null, "木村", ["Kimura"]),
        new GenkiTerm(null, "ソラ・キム", ["Sora Kim"]),
        new GenkiTerm(null, "ソラ", ["Sora"]),
        new GenkiTerm(null, "キム", ["Kim"]),
        new GenkiTerm(null, "ロバート・スミス", ["Smith Robert"]),
        new GenkiTerm(null, "ロバート", ["Robert"]),
        new GenkiTerm(null, "スミス", ["Smith"]),
        new GenkiTerm(null, "ジョン・ワン", ["Wang John"]),
        new GenkiTerm(null, "ジョン", ["John"]),
        new GenkiTerm(null, "ワン", ["Wang"]),
        new GenkiTerm(null, "山下先生", ["Yamashita Sensei"]),
        new GenkiTerm(null, "山下", ["Yamashita"]),
        new GenkiTerm(null, "先生", ["Sensei"]),
        new GenkiTerm(null, "鈴木建", ["Suzuki Ken"]),
        new GenkiTerm(null, "鈴木", ["Suzuki"]),
        new GenkiTerm(null, "建", ["Ken"]),
        new GenkiTerm(null, "山川ゆい", ["Yamakawa Yui"]),
        new GenkiTerm(null, "山川", ["Yamakawa"]),
        new GenkiTerm(null, "ゆい", ["Yui"]),
        new GenkiTerm(null, "お父さん", ["father"]),
        new GenkiTerm(null, "お母さん", ["mother"]),
    ];

    return namesList;
 }
//*--[ Genki Vocabulary Maps ]-------------------------------------------------

//---[ Kana Maps ]-------------------------------------------------------------
 /**
  * returns romaji -> hiragana map
  * - patterns defined by how microsoft IME converts ascii -> hiragana
  * 
  * @returns {Map<string, string>} hiraganaReplaceMap
  */
 function getHiraganaReplaceMap() {
    const hiraganaReplaceMap = {
        "-": "ー",
        "~": "～",
        "nkkya": "んっきゃ",
        "nkkyu": "んっきゅ",
        "nkkyo": "んっきょ",
        "nggya": "んっぎゃ",
        "nggyu": "んっぎゅ",
        "nggyo": "んっぎょ",
        "nssha": "んっしゃ",
        "nsshu": "んっしゅ",
        "nssho": "んっしょ",
        "njja": "んっじゃ",
        "njju": "んっじゅ",
        "njjo": "んっじょ",
        "nccha": "んっちゃ",
        "ncchu": "んっちゅ",
        "nccho": "んっちょ",
        "nnnya": "んっにゃ",
        "nnnyu": "んっにゅ",
        "nnnyo": "んっにょ",
        "nhhya": "んっひゃ",
        "nhhyu": "んっひゅ",
        "nhhyo": "んっひょ",
        "nbbya": "んっびゃ",
        "nbbyu": "んっびゅ",
        "nbbyo": "んっびょ",
        "nppya": "んっぴゃ",
        "nppyu": "んっぴゅ",
        "nppyo": "んっぴょ",
        "nmmya": "んっみゃ",
        "nmmyu": "んっみゅ",
        "nmmyo": "んっみょ",
        "nrrya": "んっりゃ",
        "nrryu": "んっりゅ",
        "nrryo": "んっりょ",
        "nkka": "んっか",
        "nkki": "んっき",
        "nkku": "んっく",
        "nkke": "んっけ",
        "nkko": "んっこ",
        "ngga": "んっが",
        "nggi": "んっぎ",
        "nggu": "んっぐ",
        "ngge": "んっげ",
        "nggo": "んっご",
        "nssa": "んっさ",
        "nsshi": "んっし",
        "nssu": "んっす",
        "nsse": "んっせ",
        "nsso": "んっそ",
        "nzza": "んっざ",
        "njji": "んっじ",
        "nzzu": "んっず",
        "nzze": "んっぜ",
        "nzzo": "んっぞ",
        "ntta": "んった",
        "ncchi": "んっち",
        "nttsu": "んっつ",
        "ntte": "んって",
        "ntto": "んっと",
        "ndda": "んっだ",
        "nddi": "んっぢ",
        "nddu": "んっづ",
        "ndde": "んっで",
        "nddo": "んっど",
        "nnna": "んっな",
        "nnni": "んっに",
        "nnnu": "んっぬ",
        "nnne": "んっね",
        "nnno": "んっの",
        "nhha": "んっは",
        "nhhi": "んっひ",
        "nffu": "んっふ",
        "nhhe": "んっへ",
        "nhho": "んっほ",
        "nbba": "んっば",
        "nbbi": "んっび",
        "nbbu": "んっぶ",
        "nbbe": "んっべ",
        "nbbo": "んっぼ",
        "nppa": "んっぱ",
        "nppi": "んっぴ",
        "nppu": "んっぷ",
        "nppe": "んっぺ",
        "nppo": "んっぽ",
        "nmma": "んっま",
        "nmmi": "んっみ",
        "nmmu": "んっむ",
        "nmme": "んっめ",
        "nmmo": "んっも",
        "nyya": "んっや",
        "nyyu": "んっゆ",
        "nyyo": "んっよ",
        "nrra": "んっら",
        "nrri": "んっり",
        "nrru": "んっる",
        "nrre": "んっれ",
        "nrro": "んっろ",
        "nwwa": "んっわ",
        "nwwo": "んっを",
        "nkya": "んきゃ",
        "nkyu": "んきゅ",
        "nkyo": "んきょ",
        "ngya": "んぎゃ",
        "ngyu": "んぎゅ",
        "ngyo": "んぎょ",
        "nsha": "んしゃ",
        "nshu": "んしゅ",
        "nsho": "んしょ",
        "nja": "んじゃ",
        "nju": "んじゅ",
        "njo": "んじょ",
        "ncha": "んちゃ",
        "nchu": "んちゅ",
        "ncho": "んちょ",
        "nnya": "んにゃ",
        "nnyu": "んにゅ",
        "nnyo": "んにょ",
        "nhya": "んひゃ",
        "nhyu": "んひゅ",
        "nhyo": "んひょ",
        "nbya": "んびゃ",
        "nbyu": "んびゅ",
        "nbyo": "んびょ",
        "npya": "んぴゃ",
        "npyu": "んぴゅ",
        "npyo": "んぴょ",
        "nmya": "んみゃ",
        "nmyu": "んみゅ",
        "nmyo": "んみょ",
        "nrya": "んりゃ",
        "nryu": "んりゅ",
        "nryo": "んりょ",
        "ntsu": "んつ",
        "nchi": "んち",
        "nshi": "んし",
        "nka": "んか",
        "nki": "んき",
        "nku": "んく",
        "nke": "んけ",
        "nko": "んこ",
        "nga": "んが",
        "ngi": "んぎ",
        "ngu": "んぐ",
        "nge": "んげ",
        "ngo": "んご",
        "nsa": "んさ",
        "nsu": "んす",
        "nse": "んせ",
        "nso": "んそ",
        "nza": "んざ",
        "nji": "んじ",
        "nzu": "んず",
        "nze": "んぜ",
        "nzo": "んぞ",
        "nta": "んた",
        "nte": "んて",
        "nto": "んと",
        "nda": "んだ",
        "ndi": "んぢ",
        "ndu": "んづ",
        "nde": "んで",
        "ndo": "んど",
        "nna": "んな",
        "nni": "んに",
        "nnu": "んぬ",
        "nne": "んね",
        "nno": "んの",
        "nha": "んは",
        "nhi": "んひ",
        "nfu": "んふ",
        "nhe": "んへ",
        "nho": "んほ",
        "nba": "んば",
        "nbi": "んび",
        "nbu": "んぶ",
        "nbe": "んべ",
        "nbo": "んぼ",
        "npa": "んぱ",
        "npi": "んぴ",
        "npu": "んぷ",
        "npe": "んぺ",
        "npo": "んぽ",
        "nma": "んま",
        "nmi": "んみ",
        "nmu": "んむ",
        "nme": "んめ",
        "nmo": "んも",
        "nya": "んや",
        "nyu": "んゆ",
        "nyo": "んよ",
        "nra": "んら",
        "nri": "んり",
        "nru": "んる",
        "nre": "んれ",
        "nro": "んろ",
        "nwa": "んわ",
        "nwo": "んを",
        "xtsu": "っ",
        "ltsu": "っ",
        "kkya": "っきゃ",
        "kkyu": "っきゅ",
        "kkyo": "っきょ",
        "ggya": "っぎゃ",
        "ggyu": "っぎゅ",
        "ggyo": "っぎょ",
        "ssha": "っしゃ",
        "sshu": "っしゅ",
        "ssho": "っしょ",
        "jja": "っじゃ",
        "jju": "っじゅ",
        "jjo": "っじょ",
        "ccha": "っちゃ",
        "cchu": "っちゅ",
        "ccho": "っちょ",
        "nnya": "っにゃ",
        "nnyu": "っにゅ",
        "nnyo": "っにょ",
        "hhya": "っひゃ",
        "hhyu": "っひゅ",
        "hhyo": "っひょ",
        "bbya": "っびゃ",
        "bbyu": "っびゅ",
        "bbyo": "っびょ",
        "ppya": "っぴゃ",
        "ppyu": "っぴゅ",
        "ppyo": "っぴょ",
        "mmya": "っみゃ",
        "mmyu": "っみゅ",
        "mmyo": "っみょ",
        "rrya": "っりゃ",
        "rryu": "っりゅ",
        "rryo": "っりょ",
        "kka": "っか",
        "kki": "っき",
        "kku": "っく",
        "kke": "っけ",
        "kko": "っこ",
        "gga": "っが",
        "ggi": "っぎ",
        "ggu": "っぐ",
        "gge": "っげ",
        "ggo": "っご",
        "ssa": "っさ",
        "sshi": "っし",
        "ssu": "っす",
        "sse": "っせ",
        "sso": "っそ",
        "zza": "っざ",
        "jji": "っじ",
        "zzu": "っず",
        "zze": "っぜ",
        "zzo": "っぞ",
        "tta": "った",
        "cchi": "っち",
        "ttsu": "っつ",
        "tte": "って",
        "tto": "っと",
        "dda": "っだ",
        "ddi": "っぢ",
        "ddu": "っづ",
        "dde": "っで",
        "ddo": "っど",
        "nna": "っな",
        "nni": "っに",
        "nnu": "っぬ",
        "nne": "っね",
        "nno": "っの",
        "hha": "っは",
        "hhi": "っひ",
        "ffu": "っふ",
        "hhe": "っへ",
        "hho": "っほ",
        "bba": "っば",
        "bbi": "っび",
        "bbu": "っぶ",
        "bbe": "っべ",
        "bbo": "っぼ",
        "ppa": "っぱ",
        "ppi": "っぴ",
        "ppu": "っぷ",
        "ppe": "っぺ",
        "ppo": "っぽ",
        "mma": "っま",
        "mmi": "っみ",
        "mmu": "っむ",
        "mme": "っめ",
        "mmo": "っも",
        "yya": "っや",
        "yyu": "っゆ",
        "yyo": "っよ",
        "rra": "っら",
        "rri": "っり",
        "rru": "っる",
        "rre": "っれ",
        "rro": "っろ",
        "wwa": "っわ",
        "wwo": "っを",
        "kya": "きゃ",
        "kyu": "きゅ",
        "kyo": "きょ",
        "gya": "ぎゃ",
        "gyu": "ぎゅ",
        "gyo": "ぎょ",
        "sha": "しゃ",
        "shu": "しゅ",
        "sho": "しょ",
        "ja": "じゃ",
        "ju": "じゅ",
        "jo": "じょ",
        "cha": "ちゃ",
        "chu": "ちゅ",
        "cho": "ちょ",
        "nya": "にゃ",
        "nyu": "にゅ",
        "nyo": "にょ",
        "hya": "ひゃ",
        "hyu": "ひゅ",
        "hyo": "ひょ",
        "bya": "びゃ",
        "byu": "びゅ",
        "byo": "びょ",
        "pya": "ぴゃ",
        "pyu": "ぴゅ",
        "pyo": "ぴょ",
        "mya": "みゃ",
        "myu": "みゅ",
        "myo": "みょ",
        "rya": "りゃ",
        "ryu": "りゅ",
        "ryo": "りょ",
        "tsu": "つ",
        "chi": "ち",
        "shi": "し",
        "ka": "か",
        "ki": "き",
        "ku": "く",
        "ke": "け",
        "ko": "こ",
        "ga": "が",
        "gi": "ぎ",
        "gu": "ぐ",
        "ge": "げ",
        "go": "ご",
        "sa": "さ",
        "su": "す",
        "se": "せ",
        "so": "そ",
        "za": "ざ",
        "ji": "じ",
        "zu": "ず",
        "ze": "ぜ",
        "zo": "ぞ",
        "ta": "た",
        "te": "て",
        "to": "と",
        "da": "だ",
        "di": "ぢ",
        "du": "づ",
        "de": "で",
        "do": "ど",
        "na": "な",
        "ni": "に",
        "nu": "ぬ",
        "ne": "ね",
        "no": "の",
        "ha": "は",
        "hi": "ひ",
        "fu": "ふ",
        "he": "へ",
        "ho": "ほ",
        "ba": "ば",
        "bi": "び",
        "bu": "ぶ",
        "be": "べ",
        "bo": "ぼ",
        "pa": "ぱ",
        "pi": "ぴ",
        "pu": "ぷ",
        "pe": "ぺ",
        "po": "ぽ",
        "ma": "ま",
        "mi": "み",
        "mu": "む",
        "me": "め",
        "mo": "も",
        "ya": "や",
        "yu": "ゆ",
        "yo": "よ",
        "ra": "ら",
        "ri": "り",
        "ru": "る",
        "re": "れ",
        "ro": "ろ",
        "wa": "わ",
        "wo": "を",
        "nn": "ん",
        "a": "あ",
        "i": "い",
        "u": "う",
        "e": "え",
        "o": "お"
    };

    return hiraganaReplaceMap;
 }

 /**
   * provides hiragana -> english map, but preceeded by small tsu
   * 
   * @returns {Map<string, string>} smallTsuHiraganaMap
   */
 function getSmallTsuHiraganaMap() {
    const smallTsuHiraganaMap = {
        "っきゃ": "kkya",
        "っきゅ": "kkyu",
        "っきょ": "kkyo",
        "っぎゃ": "ggya",
        "っぎゅ": "ggyu",
        "っぎょ": "ggyo",
        "っしゃ": "ssha",
        "っしゅ": "sshu",
        "っしょ": "ssho",
        "っじゃ": "jja",
        "っじゅ": "jju",
        "っじょ": "jjo",
        "っちゃ": "ccha",
        "っちゅ": "cchu",
        "っちょ": "ccho",
        "っにゃ": "nnya",
        "っにゅ": "nnyu",
        "っにょ": "nnyo",
        "っひゃ": "hhya",
        "っひゅ": "hhyu",
        "っひょ": "hhyo",
        "っびゃ": "bbya",
        "っびゅ": "bbyu",
        "っびょ": "bbyo",
        "っぴゃ": "ppya",
        "っぴゅ": "ppyu",
        "っぴょ": "ppyo",
        "っみゃ": "mmya",
        "っみゅ": "mmyu",
        "っみょ": "mmyo",
        "っりゃ": "rrya",
        "っりゅ": "rryu",
        "っりょ": "rryo",
        "っか": "kka",
        "っき": "kki",
        "っく": "kku",
        "っけ": "kke",
        "っこ": "kko",
        "っが": "gga",
        "っぎ": "ggi",
        "っぐ": "ggu",
        "っげ": "gge",
        "っご": "ggo",
        "っさ": "ssa",
        "っし": "sshi",
        "っす": "ssu",
        "っせ": "sse",
        "っそ": "sso",
        "っざ": "zza",
        "っじ": "jji",
        "っず": "zzu",
        "っぜ": "zze",
        "っぞ": "zzo",
        "った": "tta",
        "っち": "cchi",
        "っつ": "ttsu",
        "って": "tte",
        "っと": "tto",
        "っだ": "dda",
        "っぢ": "ddi",
        "っづ": "ddu",
        "っで": "dde",
        "っど": "ddo",
        "っな": "nna",
        "っに": "nni",
        "っぬ": "nnu",
        "っね": "nne",
        "っの": "nno",
        "っは": "hha",
        "っひ": "hhi",
        "っふ": "ffu",
        "っへ": "hhe",
        "っほ": "hho",
        "っば": "bba",
        "っび": "bbi",
        "っぶ": "bbu",
        "っべ": "bbe",
        "っぼ": "bbo",
        "っぱ": "ppa",
        "っぴ": "ppi",
        "っぷ": "ppu",
        "っぺ": "ppe",
        "っぽ": "ppo",
        "っま": "mma",
        "っみ": "mmi",
        "っむ": "mmu",
        "っめ": "mme",
        "っも": "mmo",
        "っや": "yya",
        "っゆ": "yyu",
        "っよ": "yyo",
        "っら": "rra",
        "っり": "rri",
        "っる": "rru",
        "っれ": "rre",
        "っろ": "rro",
        "っわ": "wwa",
        "っを": "wwo"
    };

    return smallTsuHiraganaMap;
 }

 /**
   * provides hiragana -> english map
   * 
   * @returns {Map<string, string>} hiraganaMap
   */
 function getHiraganaMap() {
    const hiraganaMap = {
        "きゃ": "kya",
        "きゅ": "kyu",
        "きょ": "kyo",
        "ぎゃ": "gya",
        "ぎゅ": "gyu",
        "ぎょ": "gyo",
        "しゃ": "sha",
        "しゅ": "shu",
        "しょ": "sho",
        "じゃ": "ja",
        "じゅ": "ju",
        "じょ": "jo",
        "ちゃ": "cha",
        "ちゅ": "chu",
        "ちょ": "cho",
        "にゃ": "nya",
        "にゅ": "nyu",
        "にょ": "nyo",
        "ひゃ": "hya",
        "ひゅ": "hyu",
        "ひょ": "hyo",
        "びゃ": "bya",
        "びゅ": "byu",
        "びょ": "byo",
        "ぴゃ": "pya",
        "ぴゅ": "pyu",
        "ぴょ": "pyo",
        "みゃ": "mya",
        "みゅ": "myu",
        "みょ": "myo",
        "りゃ": "rya",
        "りゅ": "ryu",
        "りょ": "ryo",
        "か": "ka",
        "き": "ki",
        "く": "ku",
        "け": "ke",
        "こ": "ko",
        "が": "ga",
        "ぎ": "gi",
        "ぐ": "gu",
        "げ": "ge",
        "ご": "go",
        "さ": "sa",
        "し": "shi",
        "す": "su",
        "せ": "se",
        "そ": "so",
        "ざ": "za",
        "じ": "ji",
        "ず": "zu",
        "ぜ": "ze",
        "ぞ": "zo",
        "た": "ta",
        "ち": "chi",
        "つ": "tsu",
        "て": "te",
        "と": "to",
        "だ": "da",
        "ぢ": "ji",
        "づ": "zu",
        "で": "de",
        "ど": "do",
        "な": "na",
        "に": "ni",
        "ぬ": "nu",
        "ね": "ne",
        "の": "no",
        "は": "ha",
        "ひ": "hi",
        "ふ": "fu",
        "へ": "he",
        "ほ": "ho",
        "ば": "ba",
        "び": "bi",
        "ぶ": "bu",
        "べ": "be",
        "ぼ": "bo",
        "ぱ": "pa",
        "ぴ": "pi",
        "ぷ": "pu",
        "ぺ": "pe",
        "ぽ": "po",
        "ま": "ma",
        "み": "mi",
        "む": "mu",
        "め": "me",
        "も": "mo",
        "や": "ya",
        "ゆ": "yu",
        "よ": "yo",
        "ら": "ra",
        "り": "ri",
        "る": "ru",
        "れ": "re",
        "ろ": "ro",
        "わ": "wa",
        "を": "wo",
        "ん": "n",
        "あ": "a",
        "い": "i",
        "う": "u",
        "え": "e",
        "お": "o"
    };

    return hiraganaMap;
 }

 /**
  * provides katakana -> english map
  * 
  * @returns {Map<string, string>} katakanaMap
  */
 function getKatakanaMap() {
    const katakanaMap = {
        "キャ": "kya",
        "キュ": "kyu",
        "キョ": "kyo",
        "ギャ": "gya",
        "ギュ": "gyu",
        "ギョ": "gyo",
        "シャ": "sha",
        "シュ": "shu",
        "ショ": "sho",
        "ジャ": "ja",
        "ジュ": "ju",
        "ジョ": "jo",
        "チャ": "cha",
        "チュ": "chu",
        "チョ": "cho",
        "ニャ": "nya",
        "ニュ": "nyu",
        "ニョ": "nyo",
        "ヒャ": "hya",
        "ヒュ": "hyu",
        "ヒョ": "hyo",
        "ビャ": "bya",
        "ビュ": "byu",
        "ビョ": "byo",
        "ピャ": "pya",
        "ピュ": "pyu",
        "ピョ": "pyo",
        "ミャ": "mya",
        "ミュ": "myu",
        "ミョ": "myo",
        "リャ": "rya",
        "リュ": "ryu",
        "リョ": "ryo",
        "カ": "ka",
        "キ": "ki",
        "ク": "ku",
        "ケ": "ke",
        "コ": "ko",
        "ガ": "ga",
        "ギ": "gi",
        "グ": "gu",
        "ゲ": "ge",
        "ゴ": "go",
        "サ": "sa",
        "シ": "shi",
        "ス": "su",
        "セ": "se",
        "ソ": "so",
        "ザ": "za",
        "ジ": "ji",
        "ズ": "zu",
        "ゼ": "ze",
        "ゾ": "zo",
        "タ": "ta",
        "チ": "chi",
        "ツ": "tsu",
        "テ": "te",
        "ト": "to",
        "ダ": "da",
        "ヂ": "ji",
        "ヅ": "zu",
        "デ": "de",
        "ド": "do",
        "ナ": "na",
        "ニ": "ni",
        "ヌ": "nu",
        "ネ": "ne",
        "ノ": "no",
        "ハ": "ha",
        "ヒ": "hi",
        "フ": "fu",
        "ヘ": "he",
        "ホ": "ho",
        "バ": "ba",
        "ビ": "bi",
        "ブ": "bu",
        "ベ": "be",
        "ボ": "bo",
        "パ": "pa",
        "ピ": "pi",
        "プ": "pu",
        "ペ": "pe",
        "ポ": "po",
        "マ": "ma",
        "ミ": "mi",
        "ム": "mu",
        "メ": "me",
        "モ": "mo",
        "ヤ": "ya",
        "ユ": "yu",
        "ヨ": "yo",
        "ラ": "ra",
        "リ": "ri",
        "ル": "ru",
        "レ": "re",
        "ロ": "ro",
        "ワ": "wa",
        "ヲ": "wo",
        "ン": "n",
        "ア": "a",
        "イ": "i",
        "ウ": "u",
        "エ": "e",
        "オ": "o"
    };

    return katakanaMap;
 }
//*--[ Kana Maps ]-------------------------------------------------------------


//---[ Logging ]---------------------------------------------------------------
 /**
  * @param {string} funcName
  * @param {string} message
  */
 function log(funcName, message) {
    console.log(`${funcName} - ${message}`);
 }
//*--[ Logging ]---------------------------------------------------------------

//---[ Entry ]-----------------------------------------------------------------
 main();
//*--[ Entry ]-----------------------------------------------------------------
