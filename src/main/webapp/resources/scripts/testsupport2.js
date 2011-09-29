 setTimeout(function() {
        Dom.outerHTML(Dom.byId("myrow"),
                "<tr id='myrow2'><td>replaced body</td></tr>" 
                );
    }, 1000);