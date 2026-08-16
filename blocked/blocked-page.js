const para = document.querySelector("#para");
const cont = document.querySelector("#continue");

const access = document.querySelector("#access");

let params = new URLSearchParams(window.location.search);
let website = params.get("site");
para.innerText = `${website} has been blocked by FocusGuard to help you stay focused.`;

cont.addEventListener("click", () => {
    chrome.runtime.sendMessage({
        action : "continue"
    });
    
});

access.addEventListener("click", () => {
    chrome.runtime.sendMessage({
        action : "tempAllow",
        website
    });
    
});

