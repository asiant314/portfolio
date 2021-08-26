// Data store of question and answer
var interviewData;
var questionIndex = 0;
var numQuestions;


d3.json("questions.json", function(err, g) {	
	if (err) throw err;
	numQuestions = g.length;
	interviewData = g;
	shuffleArray(interviewData);

	$('#cardText').text(interviewData[questionIndex].question);
	$('#questionNumber').text("Question: " + (questionIndex+1) + "/" + numQuestions);

	// Click of previous
	$("#prevCard").on("click", function() {
		if (questionIndex > 0) {
			questionIndex = questionIndex-1;
			$('#cardText').text(interviewData[questionIndex].question);	
			$('#questionNumber').text("Question: " + (questionIndex+1) + "/" + numQuestions);	
			$('#flipCard').attr('class', 'question');	
		};
	});


	// Click of next
	$("#nextCard").on("click", function() {
		if (questionIndex < numQuestions-1) {
			questionIndex = questionIndex+1;
			$('#cardText').text(interviewData[questionIndex].question);	
			$('#questionNumber').text("Question: " + (questionIndex+1) + "/" + numQuestions);	
			$('#flipCard').attr('class', 'question');		
		};
	});


	// Click of flip
	$("#flipCard").on("click", function() {
		if ($(this).attr('class') == "question") {
			$(this).attr('class', 'answer');
			$('#cardText').text(interviewData[questionIndex].answer);	
			console.log("it's a question");
		} else {			
			$(this).attr('class', 'question');
			$('#cardText').text(interviewData[questionIndex].question);	

			console.log("It's an answer");
		};		
	});

	// Click of reset
	$("#reset").on("click", function() {
		shuffleArray(interviewData);
		questionIndex=0;

		$('#cardText').text(interviewData[questionIndex].question);
		$('#questionNumber').text("Question: " + (questionIndex+1) + "/" + numQuestions);
	});



});


/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}