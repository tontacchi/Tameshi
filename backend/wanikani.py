#---[ Global Imports ]---------------------------------------------------------
import requests
from   bs4 import BeautifulSoup as BS, Tag, ResultSet
from   pathlib import Path

import pickle

#---[ Global Imports ]---------------------------------------------------------


#---[ Main Function ]----------------------------------------------------------
def main() -> None:
    # files = ("kanji.pickle", "vocab.pickle")
    files = ("kanji.pickle", )

    for fileName in files[:]:
        jpList: list[tuple] = []
        with open(fileName, "rb") as inFile:
            jpList = pickle.load(inFile)
        
        for tup in jpList[:60]:
            print(f"{list(tup)},")

    return

#---[ Main Function ]----------------------------------------------------------

# scraping & storing
def getRadicals() -> None:
    groupNames = [
        "death",
        "hell",
        "paradise",
        "reality"
    ]

    for g in groupNames:
        scrapeRadicals(g)

    return

def scrapeRadicals(difficulty: str) -> list[list, list]:
    # BeautifulSoup boilerplate
    url = f"https://www.wanikani.com/radicals?difficulty={difficulty}"
    parser = "lxml"
    page = requests.get(url)
    soup = BS(page.content, parser)

    # targets content div, radical image, & meaning
    contentTarget = "subject-character__content"
    radicalTarget = "subject-character__characters"
    meaningTarget = "subject-character__meaning"

    divList: ResultSet[Tag] = soup.find_all("div", class_=contentTarget)
    for divTag in divList:
        radicalTag = divTag.find("span", class_=radicalTarget)
        meaningTag = divTag.find("span", class_=meaningTarget)

        radical = radicalTag.getText()
        characterImageTag = None

        # not a "real" radical. scrape svg used
        if radical == "":
            characterImageTag = divTag.find("wk-character-image")
            page = requests.get(characterImageTag["src"])
            radicalMeaning = characterImageTag["aria-label"]

            with open(f"radical-svgs\\{radicalMeaning}.svg", 'wb') as outFile:
                outFile.write(page.content)
        
        print("-" * 40)
        print(radicalTag)
        print(meaningTag)
        print(radical)
        print("-" * 40)
        print("\n")

    return [[], []]

def getKanji() -> list[tuple[str,str,str]]:
    groupNames = [
        "pleasant",
        "painful",
        "death",
        "hell",
        "paradise",
        "reality"
    ]

    kanjiList = []
    for group in groupNames:
        kanjiList += scrapeKanji(group)
    
    return kanjiList

def scrapeKanji(difficulty: str) -> list[tuple[str,str,str]]:
    kanjiList = []

    # BeautifulSoup boilerplate
    url = f"https://www.wanikani.com/kanji?difficulty={difficulty}"
    parser = "lxml"
    page = requests.get(url)
    soup = BS(page.content, parser)

    # targets content div, kanji image, reading & meaning
    contentClassName = "subject-character__content"
    kanjiClassName   = "subject-character__characters"
    readingClassName = "subject-character__reading"
    meaningClassName = "subject-character__meaning"

    divList: ResultSet[Tag] = soup.find_all("div", class_=contentClassName)
    for div in divList:
        kanjiTag   = div.find("span", class_=kanjiClassName)
        readingTag = div.find("span", class_=readingClassName)
        meaningTag = div.find("span", class_=meaningClassName)

        kanji   = kanjiTag.get_text()
        reading = readingTag.get_text()
        meaning = meaningTag.get_text()

        kanjiTup = (kanji, reading, meaning)
        kanjiList.append(kanjiTup)

    return kanjiList

def getVocabulary() -> None:
    groupNames = [
        "pleasant",
        "painful",
        "death",
        "hell",
        "paradise",
        "reality"
    ]

    vocabList = []
    for group in groupNames:
        vocabList += scrapeVocabulary(group)
    
    return vocabList
    

def scrapeVocabulary(difficulty: str) -> list[list]:
    vocabList = []

    # BeautifulSoup boilerplate
    url = f"https://www.wanikani.com/vocabulary?difficulty={difficulty}"
    parser = "lxml"
    page = requests.get(url)
    soup = BS(page.content, parser)

    # targets content div, kanji image, reading & meaning
    contentClassName = "subject-character__content"
    vocabClassName   = "subject-character__characters"
    readingClassName = "subject-character__reading"
    meaningClassName = "subject-character__meaning"

    divList: ResultSet[Tag] = soup.find_all("div", class_=contentClassName)
    for div in divList:
        vocabTag   = div.find("span", class_=vocabClassName)
        readingTag = div.find("span", class_=readingClassName)
        meaningTag = div.find("span", class_=meaningClassName)

        vocab = vocabTag.get_text()
        reading = readingTag.get_text()
        meaning = meaningTag.get_text()

        vocabTup = (vocab, reading, meaning)
        vocabList.append(vocabTup)

    return vocabList


#---[ Entry ]------------------------------------------------------------------
if __name__ == "__main__":
    main()
#---[ Entry ]------------------------------------------------------------------
