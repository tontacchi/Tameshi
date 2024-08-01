// aliases / binding
const cLog = console.log.bind(console);  // objects & binding is confusing

//---[ Main Function ]---------------------------------------------------------
function main() {
    displayTest();
}
//$--[ Main Function ]---------------------------------------------------------


//---[ Constructors ]----------------------------------------------------------
/**
 * @param {string} question 
 * @param {[string]} answersList 
 * 
 * @returns {Question}
 */
function Question(question, answersList, responseLang) {
    this.question     = question;
    this.answersList  = answersList;
    this.responseLang = responseLang;
}
//---[ Constructors ]----------------------------------------------------------



//---[ Page Rendering ]--------------------------------------------------------
function displayTest() {
    let originalTest = getTest();
    let test         = shuffleTest(originalTest);
    test             = shuffleTestMore(test);

    cLog(`displayTest - test gotten:`);
    cLog(originalTest);
    cLog("shuffled test:");
    cLog(test);

    let question = test.shift();
    displayQuestion(question);

    const testContainerNode = document.querySelector(".test-container");
    const inputNode = document.querySelector(".response");

     // 'r' -> page reload
    document.body.addEventListener("keydown", (event) => {
        if (document.activeElement === inputNode) {
            return;
        }

        console.log("reload firing");
        if (event.key === 'r') {
            console.log("refreshing page");
            window.location.reload();
        }
    });

    testContainerNode.addEventListener("keydown", (event) => {
        cLog(event)
        if (event.key === "Enter") {
            if (question.responseLang === "jp") { forceLastHiraganaN(event); }

            if (verifyAnswer(question.answersList)) {
                if (test.length > 0) {
                    question = test.shift();
                    displayQuestion(question);
                }
                else {
                    // alert("test done!");
                    testContainerNode.remove();
                }
            }
            else { alert("incorrect"); }
        }

        else if (event.key === "F6") {
            cLog("displayTest - changing input from H -> K");
            const responseDiv = document.querySelector(".response");

            responseDiv.removeEventListener("input", changeEnglishToHiragana);
            responseDiv.addEventListener("input", changeEnglishToKatakana);
        }
        else if (event.key === "F7") {
            cLog("displayTest - changing input from K -> H");
            const responseDiv = document.querySelector(".response");

            responseDiv.removeEventListener("input", changeEnglishToKatakana);
            responseDiv.addEventListener("input", changeEnglishToHiragana);
        }
    });
}

/**
 * @param {Question} questionObj
 */
function displayQuestion(questionObj) {
    const question = questionObj.question;
    console.log(`displayQuestion - displaying ${question}`)

    const questionDiv = document.querySelector(".question");
    const responseDiv = document.querySelector(".response");

    questionDiv.textContent = question;
    responseDiv.value = "";

    // reading question -> change input to japanese
    console.log(questionObj);
    if (questionObj.responseLang === "jp") {
        console.log("switched to jp");
        responseDiv.addEventListener("input", changeEnglishToHiragana);
    }
    else {
        responseDiv.removeEventListener("input", changeEnglishToHiragana);
        console.log("displayQuestion - removed language change listener");
    }
}

//---[ Page Rendering ]--------------------------------------------------------



//---[ Page Logic & Functionality ]--------------------------------------------
/**
 * Shuffles test using Fisher-Yates, then 1000 random swaps
 * @param {[Question]} oldTest 
 */
function shuffleTest(oldTest) {
    let test = oldTest.slice();
    // const NUM_SWAPS = 1000;

    // Fisher-Yates
    for (let i = test.length - 1; i >= 0; i--) {
        let j = Math.floor(Math.random() * (test.length - i));
 
        let temp = test[i];
        test[i] = test[j];
        test[j] = temp;
    }

    // 1000 random swaps
    // for (let i = 0; i < NUM_SWAPS; i++) {
    //     let j = Math.floor(Math.random() * (test.length - 1));
    //     let k = Math.floor(Math.random() * (test.length - 1));

    //     let temp = test[k];
    //     test[k] = test[j];
    //     test[j] = temp;
    // }

    return test;
}

function shuffleTestMore(oldTest) {
    let test = oldTest.slice();
    const NUM_SWAPS = 10000;

    for (let i = 0; i < NUM_SWAPS; i++) {
        let j = Math.floor(Math.random() * (test.length - 1));
        let k = Math.floor(Math.random() * (test.length - 1));

        // swap
        let temp = test[k];
        test[k] = test[j];
        test[j] = temp;

        // rotate every 5 swaps
        if (i % 5 === 0)
            test.unshift(test.pop());
    }

    return test;
}

function verifyAnswer(answersList) {
    const responseNode = document.querySelector(".response");

    let answerFound = false;
    for (let i = 0; i < answersList.length; i++) {
        answerFound = responseNode.value === answersList[i];
        if (answerFound) break;
    }
    
    return answerFound;
}

/**
 * - converts English -> Hiragana units greedily in the response box
 * 
 * @param {InputEvent} inputEvent
 */
function changeEnglishToHiragana(inputEvent) {
    const kana = getHiraganaMap();

    let cursorPos = inputEvent.target.selectionStart;
    let inputText = inputEvent.target.value;

    // greedily matches w/ first match in hiragana map
    for (let key in kana) {
        inputText = inputText.replace(new RegExp(key, 'g'), kana[key]);
    }

    // need to calculate new cursor position before removing old text
    cursorPos += inputText.length - inputEvent.target.value.length;
    inputEvent.target.value = inputText;
    inputEvent.target.setSelectionRange(cursorPos, cursorPos);
}

/**
 * @param {InputEvent} inputEvent
 */
function changeEnglishToKatakana(inputEvent) {
    const kana = getKatakanaMap();

    let cursorPos = inputEvent.target.selectionStart;
    let inputText = inputEvent.target.value;

    // greedily matches w/ first match in hiragana map
    for (let key in kana) {
        inputText = inputText.replace(new RegExp(key, 'g'), kana[key]);
    }

    // need to calculate new cursor position before removing old text
    cursorPos += inputText.length - inputEvent.target.value.length;
    inputEvent.target.value = inputText;
    inputEvent.target.setSelectionRange(cursorPos, cursorPos);
}

/**
 * @param {InputEvent} inputEvent 
 */
function forceLastHiraganaN(inputEvent) {
    let cursorPos = inputEvent.target.selectionStart;
    let inputText = inputEvent.target.value;
    
    if (inputText.indexOf("n") !== inputText.length - 1) {
        return;
    }
    inputText = inputText.replace(new RegExp("n", 'g'), "ん");

    cursorPos += inputText.length - inputEvent.target.value.length;
    inputEvent.target.value = inputText;
    inputEvent.target.setSelectionRange(cursorPos, cursorPos);
}

//---[ Page Logic & Functionality ]--------------------------------------------



//---[ Utility ]---------------------------------------------------------------
/**
 * Japanese Question w/ English response
 * 
 * @param {string} question 
 * @param {string[]} answersList
 * @returns {Question} new Question w/ "en" as responseLang
 */
function en(question, answersList) {
    return new Question(question, answersList, "en");
}

/**
 * English Question w/ Hiragana response
 * 
 * @param {string} question 
 * @param {string[]} answersList 
 * @returns {Question} new Question w/ "jp" as responseLang
 */
function jp(question, answersList) {
    return new Question(question, answersList, "jp");
}

/**
 * English Question w/ Katakana response
 * 
 * @param {string} question 
 * @param {string[]} answersList 
 * @returns 
 */
function ka(question, answersList) {
    return new Question(question, answersList, "katakana");
}

/**
 * @returns {Map<string, string>} hiraganaMap
 */
function getHiraganaMap() {
    const hiraganaReplaceMap = {
        "-": "ー",
        "~": "～",
        "nk": "んk",
        "ng": "んg",
        "ns": "んs",
        "nj": "んj",
        "nz": "んz",
        "nt": "んt",
        "nd": "んd",
        "nc": "んc",
        "nh": "んh",
        "nf": "んf",
        "nb": "んb",
        "np": "んp",
        "nm": "んm",
        "nr": "んr",
        "nw": "んw",
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
        "jya": "じゃ",
        "ju": "じゅ",
        "jyu": "じゅ",
        "jo": "じょ",
        "jyo": "じょ",
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
        "tu": "つ",
        "chi": "ち",
        "shi": "し",
        "si": "し",
        "ci": "し",
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
 * @returns {Map<string, string>} katakanaMap
 */
function getKatakanaMap() {
    const katakanaReplaceMap = {
        "-": "ー",
        "~": "～",
        "nk": "ンk",
        "ng": "ンg",
        "ns": "ンs",
        "nj": "ンj",
        "nz": "ンz",
        "nt": "ンt",
        "nd": "ンd",
        "nc": "ンc",
        "nh": "ンh",
        "nf": "ンf",
        "nb": "ンb",
        "np": "ンp",
        "nm": "ンm",
        "nr": "ンr",
        "nw": "ンw",
        "xtsu": "ッ",
        "ltsu": "ッ",
        "kkya": "ッキャ",
        "kkyu": "ッキュ",
        "kkyo": "ッキョ",
        "ggya": "ッギャ",
        "ggyu": "ッギュ",
        "ggyo": "ッギョ",
        "ssha": "ッシャ",
        "sshu": "ッシュ",
        "ssho": "ッショ",
        "jja": "ッジャ",
        "jju": "ッジュ",
        "jjo": "ッジョ",
        "ccha": "ッチャ",
        "cchu": "ッチュ",
        "ccho": "ッチョ",
        "nnya": "ッニャ",
        "nnyu": "ッニュ",
        "nnyo": "ッニョ",
        "hhya": "ッヒャ",
        "hhyu": "ッヒュ",
        "hhyo": "ッヒョ",
        "bbya": "ッビャ",
        "bbyu": "ッビュ",
        "bbyo": "ッビョ",
        "ppya": "ッピャ",
        "ppyu": "ッピュ",
        "ppyo": "ッピョ",
        "mmya": "ッミャ",
        "mmyu": "ッミュ",
        "mmyo": "ッミョ",
        "rrya": "ッリャ",
        "rryu": "ッリュ",
        "rryo": "ッリョ",
        "kka": "ッカ",
        "kki": "ッキ",
        "kku": "ック",
        "kke": "ッケ",
        "kko": "ッコ",
        "gga": "ッガ",
        "ggi": "ッギ",
        "ggu": "ッグ",
        "gge": "ッゲ",
        "ggo": "ッゴ",
        "ssa": "ッサ",
        "sshi": "ッシ",
        "ssu": "ッス",
        "sse": "ッセ",
        "sso": "ッソ",
        "zza": "ッザ",
        "jji": "ッジ",
        "zzu": "ッズ",
        "zze": "ッゼ",
        "zzo": "ッゾ",
        "tta": "ッタ",
        "cchi": "ッチ",
        "ttsu": "ッツ",
        "tte": "ッテ",
        "tto": "ット",
        "dda": "ッダ",
        "ddi": "ッヂ",
        "ddu": "ッヅ",
        "dde": "ッデ",
        "ddo": "ッド",
        "nna": "ッナ",
        "nni": "ッニ",
        "nnu": "ッヌ",
        "nne": "ッネ",
        "nno": "ッノ",
        "hha": "ッは",  // TODO: fix from here
        "hhi": "ッひ",
        "ffu": "ッふ",
        "hhe": "ッへ",
        "hho": "ッほ",
        "bba": "ッば",
        "bbi": "ッび",
        "bbu": "ッぶ",
        "bbe": "ッべ",
        "bbo": "ッぼ",
        "ppa": "ッぱ",
        "ppi": "ッぴ",
        "ppu": "ッぷ",
        "ppe": "ッぺ",
        "ppo": "ッぽ",
        "mma": "ッま",
        "mmi": "ッみ",
        "mmu": "ッむ",
        "mme": "ッめ",
        "mmo": "ッも",
        "yya": "ッや",
        "yyu": "ッゆ",
        "yyo": "ッよ",
        "rra": "ッら",
        "rri": "ッり",
        "rru": "ッる",
        "rre": "ッれ",
        "rro": "ッろ",
        "wwa": "ッわ",
        "wwo": "ッを",
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
        "tu": "つ",
        "chi": "ち",
        "shi": "し",
        "si": "し",
        "ci": "し",
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
        "ji": "ジ",
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
        "ya": "ヤ",
        "yu": "ユ",
        "yo": "ヨ",
        "ra": "ラ",
        "ri": "リ",
        "ru": "ル",
        "re": "レ",
        "ro": "ロ",
        "wa": "ワ",
        "wo": "ヲ",
        "nn": "ン",
        "a": "ア",
        "i": "イ",
        "u": "ウ",
        "e": "エ",
        "o": "オ"
    };

    return katakanaReplaceMap;
}
//---[ Utility ]---------------------------------------------------------------



//---[ たんご ]-----------------------------------------------------------------

// Content before Lesson 1
/**
 * @returns {Question[]} array of Questions
 */
function getGreetings() {
    const greetingList = [
        new Question("おはよう", ["good morning"], "en"),
        new Question("おはようございます", ["good morning", "good morning (polite)"], "en"),
        new Question("こんにちは", ["good afternoon"], "en"),
        new Question("こんばんは", ["good evening"], "en"),
        new Question("さようなら", ["goodbye", "good-bye"], "en"),
        new Question("おやすみ", ["good night"], "en"),
        new Question("おやすみなさい", ["good night"], "en"),
        new Question("ありがとう", ["thank you"], "en"),
        new Question("ありがとうございます", ["thank you", "thank you (polite)"], "en"),
        new Question("すみません", ["excuse me", "im sorry"], "en"),
        new Question("いいえ", ["no", "not at all"], "en"),
        new Question("いってきます", ["ill go and come back", "im going", "im heading out"], "en"),
        new Question("いってらっしゃい", ["please go and come back", "stay safe"], "en"),
        new Question("ただいま", ["im home"], "en"),
        new Question("おかえり", ["welcome home"], "en"),
        new Question("いただきます", ["lets eat", "thank you for the meal"], "en"),
        new Question("ごちそうさま", ["thank you for the meal"], "en"),
        new Question("ごちそうさまでした", ["thank you for the meal"], "en"),
        new Question("はじめまして", ["how do you do", "how do you do?"], "en"),
        new Question("よろしくおねがいします", ["nice to meet you", "im in your care"], "en")
    ];

    return greetingList;
}

/**
 * @returns {Question[]} array of Questions
 */
function getNumbers() {
    const hiraganaList0To100 = [
        en("ゼロ", ["0", "zero"]),
        en("れい", ["0", "zero"]),
        en("いち", ["1", "one"]),
        new Question("に", ["2", "two"], "en"),
        new Question("さん", ["3", "three"], "en"),
        new Question("よん", ["4", "four"], "en"),
        new Question("し", ["4", "four"], "en"),
        new Question("よ", ["4", "four"], "en"),
        new Question("ご", ["5", "five"], "en"),
        new Question("ろく", ["6", "six"], "en"),
        new Question("なな", ["7", "seven"], "en"),
        new Question("しち", ["7", "seven"], "en"),
        new Question("はち", ["8", "eight"], "en"), 
        new Question("きゅう", ["9", "nine"], "en"),
        new Question("く", ["9", "nine"], "en"),
        new Question("じゅう", ["10", "ten"], "en"),
        en("じゅういち", ["11", "eleven"]),
        en("じゅうに", ["12", "twelve"]),
        en("じゅうさん", ["13", "thirteen"]),
        en("じゅうよん", ["14", "fourteen"]),
        en("じゅうし", ["14", "fourteen"]),
        en("じゅうご", ["15", "fifteen"]),
        en("じゅうろく", ["16", "sixteen"]),
        en("じゅうなな", ["17", "seventeen"]),
        en("じゅうしち", ["17", "seventeen"]),
        en("じゅうはち", ["18", "eighteen"]),
        en("じゅうきゅう", ["19", "nineteen"]),
        en("じゅうく", ["19", "nineteen"]),
        en("にじゅう", ["20", "twenty"]),
        en("さんじゅう", ["30", "thirty"]),
        en("よんじゅう", ["40", "fourty"]),
        en("ごじゅう", ["50", "fifty"]),
        en("ろくじゅう", ["60", "sixty"]),
        en("ななじゅう", ["70", "seventy"]),
        en("はちじゅう", ["80", "eighty"]),
        en("きゅうじゅう", ["90", "ninty"]),
        en("ひゃく", ["100", "one hundred"]),
    ];

    const arabicList0to100 = [
        jp("0", ["ぜろ", "れい"]),
        jp("1", ["いち"]),
        jp("2", ["に"]),
        jp("3", ["さん"]),
        jp("4", ["よん", "し", "よ"]),
        jp("5", ["ご"]),
        jp("6", ["ろく"]),
        jp("7", ["なな", "しち"]),
        jp("8", ["はち"]),
        jp("9", ["きゅう", "く"]),
        jp("10", ["じゅう"]),
        jp("11", ["じゅういち"]),
        jp("12", ["じゅうに"]),
        jp("13", ["じゅうさん"]),
        jp("14", ["じゅうよん", "じゅうし"]),
        jp("15", ["じゅうご"]),
        jp("16", ["じゅうろく"]),
        jp("17", ["じゅうなな", "じゅうしち"]),
        jp("18", ["じゅうはち"]),
        jp("19", ["じゅうきゅう", "じゅうく"]),
        jp("20", ["にじゅう"]),
        jp("30", ["さんじゅう"]),
        jp("40", ["よんじゅう"]),
        jp("50", ["ごじゅう"]),
        jp("60", ["ろくじゅう"]),
        jp("70", ["ななじゅう"]),
        jp("80", ["はちじゅう"]),
        jp("90", ["きゅうじゅう"]),
        jp("100", ["ひゃく"]),
    ];

    const kanjiList = [
        jp("ゼロ", ["ぜろ"]),
        jp("一", ["いち"], "jp"),
        jp("二", ["に"], "jp"),
        jp("三", ["さん"]),
        jp("四", ["よん", "し", "よ"]),
        jp("五", ["ご"]),
        jp("六", ["ろく"]),
        jp("七", ["なな", "しち"]),
        jp("八", ["はち"]),
        jp("九", ["きゅう", "く"]),
        jp("十", ["じゅう"]),
        jp("十一", ["じゅういち"]),
        jp("十二", ["じゅうに"]),
        jp("十三", ["じゅうさん"]),
        jp("十四", ["じゅうよん", "じゅうし"]),

    ];

    return [
        // ...hiraganaList0To100,
        // ...arabicList0To100,
        ...kanjiList,
    ];
}

/**
 * @returns {Question[]} array of Questions
 */
function getNames() {
    const namesList = [
        en("メアリー", ["mary"]),
        en("ハト", ["hart"]),
        en("メアリー・ハト", ["mary hart"]),
        en("たけし", ["takeshi"]),
        en("きむら", ["kimura"]),
        en("きむらたけし", ["kimura takeshi"]),
        en("木村", ["kimura"]),
        en("木村たけし", ["kimura takeshi"]),
        new Question("ロバート", ["robert"], "en"),
        en("スミス", ["smith"]),
        new Question("ロバート・スミス", ["robert smith"], "en"),
        new Question("キム", ["kim"], "en"),
        en("ソラ", ["sora"]),
        new Question("ソラ・キム", ["sora kim"], "en"),
        en("やました", ["yamashita"]),
        en("山下", ["yamashita"]),
        en("せんせい", ["sensei"]),
        en("先生", ["sensei"]),
        new Question("やましたせんせい", ["yamashita sensei"], "en"),
        new Question("山下先生", ["yamashita sensei"], "en"),
        new Question("ジョン", ["john"], "en"),
        new Question("ワン", ["wang"], "en"),
        new Question("ジョン・ワン", ["john wang"], "en"),
        en("けん", ["ken"]),
        en("健", ["ken"]),
        en("すずき", ["suzuki"]),
        en("鈴木", ["suzuki"]),
        new Question("すずきけん", ["suzuki ken"], "en"),
        new Question("鈴熊健", ["suzuki ken"], "en"),
        en("ゆい", ["yui"]),
        en("やまかわ", ["yamakawa"]),
        en("山川", ["yamakawa"]),
        new Question("やまかわゆい", ["yamakawa yui"], "en"),
        new Question("山川ゆい", ["yamakawa yui"], "en"),
        en("おとうさん", ["father", "dad"]),
        new Question("お父さん", ["father", "dad"], "en"),
        en("おかあさん", ["mother", "mom"]),
        new Question("お母さん", ["mother", "mom"], "en")
    ];

    return namesList;
}

// Lesson Content
function getLesson1() {
    const schoolList = [
        new Question("せんせい", ["teacher", "professor"], "en"),
        new Question("～ねんせい", ["year student", "...year student"], "en"),
        new Question("せんこう", ["major"], "en"),

        jp("teacher", ["せんせい"]),
        jp("professor", ["せんせい"]),
        jp("...year student", ["ねんせい"]),
        jp("major", ["せんこう"]),
    ];

    const institutionList = [
        new Question("しょうがっこう", ["elementary school", "primary school", "grade school"], "en"),
        new Question("しょうがく", ["elementary school", "primary school", "primary school"], "en"),
        new Question("ちゅうがっこう", ["middle school", "junior high school", "lower secondary school"], "en"),
        new Question("ちゅうがく", ["middle school", "junior high school", "lower secondary school"], "en"),
        new Question("こうとうがっこう", ["high school", "senior high school", "secondary school"], "en"),
        new Question("こうこう", ["high school", "senior high school", "secondary school"], "en"),
        new Question("だいがく", ["college", "university"], "en"),
    ]

    const studentList = [
        new Question("がくせい",      ["student"], "en"),
        new Question("しょうがくせい", ["elementary school student", "primary school student", "grade school student", "elementary schooler"], "en"),
        new Question("ちゅうがくせい", ["middle school student", "junior high school student", "lower secondary school student", "middle schooler"], "en"),
        new Question("こうこうせい",   ["high school student", "senior high school student", "secondary school student", "high schooler"], "en"),
        new Question("じょしこうせい", ["female high school student", "high school girl", "female high schooler"], "en"),
        new Question("だいがくせい",   ["college student", "university student"], "en"),
        new Question("りゅうがくせい", ["international student", "exchange student"], "en"),
        en("だいがくいんせ", ["graduate student", "grad student"]),
    ];

    const personList = [
        new Question("わたし", ["i"], "en"),
        new Question("ともだち", ["friend"], "en"),
        new Question("～さん", ["mr/ms", "mr ms"], "en"),
        new Question("～じん", ["...people", "people"], "en"),
    ];

    const timeList = [
        new Question("いま", ["now"], "en"),
        new Question("ごぜん", ["A.M.", "am", "AM"], "en"),
        new Question("ごご", ["P.M.", "pm", "PM"], "en"),
        new Question("～じ", ["o'clock", "oclock"], "en"),
        new Question("～はん", ["half past", "half"], "en"),

        new Question("now", ["いま"], "jp"),
        new Question("am", ["ごぜん"], "jp"),
        new Question("pm", ["ごご"], "jp"),
        new Question("o'clock", ["じ"], "jp"),
        new Question("half past", ["はん"], "jp"),
    ];

    const clockList = [
        en("いちじ", ["1:00"]),
        en("にじ", ["2:00"]),
        en("さんじ", ["3:00"]),
        en("よじ", ["4:00"]),
        en("ごじ", ["5:00"]),
        en("ろくじ", ["6:00"]),
        en("しちじ", ["7:00"]),
        en("はちじ", ["8:00"]),
        en("くじ", ["9:00"]),
        en("じゅうじ", ["10:00"]),
        en("じゅういちじ", ["11:00"]),
        en("じゅうにじ", ["12:00"]),

        // new Question("いちじはん", ["half past one", "1:30", "1 30"], "en"),
        // new Question("にじはん", ["half past two", "2:30", "2 30"], "en"),
        // new Question("さんじはん", ["half past three", "3:30", "3 30"], "en"),
        // new Question("よじはん", ["half past four", "4:30", "4 40"], "en"),


        new Question("1:00", ["いちじ"], "jp"),
        new Question("2:00", ["にじ"], "jp"),
        new Question("3:00", ["さんじ"], "jp"),
        new Question("4:00", ["よじ"], "jp"),
        new Question("5:00", ["ごじ"], "jp"),
        new Question("6:00", ["ろくじ"], "jp"),
        new Question("7:00", ["しちじ"], "jp"),
        new Question("8:00", ["はちじ"], "jp"),
        jp("9:00", ["くじ"]),
        jp("10:00", ["じゅうじ"]),
        jp("11:00", ["じゅういちじ"]),
        jp("12:00", ["じゅうにじ"]),

        // new Question("01:30", ["いちじはん"], "jp"),
        // new Question("02:30", ["にじはん"], "jp"),
        // new Question("03:30", ["さんじはん"], "jp"),
        // new Question("04:30", ["よじはん"], "jp"),
    ];

    const ethnicityList = [
        new Question("にほんじん", ["japanese people", "japanese person", "japanese"], "en"),
        new Question("アメリカじん", ["american people", "american person", "american"], "en"),
        new Question("かんこくじん", ["korean people", "korean person", "korean"], "en"),
        en("ちゅうごくじん", ["chinese people", "chinese person", "chinese"], "en"),
        new Question("イグリスじん", ["british people", "british person", "british"], "en"),
    ];

    const countryList = [
        en("くに", ["country"]),
        en("にほん", ["japan"]),
        en("アメリカ", ["america"]),
        en("イギリス", ["britain"]),
        en("かんこく", ["korea"]),
        en("ちゅうごく", ["china"]),
    ];

    const schoolYearList = [
        en("いちねんせい", ["first year", "year 1", "year one", "1st year"]),
        en("にねんせい", ["second year", "year 2", "year two", "2nd year"]),
        en("さんねんせい", ["third year", "year 3", "year three", "3rd year"]),
        en("よねんせい", ["fourth year", "year 4", "year four", "4th year"]),
        en("ごねんせい", ["fifth year", "year 5", "year five", "5th year"]),
        en("ろくねんせい", ["sixth year", "year 6", "year six", "6th year"]),
    ]

    const majorsList = [
        en("せんこう", ["major"]),
        en("アジアけんきゅう", ["asian studies"]),
        en("けいざい", ["economics"]),
        en("こうがく", ["engineering"]),
    ];

    return [].concat(
        // schoolList,
        // institutionList,
        // studentList,
        // personList,
        timeList,
        clockList,
        ethnicityList,
        countryList,
    );
}

function getLesson2() {
    const pointList = [
        // en("これ", ["this one"]),
        en("それ", ["that one"]),

        en("それは", ["that one is"]),

        // jp("this one", ["これ"]),
        jp("that one", ["それ"]),

        jp("that one is", ["それは"]),
    ];

    const foodList = [
        en("おいしい", ["delicious", "tasty"]),
        en("さかな", ["fish"]),
        en("にく", ["meat"]),
        en("とんかつ", ["pork cutlet"]),
        en("メにゅー", ["menu"]),
        en("やさい", ["vegetable"]),
        
        // jp("美味しい", ["おいしい"]),
        // jp("魚", ["さかな"]),
        // jp("肉", ["にく"]),

        jp("delicious", ["おいしい"]),
        jp("tasty", ["おいしい"]),
        jp("fish", ["さかな"]),
        jp("meat", ["にく"]),
        jp("pork cutlet", ["とんかつ"]),
        jp("menu", ["めにゅー"]),
        jp("vegetable", ["やさい"]),
    ];

    const thingsList = [
        en("かさ", ["umbrella"]),
        en("かばん", ["bag"]),
        en("くつ", ["shoes"]),
        en("さいふ", ["wallet"]),
        en("ジーンズ", ["jeans"]),

        jp("umbrella", ["かさ"]),
        jp("bag", ["かばん"]),
        jp("shoes", ["くつ"]),
        jp("wallet", ["さいふ"]),
        jp("jeans", ["じーんず"]),
    ];

    return [].concat(
        pointList,
        foodList,
        thingsList,
    );
}

// Reading & Writing Content
function getLesson1Kanji() {
    const sectionBList = [
        en("たなか", ["tanaka", "Tanaka"]),
        en("やまもと", ["yamamoto", "Yamamoto"]),
        en("さくま", ["sakuma", "Sakuma"]),
        en("たかはし", ["takahashi", "Takahashi"]),
        en("もりかわ", ["morikawa", "Morikawa"]),
        en("くまもと", ["kumamoto", "Kumamoto"]),
        en("おかやま", ["okayama", "Okayama"]),
        en("もりおか", ["morioka", "Morioka"]),
        en("よこはま", ["yokohama"]),
        en("みと", ["mito"]),
    ];

    const sectionCList = [
        en("いちご", ["strawberry", "strawberries"]),
        en("だんご", ["dumpling", "dumplings"]),
        en("ざぶとん", ["cushion"]),
        en("がいこくじん", ["foreigner"]),
        en("たんぽぽ", ["dandelion"]),
        en("がんぺき", ["cliff"]),
    ];

    return [].concat(
        // sectionBList,
        sectionCList,
    );
}

function getLesson3Kanji() {
    const kanjiReadingList = [
        jp("一", ["いち", "いっ", "ひと"]),
        jp("二", ["に", "ふた"]),
        jp("三", ["さん", "みっ"]),
    ];

    const kanjiMeaningList = [
        en("一", ["one"]),
        en("二", ["two"]),
        en("三", ["three"]),
    ];

    const vocabReadingListOne = [
        jp("一", ["いち"]),
        jp("一時", ["いちじ"]),
        jp("一年生", ["いちねんせい"]),
        jp("一分", ["いっぷん"]),
        jp("一つ", ["ひとつ"]),
    ];

    const vocabReadingListTwo = [
        jp("二", ["に"]),
        jp("二時", ["にじ"]),
        jp("二年生", ["にねんせい"]),
        jp("二つ", ["ふたつ"]),
        jp("二日間", ["ふつかかん"]),
    ];

    const vocabReadingListThree = [
        jp("三", ["さん"]),
        jp("三時", ["さんじ"]),
        jp("三年生", ["さんねんせい"]),
        jp("三月", ["さんがつ"]),
        jp("三つ", ["みっつ"]),
    ];

    const vocabReadingListFour = [
        jp("四", ["よん"]),
        jp("四時", ["よじ"]),
        jp("四年生", ["よねんせい"]),
        jp("四月", ["しがつ"]),
        jp("四つ", ["よっつ"]),
    ];

    const vocabReadingListFive = [
        jp("五", ["ご"]),
        jp("五時", ["ごじ"]),
        jp("五月", ["ごがつ"]),
        jp("五歳", ["ごさい"]),
        jp("五つ", ["いつつ"]),
    ];

    const vocabReadingListSix = [
        jp("六", ["ろく"]),
        jp("六時", ["ろくじ"]),
        jp("六百", ["ろっぴゃく"]),
        jp("六分", ["ろっぷん"]),
        jp("六つ", ["むっつ"]),
    ];

    // Patterns seen:
    // - oclock
    // - minutes
    // - things
    // - year in school
    // - age
    // - tens
    // - hundreds
    // - month

    // extended vocabulary
    const vocabReadingListOneCustom = [
        // jp("一", ["いち"]),
        jp("一時", ["いちじ"]),
        jp("一年生", ["いちねんせい"]),
        jp("一分", ["いっぷん"]),
        jp("一つ", ["ひとつ"]),
        jp("一日", ["いちにち"]),
        jp("一月", ["いちがつ"]),
        jp("１月", ["いちがつ"]),
        jp("January", ["いちがつ"]),
    ];

    const vocabReadingListTwoCustom = [
        // jp("二", ["に"]),
        jp("二時", ["にじ"]),
        jp("二年生", ["にねんせい"]),
        jp("二つ", ["ふたつ"]),
        jp("二日", ["ふつか"]),
        jp("二日間", ["ふつかかん"]),
        jp("二十", ["にじゅう"]),
        jp("二百", ["にひゃく"]),
        jp("二月", ["にがつ"]),
        jp("２月", ["にがつ"]),
        jp("February", ["にがつ"]),
    ];

    const vocabReadingListThreeCustom = [
        jp("三", ["さん"]),
        jp("三時", ["さんじ"]),
        jp("三年生", ["さんねんせい"]),
        jp("三つ", ["みっつ"]),
        jp("三月", ["さんがつ"]),
        jp("３月", ["さんがつ"]),
        jp("March", ["さんがつ"]),
    ];

    const vocabReadingListFourCustom = [
        jp("四", ["よん"]),
        jp("四時", ["よじ"]),
        jp("四年生", ["よねんせい"]),
        jp("四つ", ["よっつ"]),
        jp("四国", ["しこく"]),
        jp("四月", ["しがつ"]),
        jp("４月", ["しがつ"]),
        jp("April", ["しがつ"]),
    ];

    const vocabReadingListFiveCustom = [
        jp("五", ["ご"]),
        jp("五時", ["ごじ"]),
        jp("五歳", ["ごさい"]),
        jp("五年生", ["ごねんせい"]),
        jp("五つ", ["いつつ"]),
        jp("五月", ["ごがつ"]),
        jp("５月", ["ごがつ"]),
        jp("May", ["ごがつ"]),
    ];

    const vocabReadingListSixCustom = [ 
        // jp("六", ["ろく"]),
        
        jp("六分", ["ろっぷん"]),
        // jp("六時", ["ろくじ"]),
        jp("六つ", ["むっつ"]),
        // jp("六年生", ["ろくねんせい"]),
        // jp("六歳", ["ろくさい"]),
        // jp("六十", ["ろくじゅう"]),
        jp("六百", ["ろっぴゃく"]),
        // jp("六月", ["ろくがつ"]),
        // jp("６月", ["ろくがつ"]),
        // jp("June", ["ろくがつ"]),
    ];

    return [].concat(
        // kanjiReadingList,
        // kanjiMeaningList,
        vocabReadingListOneCustom,
        vocabReadingListTwoCustom,
        vocabReadingListThreeCustom,
        vocabReadingListFourCustom,
        vocabReadingListFiveCustom,
        vocabReadingListSixCustom,
    ); 
}


// Extra Topics
function getGeography() {
    const mainIslandsList = [
        jp("本州", ["ほんしゅう"]),
        jp("北海道", ["ほっかいど"]),
        jp("九州", ["きゅうしゅう"]),
        jp("四国", ["しこく"]),
    ];

    const regionsList = [
        jp("地方", ["ちほう"]),
        jp("北海道", ["ほっかいど"]),
        jp("東北", ["とうほく"]),
        jp("東北地方", ["とうほくちほう"]),
        jp("関東", ["かんとう"]),
        jp("関東地方", ["かんとうちほう"]),
        jp("中部", ["ちゅうぶ"]),
        jp("中部地方", ["ちゅうぶちほう"]),
        jp("関西", ["かんさい"]),
        jp("関西地方", ["かんさいちほう"]),
        jp("中国", ["ちゅうごく"]),
        jp("中国地方", ["ちゅうごくちほう"]),
        jp("四国", ["しこく"]),
        jp("九州", ["きゅうしゅう"]),        
    ];

    return [].concat(
        mainIslandsList,
        regionsList,
    );
}

function getOldMonths() {
    const readingList = [
        jp("睦月", ["むつき"]),
        jp("如月", ["きさらぎ"]),
        jp("弥生", ["やよい"]),
        jp("卯月", ["うづき"]),
    ];

    const meaningList = [
        en("睦月", ["January", "january", "mutsuki"]),
        en("如月", ["February", "february", "kisaragi"]),
        en("弥生", ["March", "march", "yayoi"]),
        en("卯月", ["April", "april", "uzuki"]),
    ];

    return [].concat(
        readingList,
        meaningList
    ); 
}

// lol
function getGenshinElements() {
    const elementList = [
        en("Fire", ["pyro", "Pyro"]),
        en("Water", ["hydro", "Hydro"]),
        en("Wind", ["anemo", "Anemo"]),
        en("Lightning", ["electro", "Electro"]),
        en("Earth", ["geo", "Geo"]),
        en("Ice", ["cryo", "Cryo"]),
        en("Grass", ["dendro", "Dendro"]),
        en("Grass", ["dendro", "Dendro"]),
        en("Grass", ["dendro", "Dendro"]),
        en("Grass", ["dendro", "Dendro"]),

        en("Pyro", ["fire"]),
        en("Cryo", ["ice"]),
        en("Anemo", ["wind"]),
        en("Electro", ["lightning", "electric"]),
        en("Geo", ["earth"]),
        en("Cryo", ["ice"]),
        en("Dendro", ["grass"]),
        en("Dendro", ["grass"]),
        en("Dendro", ["grass"]),
        en("Dendro", ["grass"]),
    ];

    return elementList;
}

function getSmtSupportSkills() {
    const supportList = [
        // en("Tarukaja", ["single ally atk +1"]),
        // en("Rakukaja", ["single ally def +1"]),
        // en("Sukukaja", ["single ally acc/ev +1"]),
        en("taru", ["atk"]),
        en("raku", ["def"]),
        // en("suku", ["acc"]),
        // en("kaja", ["single ally"]),

        // en("single ally atk +1", ["tarukaja"]),
        // en("single ally def +1", ["rakukaja"]),
        // en("single ally acc/eva +1", ["sukukaja"]),
        en("atk", ["taru"]),
        en("def", ["raku"]),
        // en("acc", ["suku"]),
        // en("single ally", ["kaja"]),
    ];

    return supportList;
}

function katakanaPractice() {
    const meaningList = [
        en("ハロー", ["hello"]),
        en("マイ", ["my"]),
        en("ネーム", ["name"]),
        en("イズ", ["is"]),
        en("マミ", ["mami"]),
    ];

    const readingList = [
        jp("hello", ["ハロー"]),
        jp("my", ["マイ"]),
        jp("name", ["ネーム"]),
        jp("is", ["イズ"]),
        jp("mami", ["マミ"]),
    ];

    return [].concat(
        meaningList,
        // readingList,
    );
}

//---[ たんご ]-----------------------------------------------------------------


function getTest() {
    const test = [
        // ...getGenshinElements(),
        // ...getGreetings(),
        // ...getNumbers(),
        // ...getNames(),
        // ...getLesson1(),
        // ...getLesson2(),
        // ...getLesson1Kanji(),
        // ...getLesson3Kanji(),
        // ...getGeography(),
        // ...getSmtSupportSkills(),
        ...katakanaPractice(),
    ];

    return test;
}


//---[ Entry ]-----------------------------------------------------------------
main();
//---[ Entry ]-----------------------------------------------------------------
