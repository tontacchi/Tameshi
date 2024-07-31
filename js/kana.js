//---[ Classes ]---------------------------------------------------------------
class Dict {
    constructor() {
        this.items = {};
    }

    set(key, value) {
        this.items[key] = value;
    }

    get(key) {
        return this.items[key];
    }

    has(key) {
        return key in this.items;
    }

    delete(key) {
        if (this.has(key)) {
            delete this.items[key];
            return true;
        }
        return false;
    }

    keys() {
        return Object.keys(this.items);
    }

    values() {
        return Object.values(this.items);
    }

    items() {
        return Object.entries(this.items);
    }

    clear() {
        this.items = {};
    }

    size() {
        return Object.keys(this.items).length;
    }
}
//$--[ Classes ]---------------------------------------------------------------


//---[ Main Function ]---------------------------------------------------------
function main() {
    hiragana = getHiraganaMap();
    test = makeTest(hiragana);
    questionTup = test.shift();
    displayQuestion(questionTup[0]);

    const testContainerNode = document.querySelector(".test-container");
    testContainerNode.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && test.length > 0) {
            if (verifyAnswer(questionTup[1])) {
                questionTup = test.shift();
                displayQuestion(questionTup[0]);
            }
            else {
                alert("incorrect");
            }
        }
        else if (event.key === "Enter") {
            alert("test done!");
        }
    });
}
//$--[ Main Function ]---------------------------------------------------------



//---[ Document Setup ]--------------------------------------------------------
/**
 * @param {string} question 
 */
function displayQuestion(question) {
    const questionDiv = document.querySelector(".question");
    const responseDiv = document.querySelector(".response");

    questionDiv.textContent = question;
    responseDiv.value = "";
}

//$--[ Document Setup ]--------------------------------------------------------



//---[ Callback Functions ]----------------------------------------------------
function clearSite() {
    bodyNode = document.querySelector("body");

    for (let i = 0; i < bodyNode.children.length; i++) {
        if (bodyNode.children[0].nodeName !== "SCRIPT") {
            bodyNode.removeChild(bodyNode.children[0]);
        }
        else {
            break;
        }
    }
}

/**
 * @returns {Dict}
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
 * @returns {Dict}
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

//$--[ Callback Functions ]----------------------------------------------------


//---[ Utility Functions ]-----------------------------------------------------
/**
 * @param {string} response 
 * @param {string} answer
 * 
 * @returns {boolean}
 */
function verifyAnswer(answer) {
    const responseNode = document.querySelector(".response");
    let res = responseNode.value === answer;
    
    return res;
}

/**
 * @param {Dict} kanaDict 
 */
function makeTest(kanaDict) {
    let test = [];

    Object.keys(kanaDict).forEach((key) => {
        let value = kanaDict[key];
        test.push([key, value]);
    });

    // shuffle w/ Fisher-Yates
    for (let i = test.length - 1; i >= 0; i--) {
        let j = Math.floor(Math.random() * (test.length - 1));
        
        let temp = test[i];
        test[i] = test[j];
        test[j] = temp;
    }

    return test;
}

//$--[ Utility Functions ]-----------------------------------------------------



//---[ Logging ]---------------------------------------------------------------
/**
 * @param {string} func 
 * @param {string} msg
 * 
 * @returns {null} 
 */
function log(func, msg) {
    console.log(`${func} - ${msg}`);
}
//$--[ Logging ]---------------------------------------------------------------


//---[ Entry ]-----------------------------------------------------------------
main();
//$--[ Entry ]-----------------------------------------------------------------
