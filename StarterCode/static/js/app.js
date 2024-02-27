// Define the URL for fetching the JSON data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Initialize the dropdown menu with data
function initializeDropdown() {
    // Select the dropdown menu using D3
    let dropdownMenu = d3.select("#selDataset");

    // Fetch JSON data and log it
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // Extract the array of sample names
        let sampleNames = data.names;

        // Iterate through the array and append options to the dropdown
        sampleNames.forEach((name) => {
            dropdownMenu.append("option").text(name).property("value", name);
        });

        // Assign the first name from the array to a variable
        let initialName = sampleNames[0];

        // Call functions to generate charts based on the initial sample name
        generateDemographics(initialName);
        generateBarChart(initialName);
        generateBubbleChart(initialName);
        generateGaugeChart(initialName);
    });
}

initializeDropdown();

// Generate the bar chart
function generateBarChart(chosenSample) {
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        let samples = data.samples;

        // Filter data for the selected sample ID
        let filteredData = samples.filter((sample) => sample.id === chosenSample);

        // Select the first object from the filtered data
        let selectedSample = filteredData[0];
        
        // Create trace for the bar chart
        let trace = [{
            x: selectedSample.sample_values.slice(0,10).reverse(),
            y: selectedSample.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: selectedSample.otu_labels.slice(0,10).reverse(),
            type: "bar",
            marker: {
                color: "rgb(60,150,255)"
            },
            orientation: "h"
        }];
        
        // Plot the bar chart
        Plotly.newPlot("bar", trace);
    });
}

// Generate demographics information
function generateDemographics(chosenSample) {
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // Extract metadata array
        let metadata = data.metadata;
        
        // Filter metadata for the selected sample ID
        let filteredData = metadata.filter((meta) => meta.id == chosenSample);
      
        // Select the first object from the filtered data
        let selectedMetadata = filteredData[0];
        
        // Clear any previous data and append new demographic information
        d3.select("#sample-metadata").html("");
  
        let entries = Object.entries(selectedMetadata);
        
        // Iterate through the entries array and append each key/value pair as an h5 element
        entries.forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });

        // Log the entries Array
        console.log(entries);
    });
}

// Generate the bubble chart
function generateBubbleChart(chosenSample) {
    d3.json(url).then((data) => {

        let samples = data.samples; 
        let filteredData = samples.filter((sample) => sample.id === chosenSample);
        let selectedSample = filteredData[0];
    
        let trace = [{
            x: selectedSample.otu_ids,
            y: selectedSample.sample_values,
            text: selectedSample.otu_labels,
            mode: "markers",
            marker: {
                size: selectedSample.sample_values,
                color: selectedSample.otu_ids,
                colorscale: "Earth"
            }
        }];
    
        let layout = {
            xaxis: {title: "OTU ID"}
        };
    
        Plotly.newPlot("bubble", trace, layout);
    });
}

// Function to update plots when a new test subject is selected from the dropdown
function updatePlots(chosenSample) {
    // Update demographics and charts based on the chosen sample
    generateDemographics(chosenSample);
    generateBarChart(chosenSample);
    generateBubbleChart(chosenSample)
}