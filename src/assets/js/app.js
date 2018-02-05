$(document).ready(function() {
    //getLogList();

    $( "#initialLoad" ).click(function() {
        getLogList();
    });




});

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
                alert("Something went wrong, plz investigate");
            }
    
        })
    }
}

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
            alert("Something went wrong, plz investigate");
        }

    })

}

function newLogHandler() {
    var newLog = $('#newLog').val();  //returns a jQuery Object
    var data = {
        "name": newLog 
    }

    $.ajax({
        crossDomain: true,
        url: getBaseUrl() + "/log/",
        type: "POST",
        headers: {
            //"Access-Control-Allow-Headers": "x-requested-with",
            "Access-Control-Allow-Origin":"*",
            "content-type": "application/json", 
            "CL-Username": getUser(),
            "CL-Password": getPassword()
        },
        data: JSON.stringify(data),
        success: function(response) {
            getLogList();
        },
        error: function() {
            alert("Something went wrong, plz investigate");
        }

    })
}

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
            alert("Something went wrong, plz investigate");
        }

    })
}

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
            alert("Something went wrong, plz investigate");
        }

    })
}

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
                alert("Something went wrong, plz investigate");
            }
    
        })
    }
}

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

function getLogList() {
    //var user = $('#user').val();
    //var password = $('#password').val();
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

