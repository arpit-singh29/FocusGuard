const back = document.querySelector("#back");

const input = document.querySelector("#site-input");
const addSite = document.querySelector("#site");
const list = document.querySelector("#site-list");

const msg = document.querySelector("#msg");

// Back Button....
back.addEventListener("click", () => {
    window.location.href="../popup/popup.html";
});

// Getting Blocked Sites....
function getBlockedSites(callback){
    chrome.storage.local.get("blockedSites", (result) => {
        let recover = result.blockedSites;

        if (recover === undefined){
            recover = [];
        }
        callback(recover);
    });
}

// Update Function....
function update(recover, siteInput){
    recover.push(siteInput);
    
    chrome.storage.local.set({
        blockedSites:recover
    }, () => {
        render(recover);
        input.value = "";
        msg.innerText = "✅ Website added successfully.";
    });
}

// Render Function....
function render(recover){
    list.innerHTML = "";
    recover.forEach((website, index) => {

        // Websites List....
        const li = document.createElement("li");
        const div = document.createElement("div");
        const span = document.createElement("span");
        const del = document.createElement("button");

        span.innerText = website;

        del.innerText = "Delete";
        del.addEventListener("click", () => {
            removeSite(recover, index);
        });

        div.append(span, del);
        li.append(div);
        list.append(li);
    });
}

// Delete Function....
function removeSite(recover, index){
    recover.splice(index, 1);

    chrome.storage.local.set({
        blockedSites:recover
    }, () => {
        render(recover);
    });
}

// Checking Valid Websites....
async function validWebsite(siteInput){
    const url = `https://dns.google/resolve?name=${siteInput}&type=A`;
    try{
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.Status === 0) {
            return true;
        }
        return false;
    }catch{
        return false;
    }
}

// Recovering Saved Websites....
getBlockedSites((recover) => {
    render(recover);
});

// Adding Websites....
addSite.addEventListener("click", async() => {
    let siteInput = input.value.trim().toLowerCase();

    if (siteInput.startsWith("www.")) {
        siteInput = siteInput.slice(4);
    }

    if (siteInput === ""){
        msg.innerText = "Please enter the website.";
        return;
    }

    const valid = await validWebsite(siteInput);
    if (!valid){
        msg.innerText = "❌ Website does not exist.";
        return;
    }

    getBlockedSites((recover) => {
        if (recover.includes(siteInput)){
            msg.innerText = "Website already exists.";
        }else{
            update(recover, siteInput);
        }
    });
});

