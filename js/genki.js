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
 * Creates & returns new Question object w/ English answer
 * 
 * @param {string} question 
 * @param {string[]} answersList
 * @returns {Question} new Question w/ "en" as responseLang
 */
function makeEnQ(question, answersList) {
    return new Question(question, answersList, "en");
}

/**
 * Creates & returns new Question object w/ Japanese answer
 * 
 * @param {string} question 
 * @param {string[]} answersList 
 * @returns {Question} new Question w/ "jp" as responseLang
 */
function makeJpQ(question, answersList) {
    return new Question(question, answersList, "jp");
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
        "sshu": "ッしゅ",
        "ssho": "ッしょ",
        "jja": "ッじゃ",
        "jju": "ッじゅ",
        "jjo": "ッじょ",
        "ccha": "ッちゃ",
        "cchu": "ッちゅ",
        "ccho": "ッちょ",
        "nnya": "ッにゃ",
        "nnyu": "ッにゅ",
        "nnyo": "ッにょ",
        "hhya": "ッひゃ",
        "hhyu": "ッひゅ",
        "hhyo": "ッひょ",
        "bbya": "ッびゃ",
        "bbyu": "ッびゅ",
        "bbyo": "ッびょ",
        "ppya": "ッぴゃ",
        "ppyu": "ッぴゅ",
        "ppyo": "ッぴょ",
        "mmya": "ッみゃ",
        "mmyu": "ッみゅ",
        "mmyo": "ッみょ",
        "rrya": "ッりゃ",
        "rryu": "ッりゅ",
        "rryo": "ッりょ",
        "kka": "ッか",
        "kki": "ッき",
        "kku": "ッく",
        "kke": "ッけ",
        "kko": "ッこ",
        "gga": "ッが",
        "ggi": "ッぎ",
        "ggu": "ッぐ",
        "gge": "ッげ",
        "ggo": "ッご",
        "ssa": "ッさ",
        "sshi": "ッし",
        "ssu": "ッす",
        "sse": "ッせ",
        "sso": "ッそ",
        "zza": "ッざ",
        "jji": "ッじ",
        "zzu": "ッず",
        "zze": "ッぜ",
        "zzo": "ッぞ",
        "tta": "ッた",
        "cchi": "ッち",
        "ttsu": "ッつ",
        "tte": "ッて",
        "tto": "ッと",
        "dda": "ッだ",
        "ddi": "ッぢ",
        "ddu": "ッづ",
        "dde": "ッで",
        "ddo": "ッど",
        "nna": "ッな",
        "nni": "ッに",
        "nnu": "ッぬ",
        "nne": "ッね",
        "nno": "ッの",
        "hha": "ッは",
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
        "a": "ア",
        "i": "い",
        "u": "う",
        "e": "え",
        "o": "お"
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
        makeEnQ("ゼロ", ["0", "zero"]),
        makeEnQ("れい", ["0", "zero"]),
        makeEnQ("いち", ["1", "one"]),
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
        makeEnQ("じゅういち", ["11", "eleven"]),
        makeEnQ("じゅうに", ["12", "twelve"]),
        makeEnQ("じゅうさん", ["13", "thirteen"]),
        makeEnQ("じゅうよん", ["14", "fourteen"]),
        makeEnQ("じゅうし", ["14", "fourteen"]),
        makeEnQ("じゅうご", ["15", "fifteen"]),
        makeEnQ("じゅうろく", ["16", "sixteen"]),
        makeEnQ("じゅうなな", ["17", "seventeen"]),
        makeEnQ("じゅうしち", ["17", "seventeen"]),
        makeEnQ("じゅうはち", ["18", "eighteen"]),
        makeEnQ("じゅうきゅう", ["19", "nineteen"]),
        makeEnQ("じゅうく", ["19", "nineteen"]),
        makeEnQ("にじゅう", ["20", "twenty"]),
        makeEnQ("さんじゅう", ["30", "thirty"]),
        makeEnQ("よんじゅう", ["40", "fourty"]),
        makeEnQ("ごじゅう", ["50", "fifty"]),
        makeEnQ("ろくじゅう", ["60", "sixty"]),
        makeEnQ("ななじゅう", ["70", "seventy"]),
        makeEnQ("はちじゅう", ["80", "eighty"]),
        makeEnQ("きゅうじゅう", ["90", "ninty"]),
        makeEnQ("ひゃく", ["100", "one hundred"]),
    ];

    const arabicList0to100 = [
        makeJpQ("0", ["ぜろ", "れい"]),
        makeJpQ("1", ["いち"]),
        makeJpQ("2", ["に"]),
        makeJpQ("3", ["さん"]),
        makeJpQ("4", ["よん", "し", "よ"]),
        makeJpQ("5", ["ご"]),
        makeJpQ("6", ["ろく"]),
        makeJpQ("7", ["なな", "しち"]),
        makeJpQ("8", ["はち"]),
        makeJpQ("9", ["きゅう", "く"]),
        makeJpQ("10", ["じゅう"]),
        makeJpQ("11", ["じゅういち"]),
        makeJpQ("12", ["じゅうに"]),
        makeJpQ("13", ["じゅうさん"]),
        makeJpQ("14", ["じゅうよん", "じゅうし"]),
        makeJpQ("15", ["じゅうご"]),
        makeJpQ("16", ["じゅうろく"]),
        makeJpQ("17", ["じゅうなな", "じゅうしち"]),
        makeJpQ("18", ["じゅうはち"]),
        makeJpQ("19", ["じゅうきゅう", "じゅうく"]),
        makeJpQ("20", ["にじゅう"]),
        makeJpQ("30", ["さんじゅう"]),
        makeJpQ("40", ["よんじゅう"]),
        makeJpQ("50", ["ごじゅう"]),
        makeJpQ("60", ["ろくじゅう"]),
        makeJpQ("70", ["ななじゅう"]),
        makeJpQ("80", ["はちじゅう"]),
        makeJpQ("90", ["きゅうじゅう"]),
        makeJpQ("100", ["ひゃく"]),
    ];

    const kanjiList = [
        makeJpQ("ゼロ", ["ぜろ"]),
        makeJpQ("一", ["いち"], "jp"),
        makeJpQ("二", ["に"], "jp"),
        makeJpQ("三", ["さん"]),
        makeJpQ("四", ["よん", "し", "よ"]),
        makeJpQ("五", ["ご"]),
        makeJpQ("六", ["ろく"]),
        makeJpQ("七", ["なな", "しち"]),
        makeJpQ("八", ["はち"]),
        makeJpQ("九", ["きゅう", "く"]),
        makeJpQ("十", ["じゅう"]),
        makeJpQ("十一", ["じゅういち"]),
        makeJpQ("十二", ["じゅうに"]),
        makeJpQ("十三", ["じゅうさん"]),
        makeJpQ("十四", ["じゅうよん", "じゅうし"]),

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
        makeEnQ("メアリー", ["mary"]),
        makeEnQ("ハト", ["hart"]),
        makeEnQ("メアリー・ハト", ["mary hart"]),
        makeEnQ("たけし", ["takeshi"]),
        makeEnQ("きむら", ["kimura"]),
        makeEnQ("きむらたけし", ["kimura takeshi"]),
        makeEnQ("木村", ["kimura"]),
        makeEnQ("木村たけし", ["kimura takeshi"]),
        new Question("ロバート", ["robert"], "en"),
        makeEnQ("スミス", ["smith"]),
        new Question("ロバート・スミス", ["robert smith"], "en"),
        new Question("キム", ["kim"], "en"),
        makeEnQ("ソラ", ["sora"]),
        new Question("ソラ・キム", ["sora kim"], "en"),
        makeEnQ("やました", ["yamashita"]),
        makeEnQ("山下", ["yamashita"]),
        makeEnQ("せんせい", ["sensei"]),
        makeEnQ("先生", ["sensei"]),
        new Question("やましたせんせい", ["yamashita sensei"], "en"),
        new Question("山下先生", ["yamashita sensei"], "en"),
        new Question("ジョン", ["john"], "en"),
        new Question("ワン", ["wang"], "en"),
        new Question("ジョン・ワン", ["john wang"], "en"),
        makeEnQ("けん", ["ken"]),
        makeEnQ("健", ["ken"]),
        makeEnQ("すずき", ["suzuki"]),
        makeEnQ("鈴木", ["suzuki"]),
        new Question("すずきけん", ["suzuki ken"], "en"),
        new Question("鈴熊健", ["suzuki ken"], "en"),
        makeEnQ("ゆい", ["yui"]),
        makeEnQ("やまかわ", ["yamakawa"]),
        makeEnQ("山川", ["yamakawa"]),
        new Question("やまかわゆい", ["yamakawa yui"], "en"),
        new Question("山川ゆい", ["yamakawa yui"], "en"),
        makeEnQ("おとうさん", ["father", "dad"]),
        new Question("お父さん", ["father", "dad"], "en"),
        makeEnQ("おかあさん", ["mother", "mom"]),
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

        makeJpQ("teacher", ["せんせい"]),
        makeJpQ("professor", ["せんせい"]),
        makeJpQ("...year student", ["ねんせい"]),
        makeJpQ("major", ["せんこう"]),
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
        makeEnQ("だいがくいんせ", ["graduate student", "grad student"]),
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
        makeEnQ("いちじ", ["1:00"]),
        makeEnQ("にじ", ["2:00"]),
        makeEnQ("さんじ", ["3:00"]),
        makeEnQ("よじ", ["4:00"]),
        makeEnQ("ごじ", ["5:00"]),
        makeEnQ("ろくじ", ["6:00"]),
        makeEnQ("しちじ", ["7:00"]),
        makeEnQ("はちじ", ["8:00"]),
        makeEnQ("くじ", ["9:00"]),
        makeEnQ("じゅうじ", ["10:00"]),
        makeEnQ("じゅういちじ", ["11:00"]),
        makeEnQ("じゅうにじ", ["12:00"]),

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
        makeJpQ("9:00", ["くじ"]),
        makeJpQ("10:00", ["じゅうじ"]),
        makeJpQ("11:00", ["じゅういちじ"]),
        makeJpQ("12:00", ["じゅうにじ"]),

        // new Question("01:30", ["いちじはん"], "jp"),
        // new Question("02:30", ["にじはん"], "jp"),
        // new Question("03:30", ["さんじはん"], "jp"),
        // new Question("04:30", ["よじはん"], "jp"),
    ];

    const ethnicityList = [
        new Question("にほんじん", ["japanese people", "japanese person", "japanese"], "en"),
        new Question("アメリカじん", ["american people", "american person", "american"], "en"),
        new Question("かんこくじん", ["korean people", "korean person", "korean"], "en"),
        makeEnQ("ちゅうごくじん", ["chinese people", "chinese person", "chinese"], "en"),
        new Question("イグリスじん", ["british people", "british person", "british"], "en"),
    ];

    const countryList = [
        makeEnQ("くに", ["country"]),
        makeEnQ("にほん", ["japan"]),
        makeEnQ("アメリカ", ["america"]),
        makeEnQ("イギリス", ["britain"]),
        makeEnQ("かんこく", ["korea"]),
        makeEnQ("ちゅうごく", ["china"]),
    ];

    const schoolYearList = [
        makeEnQ("いちねんせい", ["first year", "year 1", "year one", "1st year"]),
        makeEnQ("にねんせい", ["second year", "year 2", "year two", "2nd year"]),
        makeEnQ("さんねんせい", ["third year", "year 3", "year three", "3rd year"]),
        makeEnQ("よねんせい", ["fourth year", "year 4", "year four", "4th year"]),
        makeEnQ("ごねんせい", ["fifth year", "year 5", "year five", "5th year"]),
        makeEnQ("ろくねんせい", ["sixth year", "year 6", "year six", "6th year"]),
    ]

    const majorsList = [
        makeEnQ("せんこう", ["major"]),
        makeEnQ("アジアけんきゅう", ["asian studies"]),
        makeEnQ("けいざい", ["economics"]),
        makeEnQ("こうがく", ["engineering"]),
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
        // makeEnQ("これ", ["this one"]),
        makeEnQ("それ", ["that one"]),

        makeEnQ("それは", ["that one is"]),

        // makeJpQ("this one", ["これ"]),
        makeJpQ("that one", ["それ"]),

        makeJpQ("that one is", ["それは"]),
    ];

    const foodList = [
        makeEnQ("おいしい", ["delicious", "tasty"]),
        makeEnQ("さかな", ["fish"]),
        makeEnQ("にく", ["meat"]),
        makeEnQ("とんかつ", ["pork cutlet"]),
        makeEnQ("メにゅー", ["menu"]),
        makeEnQ("やさい", ["vegetable"]),
        
        // makeJpQ("美味しい", ["おいしい"]),
        // makeJpQ("魚", ["さかな"]),
        // makeJpQ("肉", ["にく"]),

        makeJpQ("delicious", ["おいしい"]),
        makeJpQ("tasty", ["おいしい"]),
        makeJpQ("fish", ["さかな"]),
        makeJpQ("meat", ["にく"]),
        makeJpQ("pork cutlet", ["とんかつ"]),
        makeJpQ("menu", ["めにゅー"]),
        makeJpQ("vegetable", ["やさい"]),
    ];

    const thingsList = [
        makeEnQ("かさ", ["umbrella"]),
        makeEnQ("かばん", ["bag"]),
        makeEnQ("くつ", ["shoes"]),
        makeEnQ("さいふ", ["wallet"]),
        makeEnQ("ジーンズ", ["jeans"]),

        makeJpQ("umbrella", ["かさ"]),
        makeJpQ("bag", ["かばん"]),
        makeJpQ("shoes", ["くつ"]),
        makeJpQ("wallet", ["さいふ"]),
        makeJpQ("jeans", ["じーんず"]),
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
        makeEnQ("たなか", ["tanaka", "Tanaka"]),
        makeEnQ("やまもと", ["yamamoto", "Yamamoto"]),
        makeEnQ("さくま", ["sakuma", "Sakuma"]),
        makeEnQ("たかはし", ["takahashi", "Takahashi"]),
        makeEnQ("もりかわ", ["morikawa", "Morikawa"]),
        makeEnQ("くまもと", ["kumamoto", "Kumamoto"]),
        makeEnQ("おかやま", ["okayama", "Okayama"]),
        makeEnQ("もりおか", ["morioka", "Morioka"]),
        makeEnQ("よこはま", ["yokohama"]),
        makeEnQ("みと", ["mito"]),
    ];

    const sectionCList = [
        makeEnQ("いちご", ["strawberry", "strawberries"]),
        makeEnQ("だんご", ["dumpling", "dumplings"]),
        makeEnQ("ざぶとん", ["cushion"]),
        makeEnQ("がいこくじん", ["foreigner"]),
        makeEnQ("たんぽぽ", ["dandelion"]),
        makeEnQ("がんぺき", ["cliff"]),
    ];

    return [].concat(
        // sectionBList,
        sectionCList,
    );
}

function getLesson3Kanji() {
    const kanjiReadingList = [
        makeJpQ("一", ["いち", "いっ", "ひと"]),
        makeJpQ("二", ["に", "ふた"]),
        makeJpQ("三", ["さん", "みっ"]),
    ];

    const kanjiMeaningList = [
        makeEnQ("一", ["one"]),
        makeEnQ("二", ["two"]),
        makeEnQ("三", ["three"]),
    ];

    const vocabReadingListOne = [
        makeJpQ("一", ["いち"]),
        makeJpQ("一時", ["いちじ"]),
        makeJpQ("一年生", ["いちねんせい"]),
        makeJpQ("一分", ["いっぷん"]),
        makeJpQ("一つ", ["ひとつ"]),
    ];

    const vocabReadingListOneCustom = [
        // makeJpQ("一", ["いち"]),
        makeJpQ("一時", ["いちじ"]),
        makeJpQ("一年生", ["いちねんせい"]),
        makeJpQ("一分", ["いっぷん"]),
        makeJpQ("一つ", ["ひとつ"]),
        makeJpQ("一日", ["いちにち"]),
        makeJpQ("一月", ["いちがつ"]),
        makeJpQ("１月", ["いちがつ"]),
        makeJpQ("January", ["いちがつ"]),
    ];

    const vocabReadingListTwo = [
        makeJpQ("二", ["に"]),
        makeJpQ("二時", ["にじ"]),
        makeJpQ("二年生", ["にねんせい"]),
        makeJpQ("二つ", ["ふたつ"]),
        makeJpQ("二日間", ["ふつかかん"]),
    ];
    
    const vocabReadingListTwoCustom = [
        // makeJpQ("二", ["に"]),
        makeJpQ("二時", ["にじ"]),
        makeJpQ("二年生", ["にねんせい"]),
        makeJpQ("二つ", ["ふたつ"]),
        makeJpQ("二日", ["ふつか"]),
        makeJpQ("二日間", ["ふつかかん"]),
        makeJpQ("二十", ["にじゅう"]),
        makeJpQ("二百", ["にひゃく"]),
        makeJpQ("二月", ["にがつ"]),
        makeJpQ("２月", ["にがつ"]),
        makeJpQ("February", ["にがつ"]),
    ];

    const vocabReadingListThree = [
        // makeJpQ("三", ["さん"]),
        makeJpQ("三時", ["さんじ"]),
        makeJpQ("三年生", ["さんねんせい"]),
        makeJpQ("三つ", ["みっつ"]),
        makeJpQ("三月", ["さんがつ"]),
        makeJpQ("３月", ["さんがつ"]),
        makeJpQ("March", ["さんがつ"]),
    ];

    const vocabReadingListFour = [
        // makeJpQ("四", ["よん"]),
        makeJpQ("四時", ["よじ"]),
        makeJpQ("四年生", ["よねんせい"]),
        makeJpQ("四つ", ["よっつ"]),
        makeJpQ("四国", ["しこく"]),
        makeJpQ("四月", ["しがつ"]),
        makeJpQ("４月", ["しがつ"]),
        makeJpQ("April", ["しがつ"]),
    ];

    const vocabReadingListFive = [
        // makeJpQ("五", ["ご"]),

        makeJpQ("五時", ["ごじ"]),
        makeJpQ("五歳", ["ごさい"]),
        makeJpQ("五年生", ["ごねんせい"]),
        makeJpQ("五つ", ["いつつ"]),
        makeJpQ("五月", ["ごがつ"]),
        makeJpQ("５月", ["ごがつ"]),
        makeJpQ("May", ["ごがつ"]),
    ];

    const vocabReadingListSix = [
        makeJpQ("六", ["ろく"]),
        makeJpQ("六時", ["ろくじ"]),
        makeJpQ("六百", ["ろっぴゃく"]),
        makeJpQ("六分", ["ろっぷん"]),
        makeJpQ("六つ", ["むっつ"]),
    ];

    const vocabReadingListSixCustom = [ 
        // makeJpQ("六", ["ろく"]),
        
        makeJpQ("六分", ["ろっぷん"]),
        // makeJpQ("六時", ["ろくじ"]),
        makeJpQ("六つ", ["むっつ"]),
        // makeJpQ("六年生", ["ろくねんせい"]),
        // makeJpQ("六歳", ["ろくさい"]),
        // makeJpQ("六十", ["ろくじゅう"]),
        makeJpQ("六百", ["ろっぴゃく"]),
        // makeJpQ("六月", ["ろくがつ"]),
        // makeJpQ("６月", ["ろくがつ"]),
        // makeJpQ("June", ["ろくがつ"]),
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

    return [].concat(
        // kanjiReadingList,
        // kanjiMeaningList,
        // vocabReadingListOne,
        // vocabReadingListTwo,
        vocabReadingListThree,
        vocabReadingListFour,
        vocabReadingListFive,
        // vocabReadingListSix,

        vocabReadingListOneCustom,
        vocabReadingListTwoCustom,
        vocabReadingListSixCustom,
    ); 
}


// Extra Topics
function getGeography() {
    const mainIslandList = [
        makeJpQ("本州", ["ほんしゅう"]),
        makeJpQ("北海道", ["ほっかいど"]),
        makeJpQ("九州", ["きゅうしゅう"]),
        makeJpQ("四国", ["しこく"]),
    ];

    const regionsList = [
        makeJpQ("地方", ["ちほう"]),
        makeJpQ("北海道", ["ほっかいど"]),
        makeJpQ("東北", ["とうほく"]),
        makeJpQ("東北地方", ["とうほくちほう"]),
        makeJpQ("関東", ["かんとう"]),
        makeJpQ("関東地方", ["かんとうちほう"]),
        makeJpQ("中部", ["ちゅうぶ"]),
        makeJpQ("中部地方", ["ちゅうぶちほう"]),
        makeJpQ("関西", ["かんさい"]),
        makeJpQ("関西地方", ["かんさいちほう"]),
        makeJpQ("中国", ["ちゅうごく"]),
        makeJpQ("中国地方", ["ちゅうごくちほう"]),
        makeJpQ("四国", ["しこく"]),
        makeJpQ("九州", ["きゅうしゅう"]),        
    ];

    return [].concat(
        mainIslandList,
        regionsList,
    );
}

function getOldMonths() {
    const readingList = [
        makeJpQ("睦月", ["むつき"]),
        makeJpQ("如月", ["きさらぎ"]),
        makeJpQ("弥生", ["やよい"]),
        makeJpQ("卯月", ["うづき"]),
    ];

    const meaningList = [
        makeEnQ("睦月", ["January", "january", "mutsuki"]),
        makeEnQ("如月", ["February", "february", "kisaragi"]),
        makeEnQ("弥生", ["March", "march", "yayoi"]),
        makeEnQ("卯月", ["April", "april", "uzuki"]),
    ];

    return [].concat(
        readingList,
        meaningList
    ); 
}

// lol
function getGenshinElements() {
    const elementList = [
        makeEnQ("Fire", ["pyro", "Pyro"]),
        makeEnQ("Water", ["hydro", "Hydro"]),
        makeEnQ("Wind", ["anemo", "Anemo"]),
        makeEnQ("Lightning", ["electro", "Electro"]),
        makeEnQ("Earth", ["geo", "Geo"]),
        makeEnQ("Ice", ["cryo", "Cryo"]),
        makeEnQ("Grass", ["dendro", "Dendro"]),
        makeEnQ("Grass", ["dendro", "Dendro"]),
        makeEnQ("Grass", ["dendro", "Dendro"]),
        makeEnQ("Grass", ["dendro", "Dendro"]),

        makeEnQ("Pyro", ["fire"]),
        makeEnQ("Cryo", ["ice"]),
        makeEnQ("Anemo", ["wind"]),
        makeEnQ("Electro", ["lightning", "electric"]),
        makeEnQ("Geo", ["earth"]),
        makeEnQ("Cryo", ["ice"]),
        makeEnQ("Dendro", ["grass"]),
        makeEnQ("Dendro", ["grass"]),
        makeEnQ("Dendro", ["grass"]),
        makeEnQ("Dendro", ["grass"]),
    ];

    return elementList;
}

function getSmtSupportSkills() {
    const supportList = [
        // makeEnQ("Tarukaja", ["single ally atk +1"]),
        // makeEnQ("Rakukaja", ["single ally def +1"]),
        // makeEnQ("Sukukaja", ["single ally acc/ev +1"]),
        makeEnQ("taru", ["atk"]),
        makeEnQ("raku", ["def"]),
        // makeEnQ("suku", ["acc"]),
        // makeEnQ("kaja", ["single ally"]),

        // makeEnQ("single ally atk +1", ["tarukaja"]),
        // makeEnQ("single ally def +1", ["rakukaja"]),
        // makeEnQ("single ally acc/eva +1", ["sukukaja"]),
        makeEnQ("atk", ["taru"]),
        makeEnQ("def", ["raku"]),
        // makeEnQ("acc", ["suku"]),
        // makeEnQ("single ally", ["kaja"]),
    ];

    return supportList;
}

//---[ たんご ]-----------------------------------------------------------------


function getTest() {
    const test = [
        // ...getGenshinElements(),
        // ...getGreetings(),
        // ...getNumbers(),
        // ...getNames(),
        // ...getLesson1(),
        ...getLesson2(),
        // ...getLesson1Kanji(),
        // ...getLesson3Kanji(),
        // ...getGeography(),
        // ...getSmtSupportSkills(),
    ];

    return test;
}


//---[ Entry ]-----------------------------------------------------------------
main();
//---[ Entry ]-----------------------------------------------------------------
