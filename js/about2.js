/**
 * Actions on page load
 */

 var globalTarget;
$(document).ready(function()
{
  //Show the SVG message if SVG is not available
  $html = $("html");
  if ($html.hasClass("no-svg")) {
    $("#svg_message").show();
  }
  
  /**
   * -------------------------------------------------------------------------------------------------------------------- 
   * Scroll event
   * -------------------------------------------------------------------------------------------------------------------- 
   */
		
  
  // Sets fonts for headers and section body
  var viewportWidth  = document.documentElement.clientWidth,
    viewportHeight = document.documentElement.clientHeight;
  
  var textBodySize = d3.scale.linear()
    .domain([400, 1200])
    .range([13, 40]);
    
  var textHeaderSize = d3.scale.linear()
    .domain([500, 1200])
    .range([30, 80]);
  
  // d3.selectAll(".sectionContent")
  //   .style("font-size", textBodySize(Math.min(viewportWidth, viewportHeight)) + "px");
  // d3.selectAll("h1")
  //   .style("font-size", textHeaderSize(Math.min(viewportWidth, viewportHeight)) + "px");

  //State variables for the different infographics
  var experienceNotViewed = true;
  var policymapNotViewed = true;
  var circleMapViewed = true;
  var scrollposition = $(window).scrollTop();
  var scrolldirection;
  var sections = new Array();

  $experienceTimeline = $("#experienceTimeline");
  $emission_graph_policies = $("#emission_graph_policies");
  $emission_graph_origin_countries = $("#emission_graph_origin_countries");
  $swipeSections = $('.swipeSection');
  $.fn.swipeEvents = function() {
    return this.each(function() {
    
        var startX,
        startY,
        $this = $(this);
        
        $this.bind('touchstart', touchstart);
        
        function touchstart(event) {
            var touches = event.originalEvent.touches;
            if (touches && touches.length) {
                startX = touches[0].pageX;
                startY = touches[0].pageY;
                $this.bind('touchmove', touchmove);
            }
        }
        
        function touchmove(event) {
            var touches = event.originalEvent.touches;
            if (touches && touches.length) {
                var deltaX = startX - touches[0].pageX;
                var deltaY = startY - touches[0].pageY;
        
                if (deltaX >= 50) {
                    $this.trigger("swipeLeft");
                }
                if (deltaX <= -50) {
                    $this.trigger("swipeRight");
                }
                if (deltaY >= 50) {
                    $this.trigger("swipeUp");
                }
                if (deltaY <= -50) {
                    $this.trigger("swipeDown");
                }
                if (Math.abs(deltaX) >= 50 || Math.abs(deltaY) >= 50) {
                    $this.unbind('touchmove', touchmove);
                }
            }
            event.preventDefault();
        }
        
    });
  }; // End of swipe events

  $(window).swipeEvents().bind('swipeUp', function()
  {
    setActiveSlide();
    
    var element = $('.swipeSection.is-active').get(0);
    var index = $swipeSections.index(element);
    
    $target = $($swipeSections.get(index + 1));
    if($target.length)
    {
        $('html, body').stop().animate({
            scrollTop: $target.offset().top
        }, 1000);
    }
  })
  .bind('swipeDown', function()
  {
    setActiveSlide();
   
    var element = $('.swipeSection.is-active').get(0);
    var index = $swipeSections.index(element);

    if (index == 2) {
      $('html, body').stop().animate({
          scrollTop: 0
      }, 1000);


    } else {
      if(index - 1 >= 0){
          $target = $($swipeSections.get(index - 1));
          if($target.length)
          {
              $('html, body').stop().animate({
                  scrollTop: $target.offset().top
              }, 1000);
          }
      }

    }
  });
  
  function setActiveSlide() {
    var scroll          = $(window).scrollTop(),
        wh              = $(window).height(),
        windowCenter    = scroll + 0.5 * wh,
        last            = null
    ;

    $swipeSections.each(function()
    {
        var el  = $(this),
            dtt = el.position().top, // distance to top
            ph  = el.outerHeight() // page height
        ;

        // if we're past the link's section, activate it
        if ( windowCenter > dtt  &&  windowCenter < (dtt + ph)) {
            var navClass    = el.attr('id'), // get page url
                currentLink = $('a.'+navClass, '#nav')
            ;
            if(!currentLink.parent().hasClass('is-active'))
            {
                last && last.parent().removeClass('is-active');
                currentLink.parent().addClass('is-active');
                last = $('.is-active a', '#nav');
            }
            if(!el.hasClass('is-active'))
            {
                el.addClass('is-active');
            }
        } else {
            var navClass = el.attr('id'), // get page url
                currentLink = $('a.'+navClass, '#nav');
            ;
            currentLink.parent().removeClass('is-active');
            el.removeClass('is-active');
        }
    });
  }

  //Event handler
  $(window).scroll( function(_event)
  {
    var scroll          = $(window).scrollTop(),
        wh              = $(window).height(),
        windowCenter    = scroll + 0.5 * wh,
        last            = null
    ;
    
    setActiveSlide();

    //Check the location of each desired element 
    $("#secondSection").each( function(i){

        //var bottom_of_object = $(this).position().top + $(this).outerHeight();
        var bottom_of_object = $(this).offset().top + $(this).outerHeight();
        var bottom_of_window = $(window).scrollTop() + $(window).height();

        //If the object is completely visible in the window, fade it in 
        if( bottom_of_window > bottom_of_object - 250 && experienceNotViewed){
      drawExperience();
          experienceNotViewed = false;
        }

    });     

    
      
  });
  
  $('.scrollTo').on('click', function(e)
  {
      e.preventDefault();
      
      $target = $($(this).attr('href'));
      // console.log($target);
      // globalTarget = $target;
      if ($target.attr("id")=="firstSection") {
        $('html, body').stop().animate({
            scrollTop: 0
        }, 1000);        
      } else {
        $('html, body').stop().animate({
          scrollTop: $target.offset().top
        }, 1000);        
      }

  });

  //Resize infographic on resize window
  var infographics = $(".infographic");
  
  //Add event handler
  $(window).on("resize", function()
  {
  var viewportWidth  = document.documentElement.clientWidth,
    viewportHeight = document.documentElement.clientHeight;
    
    d3.selectAll(".sectionContent")
    .style("font-size", textBodySize(Math.min(viewportWidth, viewportHeight)) + "px");
  d3.selectAll("h1")
    .style("font-size", textHeaderSize(Math.min(viewportWidth, viewportHeight)) + "px");

    //Loop over all infographics
    resizeExperience();
    // Clears the skills infographic and redraws it
    $(".vis").remove();
    drawSkills();
    
        
  });

});
  

  

/**
 * Function to draw the experience infographic with the footstep animations
 */
 
function drawExperience() {
  var viewportWidth  = document.documentElement.clientWidth,
    viewportHeight = document.documentElement.clientHeight;

  var width = .94 * viewportWidth,
    height = .75 * viewportHeight;
  
  var x = d3.scale.linear()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([0 - 36, height - 36]); //Lazily shift up the entire infographic

  var labelSize = d3.scale.linear()
    .domain([500, 1800])
    .range([14, 30]);
  
  var imageSize = d3.scale.linear()
    .domain([500, 1800])
    .range([60, 140]);

  $("#experienceInfographic").html("");
  var svg = d3.select("#experienceInfographic")
    .attr("width", width)
    .attr("height", height)
    .append("g");
    

  d3.csv("footprintData.csv", type, function(error, data) {
    x.domain([0, 100]);
    y.domain([0, 120]);

    svg.selectAll(".foot") //Creates placeholder for footsteps
      .data(data)
      .enter().append("png:image")

        .attr("class", "foot")
        .attr("xlink:href", function(d) {
          if (d.left == "Y") {
            return "content/leftFoot.png";
          } else {
            return "content/rightFoot.png";
          }
        })
        .style("visibility","hidden")
        .attr("transform", function(d) {return "rotate(" + d.rotate + ", " + x(d.x) + ", " + y(d.y) + ")"})
        .attr("width", 40)
        .attr("height", 40)
        .attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return y(d.y); })
        .style("opacity", "1")  
      .transition()
      .delay(function(d,i) { //Sets a slight delay so that footprints show up one by one
        return i * 370;
      })
      .duration(1500)
      .style("visibility","visible")
      .transition()
      .delay(function(d,i) { //Sets a slight offset delay so that footprints gray out
        return i * 370 + 370;
      })
      .duration(500)
      .style("opacity", ".4");    
  });

  // Loads in year label data and attaches it to the svg
  labelSize.domain([500, 1800]);
  labelSize.range([12, 24]);
  d3.csv("yearLabel.csv", type, function(error, data) {
    x.domain([0, 100]);
    y.domain([0, 120]);

    //Create labels
    svg.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "yearLabel")
      .text(function(d) {
        return d.year;
      })
      .attr("transform", function(d) {return "rotate(" + d.rotate + ", " + x(d.x) + ", " + y(d.y) + ")"})   
      .attr("text-anchor", "middle")
      .attr("x", function(d) {
        return x(d.x);
      })
      .attr("y", function(d) {
        return y(d.y);
      })
      .attr("fill", "brown")
      .style("opacity", "0")
      // Sets font-size dynamically as function of viewport
      .attr("font-size", labelSize(height) + "px")
      // Hides as initial state for fade in transitions
      .transition()
      .delay(function(d) { //Sets a slight delay so that footprints show up one by one
        return parseFloat(d.delay) * 370 - 700 ;
      })
      .duration(2000)
      .style("opacity", "1");     
  });

  // Dynamically sets size of the tooltip info for event images
  d3.select("#tooltip")
    .style("width", .35*width + "px");
  
  // Dynamically sets font size of the tooltip info for event images
  var toolSize = d3.scale.linear()
    .domain([500, 1200])
    .range([13, 25]);
    
  // Dynamically sets linespacing of the tooltip info for event images  
  var lineHeight = d3.scale.linear()
    .domain([500, 1200])
    .range([16, 26]);
    
  d3.selectAll("#tooltip p")
    .style("font-size", toolSize(height) +"px")
    .style("line-height", lineHeight(height) + "px"); 

  // Loads in event images and attaches it to the svg
  d3.csv("eventImages.csv", type, function(error, data) {
    x.domain([0, 100]);
    y.domain([0, 120]);

    //Create labels
    svg.selectAll(".eventImage")
      .data(data)
      .enter()
      .append("png:image")
      .attr("class", "eventImage")
      .attr("xlink:href", function(d) {
        return "content/" + d.imageFile;
      })
      .style("opacity", "0")
      //Dynamically resizes image width
      .attr("width", function(d) { return imageSize(height + parseFloat(d.width)) })
      .attr("height", function(d) { return imageSize(height + parseFloat(d.height)) })
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y); })

      // Transitions to show images in rhythm w/ footsteps
      .transition()
      .delay(function(d) { //Sets a slight delay so that footprints show up one by one
        return parseFloat(d.delay) ;
      })
      .duration(1500)
      .style("opacity", "1");       

    // Creates the mouse target beneath images
    svg.selectAll(".mouseTarget")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "mouseTarget")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y); })
      .attr("width", function(d) { return imageSize(height + parseFloat(d.width)) })
      .attr("height", function(d) { return imageSize(height + parseFloat(d.height)) })
      .style("opacity", "0")  
      .style("cursor", "pointer")     
      .style("visibility","hidden")

    
      // Mouseover events to create a tooltip   
      .on("mouseover", function(d) {
        //Sets position of the tool tip next to image
        d3.select("#tooltip")
          .style("left", x(d.toolX) + "px")
          .style("top", y(d.toolY) + "px")
          .select("#role")
          .text(d.role);
        
        d3.select("#location")
          .text(d.location);
        
        d3.select("#date")
          .text(d.date);
        
        d3.select("#accomplishment")
          .text(d.accomplishment);
        
        
        d3.select("#tooltip").classed("hidden", false); 
      })
    
      .on("mouseout", function() {

        //Hide the tooltip
        d3.select("#tooltip").classed("hidden", true);

      }) 

      // Delays mouseover events by unhidding mouseTarget areas
      .transition()
      .delay(function(d) { //Sets a slight delay so that it aligns w/ images
        return parseFloat(d.delay) ;
      })
      .duration(1500)
      .style("visibility","visible");
          
    
  });   

  function type(d) {
    d.frequency = +d.frequency;
    return d;
  };
};


/**
 * Function resizes experience infographic dynamically without the animations
 */
 
function resizeExperience() {
  var viewportWidth  = document.documentElement.clientWidth,
    viewportHeight = document.documentElement.clientHeight;

  var width = .94 * viewportWidth,
    height = .75 * viewportHeight;
  
  var x = d3.scale.linear()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([0 - 36, height - 36]); //Lazily shift up the entire infographic

  var labelSize = d3.scale.linear()
    .domain([500, 1800])
    .range([14, 30]);
  
  var imageSize = d3.scale.linear()
    .domain([500, 1800])
    .range([60, 140]);

  $("#experienceInfographic").html("");
  var svg = d3.select("#experienceInfographic")
    .attr("width", width)
    .attr("height", height)
    .append("g");
    

  d3.csv("footprintData.csv", type, function(error, data) {
    x.domain([0, 100]);
    y.domain([0, 120]);

    svg.selectAll(".foot") //Creates placeholder for footsteps
      .data(data)
      .enter().append("png:image")

        .attr("class", "foot")
        .attr("xlink:href", function(d) {
          if (d.left == "Y") {
            return "content/leftFoot.png";
          } else {
            return "content/rightFoot.png";
          }
        })
        .attr("transform", function(d) {return "rotate(" + d.rotate + ", " + x(d.x) + ", " + y(d.y) + ")"})
        .attr("width", 40)
        .attr("height", 40)
        .attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return y(d.y); })
        .style("opacity", ".4") 
  });

  // Loads in year label data and attaches it to the svg
  labelSize.domain([500, 1800]);
  labelSize.range([12, 24]);
  d3.csv("yearLabel.csv", type, function(error, data) {
    x.domain([0, 100]);
    y.domain([0, 120]);

    //Create labels
    svg.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "yearLabel")
      .text(function(d) {
        return d.year;
      })
      .attr("transform", function(d) {return "rotate(" + d.rotate + ", " + x(d.x) + ", " + y(d.y) + ")"})   
      .attr("text-anchor", "middle")
      .attr("x", function(d) {
        return x(d.x);
      })
      .attr("y", function(d) {
        return y(d.y);
      })
      .attr("fill", "brown")
      .style("opacity", "1")
      // Sets font-size dynamically as function of viewport
      .attr("font-size", labelSize(height) + "px");     
  });

  // Dynamically sets size of the tooltip info for event images
  d3.select("#tooltip")
    .style("width", .35*width + "px");
  
  // Dynamically sets font size of the tooltip info for event images
  var toolSize = d3.scale.linear()
    .domain([500, 1200])
    .range([13, 25]);
    
  // Dynamically sets linespacing of the tooltip info for event images  
  var lineHeight = d3.scale.linear()
    .domain([500, 1200])
    .range([16, 26]);
    
  d3.selectAll("#tooltip p")
    .style("font-size", toolSize(height) +"px")
    .style("line-height", lineHeight(height) + "px"); 

  // Loads in event images and attaches it to the svg
  d3.csv("eventImages.csv", type, function(error, data) {
    x.domain([0, 100]);
    y.domain([0, 120]);

    //Create labels
    svg.selectAll(".eventImage")
      .data(data)
      .enter()
      .append("png:image")
      .attr("class", "eventImage")
      .attr("xlink:href", function(d) {
        return "content/" + d.imageFile;
      })
      .style("opacity", "1")
      //Dynamically resizes image width
      .attr("width", function(d) { return imageSize(height + parseFloat(d.width)) })
      .attr("height", function(d) { return imageSize(height + parseFloat(d.height)) })
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y); })
    ;       

    // Creates the mouse target beneath images
    svg.selectAll(".mouseTarget")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "mouseTarget")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y); })
      .attr("width", function(d) { return imageSize(height + parseFloat(d.width)) })
      .attr("height", function(d) { return imageSize(height + parseFloat(d.height)) })
      .style("opacity", "0")  
      .style("cursor", "pointer")     

    
      // Mouseover events to create a tooltip   
      .on("mouseover", function(d) {
        //Sets position of the tool tip in upper right hand window
        d3.select("#tooltip")
          .style("left", x(d.toolX) + "px")
          .style("top", y(d.toolY) + "px")
          .select("#role")
          .text(d.role);
        
        d3.select("#location")
          .text(d.location);
        
        d3.select("#date")
          .text(d.date);
        
        d3.select("#accomplishment")
          .text(d.accomplishment);
        
        
        d3.select("#tooltip").classed("hidden", false); 
      })
    
      .on("mouseout", function() {

        //Hide the tooltip
        d3.select("#tooltip").classed("hidden", true);

      })
    ;
          
    
  });   

  // Redraws image upon resize for the skill graph
  
  

  function type(d) {
    d.frequency = +d.frequency;
    return d;
  };
};

// Sets up the initial skills infographic
drawSkills();
var activeCategory = "qualitative";

/**
 * Draws the skills infographic
 */
function drawSkills() {
  var viewportWidth  = document.documentElement.clientWidth,
    viewportHeight = document.documentElement.clientHeight;

  var margin = {top: 20, right: 50, bottom: 40, left: 50},
    width = viewportWidth - margin.left - margin.right,
    height = .5*viewportHeight - margin.top - margin.bottom;

  // Defines the scale that will map position coordinates [0-100] to the graph  
  var x = d3.scale.linear()
    .domain([0, 100])
    .range([0, width]);

  var y = d3.scale.linear()
    .domain([0, 100])
    .range([height, 0]);

  // Scale that allows for dynamic rescaling of text, radius as window changes
  var labelSize = d3.scale.linear()
    .domain([300, 1200])
    .range([7, 18]);
  
  var radiusSize = d3.scale.linear()
    .domain([300, 1800])
    .range([30, 180]);

  var circleRadius = radiusSize(Math.min(width, height));   

  // Creates the x and y axis by first defining ordinal scales
  var xAxisScale = d3.scale.ordinal()
    .domain(["familiar", "proficient", "expert"])
    .rangePoints([30, width-30]);
  
  var xAxis = d3.svg.axis()
    .scale(xAxisScale)
    .orient("bottom");

  var yAxisScale = d3.scale.ordinal()
    .domain(["Academic", "Applied"])
    .range([height-30, 0]);
  
  var yAxis = d3.svg.axis()
    .scale(yAxisScale)
    .orient("left");

  var visBody = d3.select(".skillsGraph");

  // var visBody = d3.select("#thirdSection").append("div")
  //   .attr("class", "vis");
  
  var sideBarTextScale = d3.scale.linear()
    .domain([500, 1200])
    .range([10, 24]);
    
  // Sets size of text for third section content
  // d3.select("#thirdSection")
  //   .style("font-size", sideBarTextScale(Math.min(viewportWidth, viewportHeight)) + "px");
    
  // Variable to indicate if a transition is in progress, prevents conflicting transitions on 
  // the same element
  var transitionProgress = false;
  
  // Loads in data from skillData.csv as one big function
  d3.csv("skillData.csv", type, function(error, data) {
    // Creates the SVG, followed by the g container w/ margins that will hold the graph    
    var svg = visBody.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Adds the axes and the labels (relative to g for the axis)
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .style("font-size", "10px")
      .attr("dx", "-.2em")
      .attr("dy", ".15em")
      .attr("transform", function (d) {
        return "rotate(-30)";
      });

    svg.append("text")
      .attr("class", "axisLabel")
      .attr("transform", "rotate(-90,-" + margin.left/2 + "," + height/2 + ")")
      .attr("x", - margin.left/2)
      .attr("y", height/2)
      .style("text-anchor", "middle")
      // .style("font-size", "11px")      
      .text("Domain of Experience");
    
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .style("font-size", "10px");

    svg.append("text")
      .attr("class", "axisLabel")
      .attr("x", width/2)
      .attr("y", height + margin.bottom*.9)
      .style("text-anchor", "middle")
      // .style("font-size", "11px")
      .text("Degree of Experience");
  
      x.domain([0, 100]);
      y.domain([0, 100]);
  
      svg.selectAll(".point") //Creates placeholder for points
        .data(data)
        .enter().append("circle")

          .attr("class", function(d) {
            return d.skillType + " skill" + d.index;
          })        
          .attr("cx", function(d) { return x(d.x); })
          .attr("cy", function(d) { return y(d.y); })
          .attr("r", function(d) {
            if (d.skillType == activeCategory) {
              return circleRadius;
            } else {
              return "0.01";
            };
          })
          .attr("opacity", "1");      
        
    visBody.append("div")
      .attr("class", "skillLabels")
      .selectAll(".skillLabel")
      .data(data)
      .enter().append("a")
        .attr("class", function (d) { return "skillLabel " + d.skillType})
        .style("width", 2*radiusSize(Math.min(width, height)) + "px")
        .style("left", function(d) { return x(d.x) + margin.left + 12 - circleRadius + "px"; })
        .style("top", function(d) { return y(d.y) + margin.top - 2 - circleRadius*.4 + "px"; })
        .style("text-anchor", "middle")
        .style("text-align", "center")
        .style("font-size", labelSize(Math.min(viewportWidth, viewportHeight)) + "px")
        .style("opacity", function(d) {
          if (d.skillType == activeCategory) {
            return "1";
          } else {
            return "0";
          };      
        })          
        .text(function(d) { return (d.skill);});
    
    // Defines transitions as the button icons are clicked
    d3.select("#quantButton").on("click", function () {
      activeCategory = "quantitative";
      transitionProgress = true;
      // Switches sidebar text
      d3.select("#qualitativeText").style("display", "none");
      d3.select("#quantitativeText").style("display", "block");
      d3.select("#technicalText").style("display", "none");
      // Switches plot w/ transition of circles 
      d3.select("#quantButton").attr("class","active");
      d3.select("#qualButton").attr("class","inactive");
      d3.select("#techButton").attr("class","inactive");  
      d3.selectAll(".quantitative").transition().duration(1000)
        .attr("r", circleRadius)
        .style("opacity", "1");
      d3.selectAll(".qualitative").transition().duration(1000)
        .attr("r", ".01")
        .style("opacity", "0");
      d3.selectAll(".technical").transition().duration(1000)
        .attr("r", ".01")
        .style("opacity", "0");
      setTimeout(function() {transitionProgress = false;}, 1000);
    }); 
  
    d3.select("#qualButton").on("click", function (d) {
      activeCategory = "qualitative";
      transitionProgress = true;
      // Switches sidebar text
      d3.select("#qualitativeText").style("display", "block");
      d3.select("#quantitativeText").style("display", "none");
      d3.select("#technicalText").style("display", "none");
      // Switches plot w/ transition of circles
      d3.select("#quantButton").attr("class","inactive");
      d3.select("#qualButton").attr("class","active");
      d3.select("#techButton").attr("class","inactive");    
      d3.selectAll(".quantitative").transition().duration(1000)
        .attr("r", ".01")
        .style("opacity", "0");
      d3.selectAll(".qualitative").transition().duration(1000)
        .attr("r", circleRadius)
        .style("opacity", "1");
      d3.selectAll(".technical").transition().duration(1000)
        .attr("r", ".01")
        .style("opacity", "0");
      setTimeout(function() {transitionProgress = false;}, 1000);
    });
  
    d3.select("#techButton").on("click", function () {
      activeCategory = "technical";
      transitionProgress = true;
      // Switches sidebar text
      d3.select("#qualitativeText").style("display", "none");
      d3.select("#quantitativeText").style("display", "none");
      d3.select("#technicalText").style("display", "block");
      // Switches plot w/ transition of circles 
      d3.select("#quantButton").attr("class","inactive");
      d3.select("#qualButton").attr("class","inactive");
      d3.select("#techButton").attr("class","active");    
      d3.selectAll(".quantitative").transition().duration(1000)
        .attr("r", ".01")
        .style("opacity", "0");
      d3.selectAll(".qualitative").transition().duration(1000)
        .attr("r", ".01")
        .style("opacity", "0");
      d3.selectAll(".technical").transition().duration(1000)
        .attr("r", circleRadius)
        .style("opacity", "1"); 
      setTimeout(function() {transitionProgress = false;}, 1000);
    });
  
    // Defines on mouseover event for skill lists on the sidebar, only while
    // other circle transitions are not in progress
    d3.selectAll(".skillList li").on("mouseover", function() {
      if (!transitionProgress) {
        var className = "." + d3.select(this).attr("class");
        d3.selectAll(".skillList > " + className)
          .style("background-color", function() { 
            if (activeCategory == "qualitative") {
              return "#ED9355"}
            else if (activeCategory == "quantitative"){ 
              return "#A7BD5B"}
            else {
              return "#DC574E"};
            });
        d3.selectAll(".toolList > " + className)
          .style("background-color", "#8DC7B8");
        d3.selectAll(".vis " + className).transition()
          .duration(200)
          .style("opacity", ".5");    
      };
    });     

    // Defines on mouseout event for skill lists on the sidebar
    d3.selectAll(".skillList li").on("mouseout", function() {
      if (!transitionProgress) {
        var className = "." + d3.select(this).attr("class");
        d3.selectAll(".skillList > " + className)
          .style("background-color", "inherit");
        d3.selectAll(".toolList > " + className)
          .style("background-color", "inherit");
        d3.selectAll(".vis " + className).transition()
          .duration(200)
          .style("opacity", "1");   
      };
    });     


    // Defines on mouseover event for tool lists on the sidebar, only while
    // other circle transitions are not in progress
    d3.selectAll(".toolList li").on("mouseover", function() {
      if (!transitionProgress) {
        d3.select(this).style("background-color", "#8DC7B8");
        var classNames = d3.select(this).attr("class").split(/\s+/);
        for (var i = 0; i < classNames.length; i++) {
          var className = "." + classNames[i];
          d3.selectAll(".skillList > " + className)
            .style("background-color", function() { 
              if (activeCategory == "qualitative") {
                return "#ED9355"}
              else if (activeCategory == "quantitative"){ 
                return "#A7BD5B"}
              else {
                return "#DC574E"};
              });
          d3.selectAll(".vis " + className).transition()
            .duration(200)
            .style("opacity", ".5");    
        };
      };
    });     

    // Defines on mouseout event for skill lists on the sidebar
    d3.selectAll(".toolList li").on("mouseout", function() {
      if (!transitionProgress) {
        var classNames = d3.select(this).attr("class").split(/\s+/);
        for (var i = 0; i < classNames.length; i++) {
          var className = "." + classNames[i];
          d3.selectAll(".skillList > " + className)
            .style("background-color", "inherit");
          d3.selectAll(".toolList > " + className)
            .style("background-color", "inherit");
          d3.selectAll(".vis " + className).transition()
            .duration(200)
            .style("opacity", "1");   
        };
      };
    });     
          
  }); //End skillData load

  function type(d) {
    d.frequency = +d.frequency;
    return d;
  };
}; //Ends function drawSkills





