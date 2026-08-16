const back = document.querySelector("#back");
const blockedCount = document.querySelector("#blockedCount");
const focusStreak = document.querySelector("#focusStreak");
const totalFocus = document.querySelector("#totalFocus");

const thisWeek = document.querySelector("#this-week");
const lastWeek = document.querySelector("#last-week");
const difference = document.querySelector("#difference");

// Back Button....
back.addEventListener("click", () => {
    window.location.href="../popup/popup.html";
});

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

// Conveting Milliseconds to exact Time....
function formatTime(milliSecond){
    const tSeconds = Math.floor(milliSecond / 1000);

    const hours = Math.floor(tSeconds / 3600);
    const minutes = Math.floor((tSeconds % 3600) / 60);
    const seconds = Math.floor(tSeconds / 60);

    return `${hours}hr ${minutes}min ${seconds}sec`;
}

// Dashboard Content....
getDashboard((dashboard) => {
    blockedCount.innerText = `Blocked Attempts - ${dashboard.blockedCount}`
    focusStreak.innerText = `Streak - ${dashboard.streak}`
    totalFocus.innerText = `Total Focus Time - ${formatTime(dashboard.totalFocusTime)}`
});

// Getting Week Details....
function getWeekDetails(callback){
    chrome.storage.local.get("weeklyHistory", (result) => {
        let weeklyHistory = result.weeklyHistory;

        if(!weeklyHistory){
            weeklyHistory = [];
        }
        callback(weeklyHistory);
    });
}

// Week Report....
function weeklyReport(weeklyHistory){
    const today = new Date();
    let thisWeek = 0;
    let lastWeek = 0;

    weeklyHistory.forEach((item) => {
        const itemDate = new Date(item.date);
        const difference = Math.floor(
            (today - itemDate)/(24*60*60*1000)
        );

        if(difference >= 0 && difference < 7){
            thisWeek += item.count;
        }
        else if(difference >=7 && difference <14){
            lastWeek += item.count;
        }
    });

    return {
        thisWeek,
        lastWeek,
    };

}

// Reading Week Report....
getWeekDetails((weeklyHistory)=>{
    const report = weeklyReport(weeklyHistory);

    thisWeek.innerText = report.thisWeek;
    lastWeek.innerText = report.lastWeek;
    difference.innerText = report.thisWeek - report.lastWeek;

});

