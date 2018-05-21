/* data route */
var url = "/samples/<sample>";

function buildPlot() {
    var sample = document.getElementById("selDataset").value;
    var PIE = document.getElementById("plot");
    console.log(sample);
    var url = "/samples/"+sample;
    console.log(url);

    var otuURL = "/otu";
    Plotly.d3.json(otuURL, function(error, otuData) {
        if(error) console.warn(error);
       
        var otuData = otuData;
        
        // console.log(otuData);


    Plotly.d3.json(url, function(error, response) {
        if(error) console.warn(error);
       
        var response = response;
        
        // console.log(response);
        

        var trace1 = {
            labels: response.otu_id.map(data => `${data}`),
            values: response[sample].map(data => `${data}`),
            hovertext: [],
            hoverinfo: "hovertext",
            type: 'pie'
          };
          
          var data = [trace1];
          
          Plotly.newPlot(PIE, data);
    });
})
    var BUBBLE = document.getElementById("bubble");
    var otuURL = "/otu";
    Plotly.d3.json(otuURL, function(error, otuData) {
        if(error) console.warn(error);
       
        var otuData = [otuData];
    var sample = document.getElementById("selDataset").value;
    var sampleURL = "/samples/"+sample;
    Plotly.d3.json(sampleURL, function(error, sampleData) {
        if(error) console.warn(error);

        var sampleData = sampleData;
        console.log(sampleData);
       
        var trace2 = {
            type: "scatter",
            mode: "markers",
            x: sampleData.otu_id.map(data => `${data}`),
            y: sampleData[sample].map(data => `${data}`),
            marker: {
            size: sampleData[sample].map(data => `${data}`),
            color: sampleData.otu_id.map(data => `${data}`),
            sizemode: 'area'
                    }
        }

        var data = [trace2];

        Plotly.newPlot(BUBBLE, data);
    });
});

};

buildPlot();

function updatePlotly(newLabel, newValue) {
    var PIE = document.getElementById("plot");
  
    Plotly.restyle(PIE, "labels", [newLabel]);
    Plotly.restyle(PIE, "values", [newValue]);
}

updatePlotly(newLabel, newValue);

function updateBubble(newX, newY, newSize, newColor) {
    var BUBBLE = document.getElementById("bubble");

    Plotly.restyle(BUBBLE, "x", [newX]);
    Plotly.restyle(BUBBLE, "y", [newY]);
    Plotly.restyle(BUBBLE, "size", [newSize]);
    Plotly.restyle(BUBBLE, "color", [newColor]);
}