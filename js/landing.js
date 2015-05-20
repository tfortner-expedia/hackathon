var app = window.app || {};

app.autocomplete = (function() {
    var cache,
        doneHandlers = [];
    return function(url, queryParamName, resultsUpdater) {
        return {
            "search": function(queryParamValue) {
                $.ajax(url + "?" + queryParamName + "=" + queryParamValue)
                    .done(function(data, status) {
                        cache = resultsUpdater(JSON.parse(data));
                        doneHandlers.forEach(function(handler) {
                            handler.call({}, cache);
                        });
                    }
                );
            },
            "registerDoneHandler": function(handler) {
                doneHandlers.push(handler);
            },
            "getCache": function() {
                return cache;
            }
        };
    };
})();

app.destinationUrl = "http://www.travelnow.com/templates/367108/destination";

$(function() {
    var $enterDestination = $("#enter-destination"),
        $enterDestinationContainer = $("#enter-destination-options"),
        $enterDestinationResults = $("#enter-destination-options > ul");

    var resultsUpdater = function(responseData) {
        var liHtml = "";
        responseData.items.map(function(item) {
            liHtml += '<li>' + item.name + '</li>'
        });
        $enterDestinationResults.html(liHtml);
        $enterDestinationContainer.show();

        var resultMap = {};
        responseData.items.forEach(function(item) {
            resultMap[item.name] = {
                "id": item.id,
                "category": item.category
            };
        });
        return resultMap;
    };

    var autocompleter = app.autocomplete(app.destinationUrl, "propertyName", resultsUpdater);

    $enterDestination.keyup($.debounce(150, function(e) {
        if (e.keyCode === 27) {
            $enterDestinationContainer.hide();
            e.preventDefault();
            return false;
        }
        autocompleter.search(e.target.value);
    }));

    $enterDestinationResults.on('click', 'li', function(e) {
        $enterDestination.val(e.target.innerText);
    });


    $(".search-form button").click(function(e) {
        var destination = $enterDestination.val();
        console.log('destination', destination);
    });
});