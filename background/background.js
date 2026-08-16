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
            };    
        }
        callback(dashboard);
    });
}

// Getting Blocked Sites....
function getWeekDetails(callback){
    chrome.storage.local.get("weeklyHistory", (result) => {
        let weeklyHistory = result.weeklyHistory;

        if (!weeklyHistory){
            weeklyHistory = [];
        }

        callback(weeklyHistory);
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

// Restart, Reload, Installed, Update....
function restartFM(){
    chrome.storage.local.get("focusMode", (result) => {
        if (result.focusMode === true){
            getDashboard((dashboard)=> {
                updateStreak(dashboard);

                const now = new Date();
                const midNight = new Date(now);

                midNight.setDate(midNight.getDate() + 1);
                midNight.setHours(0,0,0,0);

                chrome.alarms.create("dailyStreak", {
                    when : midNight.getTime(),
                    periodInMinutes : 1440,
                });
            }); 
        }
    });
}

const alarmTime = 5;
const timeLimit = alarmTime * 60 * 1000; 

// Background Function....
function checkWebsite(tabId, changeInfo, tab){
    if (changeInfo.status !== "complete"){                           // Page Finishes Loading....
        return;
    }

    if (                                                             // Skips all these....
        !tab.url ||
        tab.url.startsWith("chrome-extension://") ||
        tab.url.startsWith("chrome://") ||
        tab.url.startsWith("about:")
    ){
        return;
    }

    let getURL;                                                      // Created URL object....
    try{
        if (!tab.url) {
            return;
        }

        getURL = new URL(tab.url).hostname;                          // Getting URL and Hostname....
        if (getURL.startsWith("www.")){                              // Converting Hostname into xyz.com....
            getURL = getURL.slice(4);
        }
    } catch (error){
        console.error("Error while checking website:", error);
        return;
    }

    chrome.storage.local.get("focusMode", (result) => {
        if (result.focusMode === false){
            return;
        }
        getBlockedSites((recover) => {                                   // Reading Storage and Updating it....
            if (recover.includes(getURL)){
                chrome.storage.local.get("tempAllow", (result) => {
                    const temp = result.tempAllow;
                    if (temp && temp.website === getURL){
                        const equal = Date.now() - temp.timestamp;
                        if (equal <= timeLimit){
                            return;
                        }
                        chrome.storage.local.remove("tempAllow");
                    }
                    getDashboard((dashboard) => {
                        dashboard.blockedCount++;
                        getWeekDetails((weeklyHistory) => {
                            const today = new Date().toISOString().split("T")[0];
                            const record = weeklyHistory.find((item) => {
                                return item.date === today && item.website === getURL;
                            });

                            if(record){
                                record.count++;
                            }
                            else{
                                weeklyHistory.push({
                                    date: today,
                                    website: getURL,
                                    count: 1,
                                });
                            }

                            chrome.storage.local.set({
                                weeklyHistory: weeklyHistory,
                                dashboard: dashboard,
                            }, () => {

                                const blockedURL = chrome.runtime.getURL(`blocked/blocked-page.html?site=${getURL}`);
                                chrome.tabs.update(tabId,{
                                    url: blockedURL,
                                });
                            });
                        });
                    });
                });
            }
        });
    });

}

// Listener....
chrome.tabs.onUpdated.addListener( (tabId, changeInfo, tab) => {
    checkWebsite(tabId, changeInfo, tab);
}); 

// Blocked-Page Message....
chrome.runtime.onMessage.addListener( (message) => {
    if (message.action === "continue"){
        chrome.tabs.query({
            active : true,
            currentWindow : true,
        }, (tabs) => {
            if (tabs.length > 0){
                chrome.tabs.update(tabs[0].id, {
                    url : "https://www.google.com"
                });
            }
        }
        );         
    }

    if (message.action === "tempAllow"){
        chrome.tabs.query({
            active : true,
            currentWindow : true,
        }, (tabs) => {
            if (tabs.length > 0){
                const tabId = tabs[0].id;
                chrome.storage.local.set({
                    tempAllow : {
                        website : message.website,
                        timestamp : Date.now(),
                        tabId : tabId,
                    }
                }, () => {
                    chrome.tabs.update(tabId, {
                        url : `https://${message.website}`
                    });
            
                    chrome.alarms.create("wakeUp", {
                        delayInMinutes : alarmTime
                    });
                });
            }
        });   
    }
});

// Alarm Listener....
chrome.alarms.onAlarm.addListener( (alarm) => {
    // Temporary Allow....
    if (alarm.name === "wakeUp"){
        chrome.storage.local.get("tempAllow", (result) => {
            const temp = result.tempAllow;

            if (temp){
                chrome.tabs.update(temp.tabId, {
                    url : chrome.runtime.getURL(`blocked/blocked-page.html?site=${temp.website}`),
                });

                chrome.storage.local.remove("tempAllow");
            }
        });
    }
    console.log("Alarm Fired:", alarm.name);
    // Streak Alarm....
    if ( alarm.name === "dailyStreak"){
        console.log("Updating Streak");
        getDashboard((dashboard) => {
            updateStreak(dashboard);
        });
    }
});

// Chrome Starts....
chrome.runtime.onStartup.addListener(() => {
    restartFM();
});

// On Install, Update, Reload....
chrome.runtime.onInstalled.addListener(() => {
    restartFM();
});

