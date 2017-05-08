var pg = 0;
var currentQuestion = "";
var QsTillVideo = 5;
var DataConnect = "https://fb.beatfreaks.com/DataConnect/SirveySez/";
$(document).ready(function () {
    $.get("content/home.html", function (data) {
        $("#content").html(data);
        fadeCoverOut();
        //$("#SurveyIntro").css("display", "none");
        getGoogleAd();
        getAddlContent();
        $("#content").addClass("welcome");
        $("#SurveyIntro p").addClass("welcomeP");
        $("#SurveyIntro img").addClass("bigger");
        //getSomeVideo();
        $("html, body").animate({ scrollTop: 0 }, "slow");
        FB.AppEvents.logEvent("Survey Home");
        
    });
    function fadeCoverOut() {
        $("#myCover").fadeOut(3000);
    }
});
function getAddlContent() {
    myURL = "content/SitesOfInterest.html";
    $.get(myURL, function (data) {
        $("#addlContent").html(data);
    });
}
function page(pg) {
    myURL = DataConnect + "Question?q=" + pg;
    $.get(myURL, function (data) {
        $("#SurveyIntro img").removeClass("bigger").addClass("smaller");
        $("#SurveyIntro p").removeClass("welcomeP");
        data = data.replace("<div id=\"myData\">", '');
        data = data.replace("</div>", '');
        var dataObj = JSON.parse(data);
        var divContents = "";
        var TotalQuestions = 0;
        var qID = "";
        var videoID = "";
        $.each(dataObj, function (key, innerjson) {
            if (innerjson.choices.choiceIDSort == "1") {
                TotalQuestions = innerjson.choices.totalQ;
                qID = innerjson.choices.questionID;
                currentQuestion = innerjson.choices.questionText;
                divContents += "<div class='QTextContainer'><div class='QText'><table><tr><td>" + innerjson.choices.questionIDSort + ") </td><td>" +
                        innerjson.choices.questionText;
                divContents += "<span id='tweetQuest'></span></td></tr></table></div>";
                divContents +="</div > ";
                divContents += "<div class='allChoices'>";
            }
            
            divContents += "<div id='choice" + innerjson.choices.choiceID + "' class='myChoices' onclick=\"choiceSelected('" + innerjson.choices.choiceID +
                  "');\"><span>" + innerjson.choices.choice + "</span></div>";
            videoID = innerjson.choices.videoID ;

        });


        if (pg % QsTillVideo == 0) {
            videoID = "<div class=\"video\"><iframe height=\"100%\"  src=\"https://www.youtube.com/embed/" + videoID +
                            "\" frameborder= \"0\" allowfullscreen></iframe ><br>Take a break and have a laugh!</div>";
            divContents += videoID;
        }
        if (pg == TotalQuestions) {
            divContents += "<div class='btnDivDisabled' onclick='responseResultsAll2();'>View SirVeySez Results</div>";
        } else {
            
            pg++;
            divContents += "<div class='btnDivDisabled' onclick='page(" + pg + ");'>Skip...</div>";
        }
        divContents += "</div>";
        //responseResults(qID);
        responseResults2(qID);

        $("#content").html(divContents);
        getGoogleAd();
        //$("#SurveyIntro").css("display", "block");
        tweetThisQuestion('tweetQuest');
        tweetThisQuestion('someVideo');
        $("#SurveyIntro").hide();
        $(".grad").css("height", "20pt");
        $(".grad").html("Click for details");
        $("html, body").animate({ scrollTop: 0 }, "slow");
        $(".allChoices").slideDown("slow");
        FB.AppEvents.logEvent("Survey pg " + pg + " viewed");
    });
    
};

$(".grad").click(function () {
    $(".grad").html("");
    $(".grad").css("height", "5pt");
    $("#SurveyIntro").slideDown();

});

function tweetThisQuestion(myDivID) {
    //console.log(currentQuestion);
    myDivID = "#" + myDivID;
    var qLen = currentQuestion.length;
    if (qLen > 80) {
        var currentQuestion_Short = currentQuestion.substring(0, 77) + "..."; 
    }
    var divContents = "&nbsp;<a href=\"https://twitter.com/intent/tweet?screen_name=SirVeySez\" class=\"twitter-mention-button\"";
    divContents += " data-text=\"Question: " + currentQuestion_Short + " http://SirVeySez.com #BeYourOwnHero\" data-related=\"sirveysez,survey,opinion,poll\" data-show-count=\"false\">Tweet to @SirVeySez</a>";
    divContents += "<script async src=\"//platform.twitter.com/widgets.js\"      charset=\"utf-8\"></script>";
    divContents += "<img src=\"img/facebook.png\" class=\"FBPostBtn\"  onclick=\"postTofeed('" + currentQuestion + " - http://SirVeySez.com  #SirVeySez');\" alt=\"facebook\" />";
    $(myDivID).html(divContents);
};


function responseResults2(qID) {
    myURL = DataConnect + "responseStats2?q=" + qID;
    $.get(myURL, function (data) {
        data = data.replace("<div id=\"myData\">", '');
        data = data.replace("</div>", '');
        var dataObj = JSON.parse(data);
        // console.log(dataObj);
        var totalLines = dataObj.choices.length;
        //console.log(totalLines );

        var divContents = "<div>Question Results</div><table>";
        for (var i = 0; i < totalLines; i++) {

            divContents += "<tr><td>";

            divContents += "<div style=\"position:relative;width:100%;padding-left:3pt;\" >";
            divContents += "<div class=\"reportDetailBar\" style=\"width:" + dataObj.choices[i].pct + "%;\"></div>";
            divContents += dataObj.choices[i].pct + "%&nbsp;" + dataObj.choices[i].choice;

            divContents += "</div></td></tr>";
        };
        divContents += "</table>";
        divContents += "<div class=\"viewAll\" onclick=\"responseResultsAll2();\">View all</div>";
        $("#SurveyResults").html(divContents);
    });
};



function responseResultsAll2() {
    myURL = DataConnect + "responseStatsAll2";
    $.get(myURL, function (data) {
        data = data.replace("<div id=\"myData\">", '');
        data = data.replace("</div>", '');
        var dataObj = JSON.parse(data);
        // console.log(dataObj);
        //var totalLines = dataObj.choices.length;
        //console.log(totalLines );

        var divContents = "<div id=\"resultsAll\"><div>Sir Vey Sez...<a onclick=\"postTofeed('');\" class=\"btn\">Share</a></div><table><tr><th colspan='2'>Question</th><th>Response</th></tr>";
        var c = [];
        var questionIDSort = 0;
        //var question = "";
        $.each(dataObj, function (i, item) {
            var even = (item.questionIDSort % 2);
            if (even == 0) {
                trClass = "firstRowE";
            } else {
                trClass = "firstRow";
            }

            if (questionIDSort != item.questionIDSort) {
                c.push("<tr class=\"" + trClass + "\">");
                c.push("<td>" + item.questionIDSort + ")&nbsp;</td>");
                c.push("<td>" + item.question + "</td>");
            } else {
                c.push("<tr class=\"" + trClass + "\">");
                c.push("<td>&nbsp;</td>");
                c.push("<td>&nbsp;</td>");
            }
            questionIDSort = item.questionIDSort;

            c.push("<td style=\"width:33%;\"><div style=\"position:relative;width:100%;padding-left:3pt;\" >");

            c.push("<div class=\"reportDetailBar\" style=\"width:" + item.pct + "%;\"></div>");

            c.push( item.pct + "%&nbsp;" + item.choice );
            
            c.push("</div></td>");
            c.push("</tr>");

        });

        $("#content").html(divContents + c.join("") + "</table></div>");
        $("#SurveyResults").hide();
        $(".mySocial").addClass("mySocialResults").removeClass("mySocial");
    });
};





function getGoogleAd() {

    $.get("content/googlead.html", function (data) {
        $("#googleSpace").html(data);
    });

    $.get("content/googlead2.html", function (data) {
        $("#googleAd2").html(data);
    });
}



function choiceSelected(choiceID) {
    FB.AppEvents.logEvent("Choice selected pg " + pg );
    $(".btnDivDisabled").addClass("btnDiv").removeClass("btnDivDisabled");
    $(".btnDiv").html("Next question...");
    myURL = DataConnect + "Response?c=" + choiceID + "&i=" + IPADDRESS;
    $.get(myURL);
    $(".myChoiceSelected").addClass("myChoices").removeClass("myChoiceSelected");
    $("#choice" + choiceID).addClass("myChoiceSelected").removeClass("myChoices");
    videoBreak();
}

function videoBreak() {
    $(".video").slideDown("slow");
}


function postTofeed(myContent) {
    FB.AppEvents.logEvent("PostToFeed pg " + pg);
    if (window.loggedin == 0) {
        alert("Let's log in to Facebook, first.");
        fbLogin();
    }

    else {
        if (myContent == "") {
            myContent = "Strength is our abililty to meet adversity head on. SirVeySez.com is a tool for gathering " + 
            "consensus on important topics and current events. " +
            "I asked you, my friends, to submit questions you thought were important, " +
            "and included them here.";
        }
        FB.ui(
            {
                method: 'feed',
                name: 'Sir Vey Sez! by Merit Media US',
                link: 'https://fb.beatfreaks.com/SirVeySez',
                picture: 'https://fb.beatfreaks.com/SirVeySez/img/fbsurvey-logo-200.jpg',
                caption: 'Political and Current Events Survey',
                description: myContent
            },
            function (response) {
                if (response && response.post_id) {
                    //alert('Post was published.');
                } else {
                    // alert('Post was not published.');
                }
            }
        );
    }
}
