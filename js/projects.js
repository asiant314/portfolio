$(document).ready(function() {
	var projectName;
	var indexProject;

	// Setting the hover actions for the project list, tieing that to images
	$(".no-bullet > li").mouseenter(function() {
		$(this).addClass("hover");
		var classList = $(this).attr('class');
		projectName = classList.split(" ")[0];
		$("img."+projectName).addClass("hover");
	});

	$(".iconImage > img").mouseleave(function() {
		$(this).removeClass("hover");
		$("li."+projectName).removeClass("hover");
	});

	// Setting the hover actions for the images, tieing that to the project list
	$(".iconImage > img").mouseenter(function() {
		$(this).addClass("hover");
		var classList = $(this).attr('class');
		projectName = classList.split(" ")[0];
		$("li."+projectName).addClass("hover");
		$(this).parent().find("p").addClass("hover");
		
	});

	$(".iconImage > img").mouseleave(function() {
		$(this).removeClass("hover");
		$("li."+projectName).removeClass("hover");
		$(this).parent().find("p").removeClass("hover");
	});

	// Actions to create gallery interaction for lightbox
	var projectList = ["project1", "project2", "project3", "project4", "project5", "project6", "project7", "project8", "project9", "project10", "project11"];
	var lightList = ["lightbox1", "lightbox2", "lightbox3", "lightbox4", "lightbox5", "lightbox6", "lightbox7", "lightbox8", "lightbox9", "lightbox10", "lightbox11"];

	// Click function for the lightbox first so that it loads up
	$(".iconImage > img").click(function() {
		var classList = $(this).attr('class');
		projectName = classList.split(" ")[0];
		indexProject = $.inArray(projectName, projectList);
		initiateSliders(indexProject);

	});

	// Keypress options to browse gallery
	$(document).keydown(function(e) {
		// alert("you pressed something");
		if (e.which == 37) {
			$.featherlight.current().close();
			$.featherlight($("#" + priorProject), {
				openSpeed: 600,
			});
			indexProject = (indexProject + projectList.length - 1)%projectList.length; 
			initiateSliders(indexProject);

		} else if (e.which == 39) {
			$.featherlight.current().close();
			$.featherlight($("#" + nextProject), {
				openSpeed: 600,
			});
			indexProject = (indexProject + 1)%projectList.length;
			initiateSliders(indexProject);
		} else if (e.which == 27) {
			$.featherlight.current().close();
		}
	});
	
	function initiateSliders(indexProject) {
		// Unbinds all existing event functions
		$(".fa-arrow-circle-left").unbind();
		$(".fa-arrow-circle-right").unbind();
		// $(document).unbind();

		if (indexProject != -1) {
			nextProject = lightList[(indexProject + 1)%projectList.length];
			priorProject = lightList[(indexProject + projectList.length - 1)%projectList.length];
		}
		$(".fa-arrow-circle-left").click(function() {		
			$.featherlight.current().close();
			$.featherlight($("#" + priorProject), {
				openSpeed: 600,
			});
			indexProject = (indexProject + projectList.length - 1)%projectList.length; 
			initiateSliders(indexProject);
		});	


		$(".fa-arrow-circle-right").click(function() {
			$.featherlight.current().close();
			$.featherlight($("#" + nextProject), {
				openSpeed: 600,
			});
			indexProject = (indexProject + 1)%projectList.length;
			initiateSliders(indexProject);
		});	




	}
	// $(".fa-arrow-circle-left").click(function () {
	// 	alert("you clicked stuff");
	// 	console.log($(this).parent().attr("id"));

	// });

	

	// $(".fa-arrow-circle-left").mouseenter{
	// 	$(this).addClass("hover");
	// }

	// $(".fa-arrow-circle-left").mouseenter{
	// 	$(this).removeClass("hover");
	// }


});