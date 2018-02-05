$(document).ready(function() {
    // This is the click handler that listens for a clickevent
    // on the button next to the username and password input.
    $( "#initialLoad" ).click(function() {
        getLogList();
    });
});


// To delete a log the id is required, the name is only used for Displaypurposes
// when asking the user to confirm the deletion.
function deleteLogHandler(id, name) {
    var conf = confirm("Are you sure you want to delete '" + name + "'");
    if (conf === true) {
        $.ajax({
            crossDomain: true,
            url: getBaseUrl() + "/log/" + id,
            type: "Delete",
            headers: {
                "CL-Username": getUser(),
                "CL-Password": getPassword()
            },
            success: function(response) {
                getLogList();
            },
            error: function() {
                alert("There was an error!");
            }
    
        })
    }
}

// To change the name of a log we need the log id and its current
// revision so the backend can keep track of all changes.
function changeNameHandler(id, rev) {
    var newName = $('#' + id).text();  //returns a jQuery Object
    var data = {
        "rev": rev,
        "name": newName 
    }
    $.ajax({
        crossDomain: true,
        url: getBaseUrl() + "/log/" + id,
        type: "PUT",
        headers: {
            //"Access-Control-Allow-Headers": "x-requested-with",
            "content-type": "application/json", 
            "CL-Username": getUser(),
            "CL-Password": getPassword()
        },
        data: JSON.stringify(data),
        success: function(response) {
            getLogList();
        },
        error: function() {
            alert("There was an error!");
        }
    })
}

// To create a new log we don't need any data except for the auth headers.
// The system sends a response with the data for the newly created log.
// This data is ignored right now, as we just reload all campaign logs.
function newLogHandler() {
    var newLog = $('#newLog').val();
    var data = {
        "name": newLog 
    }
    $.ajax({
        crossDomain: true,
        url: getBaseUrl() + "/log/",
        type: "POST",
        headers: {
            "content-type": "application/json", 
            "CL-Username": getUser(),
            "CL-Password": getPassword()
        },
        data: JSON.stringify(data),
        success: function(response) {
            getLogList();
        },
        error: function() {
            alert("There was an error!");
        }

    })
}

// To create a new entry in a log we of course need the logs id 
// and the rest is created on the fly e.g. Timestamp und uniqueID
function newLogEntryHandler(id) {
    var newLogEntry = $('#newLogEntry').val();
    var data = {
        "rawText": newLogEntry,
        "timestamp": createTimeStamp(),
        "uniqueId": createUUID()
    }
    console.log(data);
    $.ajax({
        crossDomain: true,
        url: getBaseUrl() + "/log/" + id + "/entry",
        type: "POST",
        headers: {
            //"Access-Control-Allow-Headers": "x-requested-with",
            "content-type": "application/json", 
            "CL-Username": getUser(),
            "CL-Password": getPassword()
        },
        data: JSON.stringify(data),
        success: function(response) {
            //getLogEntryList(id);
            console.log(response)
        },
        error: function(response) {
            alert("There was an error!");
        }

    })
}

// To update a log entry requires some data from the edited entry
// which we supply here through the parameters and then send to the backend.
function updateLogEntryHandler(logId, entryId, rev, timestamp, uniqueId) {
    var updatedEntry = $('#' + entryId).text();
    var data = {
        "rev": rev,
        "rawText": updatedEntry,
        "timestamp": createTimeStamp(),
        "uniqueId": uniqueId
    }

    $.ajax({
        crossDomain: true,
        url: getBaseUrl() + "/log/" + logId + "/entry/" + entryId,
        type: "PUT",
        headers: {
            //"Access-Control-Allow-Headers": "x-requested-with",
            "content-type": "application/json", 
            "CL-Username": getUser(),
            "CL-Password": getPassword()
        },
        data: JSON.stringify(data),
        success: function(response) {
            getLogEntryList(logId)
        },
        error: function() {
            alert("There was an error!");
        }

    })
}

// To delete an entry, we need the parent log id as well as the id of the entry itself
// The server returns an empty object which gets ignored in this example
function deleteLogEntryHandler(logId, entryId) {
    var conf = confirm("Are you sure you want to delete this entry? This action is ireversible!");
    if (conf === true) {
        $.ajax({
            crossDomain: true,
            url: getBaseUrl() + "/log/" + logId + "/entry/" + entryId,
            type: "DELETE",
            headers: {
                "CL-Username": getUser(),
                "CL-Password": getPassword()
            },
            success: function(response) {
                getLogEntryList(logId);
            },
            error: function() {
                alert("There was an error!");
            }
    
        })
    }
}

// This is the most basic request in the API 
// You just supply username and password and it returns a list 
// of all log entries.
function getLogList() {
    var user = getUser();
    var password = getPassword();
    var url = "https://campaign-logger.com/gateway/rest/public/log";
    $.ajax({
        url: url, 
        type: "GET",
        headers: {
            "CL-Username": user,
            "CL-Password": password
        },
        success: function(response){
            $('logs_table').html('');
            var trHTML = '<thead><tr><th scope="col">Actions</th>'
            + '<th scope="col">Name</th><th scope="col">ID</th>'
            + '<th scope="col">Revision</th></tr></thead>';
            $.each(response, function (i, item) {
                trHTML += '<tr><td>'
                + '<button class="btn btn-success" onclick="changeNameHandler(\'' + item.id + '\',\''+ item.rev +'\')">Save</button>'
                + ' <button class="btn btn-danger" onclick="deleteLogHandler(\'' + item.id + '\',\''+ item.name +'\')">Delete</button>'
                + ' <button class="btn btn-secondary" onclick="showDetailHandler(\'' + item.id + '\',\''+ item.name +'\')">Details</button>'
                + '</td><td><div id="' + item.id +  '" contenteditable="true">' 
                + item.name + '</div></td><td>' 
                + item.id + '</td><td>' 
                + item.rev + '</td></tr>';
            });
            trHTML += '<tr><td><button class="btn btn-info" onClick="newLogHandler()">Create New</button></td>'
            + '<td><input type="text" id="newLog" placeholder="New Campaign Log"/></td></tr>'
            $('#logs_table').html(trHTML);
            $('#rawData').text(JSON.stringify(response));
        }
    });
}

// this is a basic GET request which just request all entrys associated with a campaign log
// and then displays them in the second tab of our page.
function getLogEntryList(id) {
    var user = getUser();
    var password = getPassword();
    var url = "https://campaign-logger.com/gateway/rest/public/log/" + id + "/entry";
    $.ajax({
        url: url, 
        type: "GET",
        headers: {
            "CL-Username": user,
            "CL-Password": password
        },
        success: function(response){
            var cardHtml = " ";
            $.each(response, function (i, item) {
                cardHtml += `
                <div class="card">
                    <div class="card-body">
                    <h6 class="card-title">Created on: ${item.timestamp}</h5>
                    <p class="card-text" contenteditable="true" id="${item.id}">${item.htmlText}</p>
                    </div>
                    <div class="card-footer text-muted">
                    <button class="btn btn-outline-success" onclick="updateLogEntryHandler('${id}','${item.id}','${item.rev}','${item.timestamp}', '${item.uniqueId}')">Save</button>
                    <button class="btn btn-outline-danger" onclick="deleteLogEntryHandler('${id}','${item.id}')">Delete</button>
                    </div>
                </div>
                <br>`
            });
            $('#detailCard').html(cardHtml);
        }
    });
}


// ----------------------------------
// The following are basic helper
// functions and used for display-
// purposes and getting data.
// ----------------------------------

function showDetailHandler(id, name) {
    $('#clTabs a[href="#entry"]').tab('show'); // Select tab by name/link
    $('#detailTitle').html(name);
    var button = `<button class="btn btn-outline-success" type="button" onclick="newLogEntryHandler('${id}')">Save</button>`;
    $('#newEntryButton').html(button);
    getLogEntryList(id);
}

function getUser() {
    return $('#user').val();
}
function getPassword() {
    return $('#password').val();
}
function getBaseUrl() {
    return "https://campaign-logger.com/gateway/rest/public"
}


// Really simple number generator based on random numbers, for demo purposes only
// Do not use for your own app!
function createUUID(){
    var dt = new Date().getTime();
    var uuid = 'demo:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

function createTimeStamp() {
    var d = new Date();
    var time = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2) +"T" + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2);
    return time;
}

