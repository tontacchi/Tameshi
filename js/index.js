// binds
cLog = console.log.bind(console);

//---[ Main Function ]---------------------------------------------------------
function main() {
    document.addEventListener("keypress", (event) => {
        if (event.key === "r")
            loadGenki();
    });
}
//$--[ Main Function ]---------------------------------------------------------



//---[ Callback Functions ]----------------------------------------------------
function loadGenki() {
    window.location.href = "genki.html";
}

//$--[ Callback Functions ]----------------------------------------------------


//---[ Utility Functions ]-----------------------------------------------------


//$--[ Utility Functions ]-----------------------------------------------------


//---[ Entry ]-----------------------------------------------------------------
main();
//$--[ Entry ]-----------------------------------------------------------------
