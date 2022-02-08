const tweetTemplate = document.querySelector("[data-user-template]");


const wojTweet = {
    name: "Adrian Wojnarowski",
    username: "@wojespn",
    picture: "https://pbs.twimg.com/profile_images/1264902234703265794/lC3YnIYF_400x400.jpg",
    tweet: "Greg Brown III is being traded to the Toronto Raptors for a 2022 second-round pick, a 2023 lottery-protected first-round pick, and Goran Dragic",
    metaInfo: {
        time: "4:32 PM · Feb 6, 2022",
        source: "Twitter Web App",
    },
    engangement: {
        rt: 2980,
        qrt: 2980,
        likes: "19.9K"
    }
}

function renderTrade(tweet) {
    const tweetDiv = tweetTemplate.content.cloneNode(true).children[0];

    const profilePicture = tweetDiv.querySelector("[data-profile-picture");
    profilePicture.src = tweet.picture;

    const name = tweetDiv.querySelector("[data-name");
    name.textContent = tweet.name;

    const username = tweetDiv.querySelector("[data-username]");
    username.textContent = tweet.username;

    const tweetContent = tweetDiv.querySelector("[data-tweet-content]");
    tweetContent.textContent = tweet.tweet;

    const time = tweetDiv.querySelector("[data-time]");
    time.textContent = tweet.metaInfo.time;

    const source = tweetDiv.querySelector("[data-source]");
    source.textContent = tweet.metaInfo.source;

    const rts = tweetDiv.querySelector("[data-rt]");
    rts.innerHTML = `<span>${tweet.engangement.rt.toLocaleString()}</span> Retweets`;

    const qrts = tweetDiv.querySelector("[data-qrt");
    qrts.innerHTML = `<span>${tweet.engangement.qrt.toLocaleString()}</span> Quote Retweets`;

    const likes = tweetDiv.querySelector("[data-likes]");
    likes.innerHTML = `<span>${tweet.engangement.likes}</span> Likes`;

    console.log(tweetDiv);
    document.body.innerHTML = "";
    document.body.appendChild(tweetDiv);
}


const tweetComponents = {
    player1: "",
    player2: "",
    team1: "",
    team2: "",
}

function generateTrade() {
    fetch("http://data.nba.net/10s/prod/v1/2021/players.json")
        .then(res => res.json())
        .then(data => {
            console.log(data);

            let maxPlayers = data.league.standard.length;
            let randomNum = Math.floor(Math.random() * maxPlayers);
            let randomNum2 = Math.floor(Math.random() * maxPlayers);
            while (randomNum2 == randomNum) {
                randomNum2 = Math.floor(Math.random() * maxPlayers);
            }

            let randomPlayer = data.league.standard[randomNum];
            let randomPlayer2 = data.league.standard[randomNum2];

            let name = `${randomPlayer.firstName} ${randomPlayer.lastName}`;
            let name2 = `${randomPlayer2.firstName} ${randomPlayer2.lastName}`;

            let team1 = randomPlayer.teamId.split(" ")[0];
            let team2 = randomPlayer2.teamId.split(" ")[0];

            tweetComponents.player1 = name;
            tweetComponents.player2 = name2;
            return {
                name: name,
                name2: name2,
                team1: team1,
                team2: team2
            }

        }).then(response => {

            fetch("https://data.nba.net/10s/prod/v1/2021/teams.json")
                .then(res => res.json())
                .then(data => {

                    let teams = data.league.standard

                    let index = teams.findIndex(a => a.teamId == response.team1);
                    let team = data.league.standard[index];
                    tweetComponents.team1 = team.fullName;

                    index = teams.findIndex(a => a.teamId == response.team2);
                    let team2 = data.league.standard[index];
                    tweetComponents.team2 = team2.fullName;
                }).then(() => {
                    let tweetString = `The ${tweetComponents.team1} are trading ${tweetComponents.player1} to The ${tweetComponents.team2} for ${tweetComponents.player2}, a 2022 First Round Pick, and a 2023 Second Round Pick, sources tell ESPN.`;
                    wojTweet.tweet = tweetString;
                    renderTrade(wojTweet);
                })
        })
}
