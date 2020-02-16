/////////// setting server
const express = require('express');
const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
});
const port = 2000;

const usersData = require('./data/users.json');
const usersStatistic = require('./data/users_statistic.json');

app.listen(process.env.PORT || port, function () {
    console.log(`server is up. port: ${port}`);
});


let getUserStatisticArr = (usersStatistic, userId) => {  
    let userStatisticArr = [];
    userStatisticArr = usersStatistic.filter(item => item.user_id == userId);   
    return userStatisticArr;
};

let getUserStatistic = (userStatisticArr) => {
    let userStatistic = {
        totalPageViews: 0,
        totalClicks: 0
    }
    for (let i = 0 ; i < userStatisticArr.length; i++) {    
        userStatistic.totalPageViews = userStatistic.totalPageViews + userStatisticArr[i].page_views;
        userStatistic.totalClicks = userStatistic.totalClicks + userStatisticArr[i].clicks;
    };
    return userStatistic;
};

let usersDataUpdate = (newUsersData) => {
    let updateUsersData = [];
    for (let i = 0; i < newUsersData.length; i++) {    
      let  userStatistic = getUserStatistic(getUserStatisticArr(usersStatistic, newUsersData[i].id));   
      updateUsersData.push({...newUsersData[i], total_page_views: userStatistic.totalPageViews, total_clicks: userStatistic.totalClicks})
    };
    return updateUsersData;
};

let getUsersData = (usersData, usersNumber, currentPage) => {

    let iteratorByFor = usersNumber * currentPage - usersNumber;
    let lastIteration = usersNumber * currentPage;

    if (lastIteration > usersData.length) {
        lastIteration = usersData.length;
    };

    let newUsersData = [];
    for (let i = iteratorByFor; i < lastIteration; i++) {
        newUsersData.push(usersData[i]);
    };
    return usersDataUpdate(newUsersData);
};

//////////////// routing
app.get('/users-data/:usersNumber/:currentPage', function (req, res) {
    let usersNumber = req.params.usersNumber;
    let currentPage = req.params.currentPage;
    if (usersNumber > 50 ) {
        res.status(10).send({ error: 'Maximum users in 1 page = 50!' });
    }
    res.send(getUsersData(usersData, usersNumber, currentPage));
});

