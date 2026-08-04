const toggle = document.querySelector("#toggle-btn");
const block = document.querySelector("#block-btn");
const dash = document.querySelector("#dash-btn");

// To get the result from the chrome used get()....
chrome.storage.local.get("focusMode", (result) => {
    updateBtn(result.focusMode);
});

// Used function to follow DRY Principle....
function updateBtn(focusMode){
    if (focusMode===true){
        toggle.innerText="ON";
        toggle.style.backgroundColor="rgb(34, 197, 94)";
    }
    if (focusMode===false){
        toggle.innerText="OFF";
        toggle.style.backgroundColor="rgb(107, 114, 128)";
    }
}

// Getting Dashboard....
function getDashboard(callback){
    chrome.storage.local.get("dashboard", (result) => {
        let dashboard = result.dashboard;
        if (!dashboard){
            dashboard = {
                blockedCount : 0,
                totalFocusTime : 0,
                streak : 0,
                lastUsedDate : "",
            } 
        }
        callback(dashboard);
    });
}

// Update Streak....
function updateStreak(dashboard){
    const today = new Date().toDateString();
    if (dashboard.lastUsedDate === ""){
        dashboard.streak = 1;
        dashboard.lastUsedDate = today;
    }
    else if (dashboard.lastUsedDate === today){
    }
    else{
        const lastDate = new Date(dashboard.lastUsedDate);
        const currentDate = new Date(today);

        let subtract = (currentDate - lastDate) / (24 * 60 * 60 * 1000);
        if (subtract === 1){
            dashboard.streak++;
            dashboard.lastUsedDate = today;
        }
        else{
            dashboard.streak = 1;
            dashboard.lastUsedDate = today;
        }
    }
    chrome.storage.local.set({
        dashboard : dashboard,
    });
}

// Added eventListener also ON/OFF concept and stored data using set()....
toggle.addEventListener("click", () => {
    const text = toggle.innerText;

    if (text==="ON"){
        chrome.storage.local.get("focusStartTime", (result) => {
            const focusStartTime = result.focusStartTime;
            if (!focusStartTime){
                return;
            }
            
            const currentTime = Date.now();
            const timeSpent = currentTime - focusStartTime;

            getDashboard((dashboard) => {
                dashboard.totalFocusTime += timeSpent;
                chrome.storage.local.set({
                    dashboard : dashboard,
                }, () => {
                    chrome.storage.local.remove("focusStartTime");
                    chrome.storage.local.set({
                        focusMode:false
                    }, () => {
                        updateBtn(false);
                    });
                    chrome.alarms.clear("dailyStreak");                
                });
            });
        });
    }
    else{
        chrome.storage.local.set({
        focusMode:true,
        focusStartTime:Date.now(),
        }, () => {
            updateBtn(true);
        });

        const now = new Date();
        const midNight = new Date(now);

        midNight.setDate(midNight.getDate() + 1);
        midNight.setHours(0,0,0,0);

        chrome.alarms.create("dailyStreak", {
            when : midNight.getTime(),
            periodInMinutes : 1440,
        });

        getDashboard((dashboard) => {
            updateStreak(dashboard);
        });
    }

});

// Added eventListener to Blocked sites....
block.addEventListener("click", () => {
    window.location.href="../blocked/blocked.html"
});

// Added eventListener to Dashboard....
dash.addEventListener("click", () => {
    window.location.href="../dashboard/dashboard.html"
});
