//var xWidth = Math.max(window.innerWidth - 150, 700);
var xWidth = Math.max(window.innerWidth * .60, 700);

var barWidth = 0; // Calculated from the width and the numBars
var numBars = 0; // Calculated from the number of words in the transcript divided by perWords
var perWords = 30; // Frequency per number of words
var barWidth = 10;
var numBars = Math.floor(xWidth/10);

var margin = {top: 20, right: 0, bottom: 20, left: 70},
	width = numBars*barWidth + margin.left + margin.right,
	height = Math.max(window.innerHeight - margin.top - margin.bottom - 500, 300);

var y = d3.scale.linear()
		.range([height, 0]);

var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(d3.format("d"));




var tooltip = d3.select("body")
		.append("div")
		.attr("id","tooltip");

// Loads up key of talk titles
var talkTitles = 23;
var talkIndex = 0;
d3.json("talkTitles.json", function(error, input) {
	talkTitles = input;
	console.log("talk titles is: " + talkTitles);
	// Initializes graph

	initializeGraph(talkIndex, talkTitles);
});

//loads transcript data 
var book;





function initializeGraph(index, talkTitles) {
	dataFile = "Talks/talk" + index + ".json";
	console.log("title load: " + talkTitles.talkTitles[0]);
	$("#autocompleteTitle").val(talkTitles.talkTitles[index]);
	$("#autocomplete").val("");
	d3.json(dataFile, function(error, input) {
	
		// Clears out svg elements
		$("#graph").empty();
		
		var svg = d3.select("#graph").append("svg")
			.attr("id", "svg")
			.attr("width", width + 5 )
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.attr("id", "transformBox");
		
		book = input;
		book.ltext = book.text.toLowerCase();
		bookTokens = book.ltext.split(" "); // Split words by spaces to form tokens
		bookTokensRaw = book.text.split(" "); // Split while maintaining punctuations
	
		// Generates url of the talk video
		url = book.url
	
		// Strips punctuation from the words
		for (var i = 0; i < bookTokens.length; i ++) {
			bookTokens[i] = bookTokens[i].replace(/[^a-zA-Z ]/g, "").trim();		
		}

	
		// Calculates the number of bars required and the width of each bar
		numBars = Math.ceil(bookTokens.length/perWords);
		barWidth = Math.floor(xWidth/numBars);
	
	
		//removes placeholder loading text
		document.getElementById('loadingText').innerHTML = '';

		// Sets chart title as name of talk
		d3.select("#whalewords").html(book.title);
	
		// Sets description of talk
		d3.select("#talkDescription").html(book.description);
	
		// Sets containerVideo height
		d3.select("#containerVideo")
			.style("height", .95*(height + margin.top + margin.bottom) + "px");
		
	
		d3.select("iframe")
			.property({'src': book.url.replace("http://www.","http://embed."), 'width': '100%','height': '90%'})	
		//0s out data array
		resetData();
		
		svg.append("g")
				.attr("class", "y axis")
				.call(yAxis)
			.append("text")
				.attr("transform", "translate("+ (-80/2) +","+(height/2)+")rotate(-90)")
				.style("text-anchor", "middle")
				.attr("font-size",'110%')
				.text("Frequency (per " + perWords + " words)");


		//draws histogram bars as an initially empty graph
		svg.selectAll('.bar')
			.data(data)
		.enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d, i){return (1+i)*barWidth;})
			.attr("width", barWidth * .9) //Allows for spacing between bars
			.attr("y", height)
			.attr("height", 0)
			.on("mouseover", function(){

				var cord = d3.mouse(this);
				var position = findIndex(Math.floor(cord[0]/barWidth), Math.floor(y.invert(cord[1])));
// 				d3.select(this).style("fill", "#435A82");
				d3.select(".active").attr("class", "bar");
				d3.select(this).attr("class", "bar active");
				document.getElementById("context").innerHTML = indexText(indices[position]).replace(new RegExp('( ' + word  + '[^a-zA-Z])', 'gi'), "<b>$1</b>").replace(/\n\r?/g, '<br />');
				document.getElementById("chapterTitle").innerHTML = "<strong>Excerpt: </strong>";	
			})
			.on("mousemove", function(){			
			})
			.on("mouseout", function (){
				d3.select(this).style("fill", "");
			});


		svg.append("rect")
			.attr("class", "dark")
			.attr("x", 0)
			.attr("height", 1)
			.attr("width", barWidth * (numBars + 1))
			.attr("y", height);
		
		svg.append("text")
			.attr("x", 0)
			.attr("y", height + 20)
			.text("Start of Talk");

		svg.append("text")
			.attr("x", barWidth * (numBars) - 80)
			.attr("y", height + 20)
			.text("End of Talk");

	});
}		


//given x and y value from graph, finds index
function findIndex(x, y){
	if (y + 1){
		var sum = 0;
		for (var i = 0; i < x - 2; i++){
			sum = sum + data[i];
		}
		return (sum + y);
	}
	else return -1;
}

//returns text surrounding position in book
function indexText(index){
	var start = Math.max(index - perWords*2, 0);
	while (bookTokensRaw[start].indexOf(".") == -1 && start != 0) {
		start = start + 1;
	}
	var end = Math.min(index + perWords*2, bookTokensRaw.length - 1);
	while (bookTokensRaw[end].indexOf(".") == -1) {
		end = end - 1;
	}
	
	if (start == 0) {
		start = start - 1;
	}
	if (end == bookTokensRaw.length - 1) {
		end = end - 1;
	}
	return bookTokensRaw.slice(start + 1, end + 1).join(" ").trim();
}

//returns chapter title index is in
function getChapter(index){

	var i = 0;
	while (book.chapterStarts[i] < index){
		i = i + 1;
	}
	return book.chapterTitles[i-1];
}

var data = [];			//height of bars, representing occurences of match per bucket of x chars
var indices = [];		//array of indexOfs of each occurences of word in 
var word;				//matched word (or string) 


//redraws graph for new match
function updateGraph(match){
	updateData(match);
	var svg = d3.select("#svg");
	y.domain([0, d3.max(data)]);
	svg.select(".y.axis").call(yAxis);
	
	svg.selectAll('.bar')
			.data(data)
		.transition()
			.duration(1000)
			.attr("y", function(d){return y(d)})
			.attr("height", function(d){return height - y(d);});			
};

//updates bar height values
function updateData(match){
	resetData();
	indices = indexOfArray(match);
	for (var i = 0; i < indices.length; i++){
		var index = Math.floor(indices[i]/perWords);
		data[index] = data[index] + 1;
	}
}

//0s out bar height array
function resetData(){
	for (var i = 0; i < numBars; i++){
		data[i] = 0;
	}
}

//creates array containing positions of each occurence of word
function indexOfArray(match) {
	match = match.toLowerCase();
	var indices = [];
	
	for (var i = 0; i < bookTokens.length; i++) {
		if (bookTokens[i] === match) {
			indices.push(i);
		}
		
	}
	return indices;
}

function updateWord(){
	word = $("#autocomplete").val();
	if (word.length > 0){
		updateGraph(word);
		d3.select("#wordNum").text(indices.length);
		d3.select("#wordText").text(word);
		d3.select("#title").style("visibility", "visible");
		d3.select("#hoverInstruction").style("visibility", "visible");
	}
	else{
		d3.select("#title").style("visibility", "hidden");
		d3.select("#hoverInstruction").style("visibility", "hidden");
	}
}

function updateTitle() {
	title = $("#autocompleteTitle").val();
	talkIndex = talkTitles.talkTitles.indexOf(title);
	document.getElementById("context").innerHTML = "";
	document.getElementById("chapterTitle").innerHTML = "";
	d3.select("#title").style("visibility", "hidden");
	d3.select("#hoverInstruction").style("visibility", "hidden");

	initializeGraph(talkIndex, talkTitles);

	
}

var autoclose = false;

//update graph and close autocomplete
$('#autocomplete').keyup(function(e){
	if(e.keyCode == 13)
	{
		updateWord();
		$(this).autocomplete("close");
		setTimeout(function(){$('#autocomplete').autocomplete("close");}, 100);
	}
});

// Autocomplete for words within talk
$( "#autocomplete" ).autocomplete({
	minLength: 0,
	select: function( event, ui ) {
		setTimeout(function(){updateWord();}, 50);
	},
	source: function( request, response ) {
		str = request.term.toLowerCase();
		var count = 0;
		var n = 0;
		var matches = [];
		var matchValues = [];
		var tempWord;
		while(n < book.fKeys.length && count < 10){
			if (str === book.fKeys[n].substring(0,str.length)){
				count = count + 1;
				matches.push({	value: book.fKeys[n],
				 				number: book.fValues[n], 
				 				bold: str, 
				 				nbold: book.fKeys[n].substring(str.length, book.fKeys[n].length)});
			}
			n = n + 1;
		}		
		response(matches);
	}
}).data('ui-autocomplete')._renderItem = function(ul, item){
		return $( "<li>" )
        	.append( "<a class = 'dropDown'><strong>" + item.bold + "</strong>" + item.nbold + " " + item.number + "</a>" )
        	.appendTo( ul );
	};

// Autocomplete for titles within talk
$( "#autocompleteTitle" ).autocomplete({
	minLength: 0,
	select: function( event, ui ) {
		setTimeout(function(){updateTitle();}, 50);
	},
	source: function( request, response ) {
		str = request.term.toLowerCase();
		var count = 0;
		var n = 0;
		var matchesTitles = [];
		var matchValuesTitles = [];
		while(n < talkTitles.talkTitles.length && count < 10){
			var indexMatch = talkTitles.talkTitles[n].toLowerCase().indexOf(str);
			if (indexMatch !== -1){
				count = count + 1;
				matchesTitles.push({	value: talkTitles.talkTitles[n],
								nboldStart: talkTitles.talkTitles[n].substring(0, indexMatch),				
				 				bold: str, 
				 				nboldEnd: talkTitles.talkTitles[n].substring(indexMatch + str.length)});
			}
			n = n + 1;
		}
		
		response(matchesTitles);
	}
}).data('ui-autocomplete')._renderItem = function(ul, item){
		return $( "<li>" )
        	.append( "<a class = 'dropDown'>" + item.nboldStart + "<strong>" + item.bold + "</strong>" + item.nboldEnd + " "  + "</a>" )
        	.appendTo( ul );
	};

//firefox doesn't capture mousemove propertly
var ffm;
function onMouseMove(e){
	ffm = [e.clientX, e.clientY];
}
document.addEventListener('mousemove', onMouseMove, false);

