//---[ Main Function ]---------------------------------------------------------
function main() {
    if (isLearningTest()) {
        displayLearningTest();
    }
    else {
        displayNormalTest();
    }
}
//$--[ Main Function ]---------------------------------------------------------

/**
 * @returns {boolean}
 */
function isLearningTest() {
    let res = false;

    if (window.location.href.indexOf("learn") !== -1) {
        res = true;
    }

    return res;
}

function displayNormalTest() {
    const testContainerNode = document.querySelector(".test-container");
    const responseBoxNode   = document.querySelector(".response");

    const test = getNormalTest(getKanji());

    let questionTup = test.shift();
    displayNormalQuestion(questionTup);

    testContainerNode.addEventListener("keydown", (keydownEvent) => {
        let continueTest = keydownEvent.key === "Enter" && test.length >= 0;
        if (continueTest) {
            if (verifyAnswer(questionTup[1])) {
                questionTup = test.shift();
                displayNormalQuestion(questionTup);
            }
            else {
                alert("incorrect");
            }
        }
        else if (keydownEvent.key === "Enter") {
            alert("test done!");
        }
    });

    // convert English -> Hiragana for "reading" questions
    responseBoxNode.addEventListener("input", (inputEvent) => {
        if (questionTup[2] === "reading") {
            changeEnglishToHiragana(inputEvent);
        }
    });
}

function displayLearningTest() {
    const testContainerNode = document.querySelector(".test-container");
    const responseBoxNode   = document.querySelector(".response");

    const test = getLearningTest(getKanji().slice(-5));

    let questionTup = test.shift();
    displayLearningQuestion(questionTup);

    testContainerNode.addEventListener("keydown", (keydownEvent) => {
        let continueTest = keydownEvent.key === "Enter" && test.length >= 0;
        if (continueTest && questionTup[3] === "reading") {
            if (verifyAnswer(questionTup[1])) {
                questionTup = test.shift();
                displayLearningQuestion(questionTup);
            }
            else {
                alert("incorrect reading");
            }
        }
        else if (continueTest && questionTup[3] === "meaning") {
            if (verifyAnswer(questionTup[2])) {
                questionTup = test.shift();
                displayLearningQuestion(questionTup);
            }
            else {
                alert("incorrect meaning");
            }
        }
        else if (keydownEvent.key === "Enter") {
            alert("test done!");
        }
    });

    // convert English -> Hiragana for "reading" questions
    responseBoxNode.addEventListener("input", (inputEvent) => {
        if (questionTup[3] === "reading") {
            changeEnglishToHiragana(inputEvent);
        }
    });
}


/**
 * @param {string[]} questionTup
 */
function displayNormalQuestion(questionTup) {
    const questionDiv = document.querySelector(".kanji");
    const responseDiv = document.querySelector(".response");
    const formatDiv   = document.querySelector(".format");

    if (questionTup) {
        questionDiv.textContent = questionTup[0];
        formatDiv.textContent   = questionTup[2];
    }
    else {
        questionDiv.textContent = "";
        formatDiv.textContent   = "";
    }

    responseDiv.value = "";
}

function displayLearningQuestion(questionTup) {
    let   questionDiv = document.querySelector(".kanji");
    let   helperDiv   = document.querySelector(".helper");
    const responseDiv = document.querySelector(".response");
    const formatDiv   = document.querySelector(".format");

    if (helperDiv === null) {
        helperDiv = document.createElement("div");
        helperDiv.classList.add("helper");

        document.querySelector(".question-box").prepend(helperDiv);
    }

    if (questionTup) {
        questionDiv.remove();
        helperDiv.remove();

        questionDiv = document.createElement("div");
        questionDiv.textContent = `${questionTup[1]} | ${questionTup[2]}`;
        questionDiv.classList.add("helper");
        // questionDiv.classList.add("disappear");
        document.querySelector(".question-box").prepend(questionDiv);

        questionDiv = document.createElement("div");
        questionDiv.textContent = `${questionTup[0]}`;
        questionDiv.classList.add("kanji");
        document.querySelector(".question-box").prepend(questionDiv);

        // questionDiv.textContent = `${questionTup[0]} -> ${questionTup[1]} | ${questionTup[2]}`;
        formatDiv.textContent   = `${questionTup[3]}`;
    }
    else {
        questionDiv.textContent = "";
        formatDiv.textContent   = "";
    }

    responseDiv.value = "";
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
 * @returns {object} hiraganaMap
 */
function getHiraganaMap() {
    const hiraganaMap = {
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
        "shi": "し",
        "chi": "ち",
        "tsu": "つ",
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

    return hiraganaMap;
}

/**
 * - returns a nested array:
 *   - format: [[kanji, reading, meaning], [...], ...]
 * 
 * @returns {[[string]]} kanjiTup
 */
function getKanji() {
    const kanjiTupList = [
        ['上', 'じょう', 'Above'],
        ['下', 'か', 'Below'],
        ['大', 'たい', 'Big'],
        ['工', 'こう', 'Construction'],
        ['八', 'はち', 'Eight'],
        ['入', 'にゅう', 'Enter'],
        ['山', 'さん', 'Mountain'],
        ['口', 'こう', 'Mouth'],
        ['九', 'く', 'Nine'],
        ['一', 'いち', 'One'],
        ['人', 'にん', 'Person'],
        ['力', 'りょく', 'Power'],
        ['川', 'かわ', 'River'],
        ['七', 'しち', 'Seven'],
        ['十', 'じゅう', 'Ten'],
        ['三', 'さん', 'Three'],
        ['二', 'に', 'Two'],
        ['女', 'じょ', 'Woman'],
        ['玉', 'たま', 'Ball'],
        ['本', 'ほん', 'Book'],
        ['子', 'し', 'Child'],
        ['丸', 'まる', 'Circle'],
        ['正', 'せい', 'Correct'],
        ['土', 'ど', 'Dirt'],
        ['犬', 'いぬ', 'Dog'],
        ['夕', 'ゆう', 'Evening'],
        ['出', 'しゅつ', 'Exit'],
        ['目', 'め', 'Eye'],
        ['了', 'りょう', 'Finish'],
        ['火', 'か', 'Fire'],
        ['五', 'ご', 'Five'],
        ['四', 'し', 'Four'],
        ['才', 'さい', 'Genius'],
        ['手', 'て', 'Hand'],
        ['天', 'てん', 'Heaven'],
        ['王', 'おう', 'King'],
        ['左', 'さ', 'Left'],
        ['中', 'ちゅう', 'Middle'],
        ['月', 'げつ', 'Moon'],
        ['々', 'のま', 'Repeater'],
        ['田', 'た', 'Rice Paddy'],
        ['右', 'ゆう', 'Right'],
        ['六', 'ろく', 'Six'],
        ['小', 'しょう', 'Small'],
        ['立', 'りつ', 'Stand'],
        ['丁', 'ちょう', 'Street'],
        ['日', 'にち', 'Sun'],
        ['刀', 'とう', 'Sword'],
        ['千', 'せん', 'Thousand'],
        ['木', 'もく', 'Tree'],
        ['水', 'すい', 'Water'],
        ['白', 'はく', 'White'],
        ['文', 'ぶん', 'Writing'],
        ['円', 'えん', 'Yen']
    ];

    return kanjiTupList;
}


/**
 * - in-place swapping w/ modified Fisher-Yates
 * 
 * @param {Array} arr
 * 
 * @returns {Array} arr
 */
function shuffleFisherYates(arr) {
    for (let swapFrom = 0; swapFrom < arr.length - 1; swapFrom++) {
        let swapTo = Math.floor(Math.random() * (arr.length - 1));

        let temp = arr[swapFrom];
        arr[swapFrom] = arr[swapTo];
        arr[swapTo] = temp;
    }
}

function getNormalTest(kanjiTupList) {
    let test = [];

    kanjiTupList.forEach((tupElem) => {
        test.push([tupElem[0], tupElem[1], "reading"]);
        test.push([tupElem[0], tupElem[2], "meaning"]);
    });

    for (let i = 0; i < 3; i++)
        shuffleFisherYates(test);

    return test;
}

function getLearningTest(kanjiTupList) {
    let test = [];

    kanjiTupList.forEach((tupElem) => {
        test.push([tupElem[0], tupElem[1], tupElem[2], "reading"]);
        test.push([tupElem[0], tupElem[1], tupElem[2], "meaning"]);
    });

    for (let i = 0; i < 3; i++)
        shuffleFisherYates(test);

    return test;
}

/**
 * @param {string} answer
 * @returns {boolean}
 */
function verifyAnswer(answer) {
    const  responseNode = document.querySelector(".response");
    return responseNode.value.toLowerCase() === answer.toLowerCase();
}


//---[ Logging ]---------------------------------------------------------------
/**
 * 
 * @param {string} func 
 * @param {string} msg 
 */
function log(func, msg) {
    console.log(`${func} - ${msg}`);
}
//$--[ Logging ]---------------------------------------------------------------


//---[ Entry ]-----------------------------------------------------------------
main();
//$--[ Entry ]-----------------------------------------------------------------
