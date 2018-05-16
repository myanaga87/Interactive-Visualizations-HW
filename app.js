function buildPie() {
    /* data route */
    var url = "/samples/<sample>";

    var select = document.getElementById("plot");
    
    Plotly.d3.json(url, function(error, response) {

        if(error) return console.log(error);
        console.log(response);
    
        var trace1 = {
            labels: ["beer", "wine", "martini", "margarita",
                "ice tea", "rum & coke", "mai tai", "gin & tonic"],
            values: [22.7, 17.1, 9.9, 8.7, 7.2, 6.1, 6.0, 4.6],
            type: 'pie'
        };
        
        var data = [trace1];
        
        var layout = {
            title: "'Bar' Chart",
        };
        
        Plotly.newPlot("plot", data, layout);
    });
}
buildPie();