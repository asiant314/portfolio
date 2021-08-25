<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Thai Le</title>

    <!-- CSS Stylesheets -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/contact.css" rel="stylesheet">

    <!-- Favicon -->
    <link rel="shortcut icon" type="image/x-icon" href="content/favicon.ico" />
    <link href='http://fonts.googleapis.com/css?family=Droid+Serif|Open+Sans:400,700' rel='stylesheet' type='text/css'>

    <!-- Google Analytics -->
  <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-41250169-2', 'auto');
    ga('send', 'pageview');

  </script>
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>

      <!-- PHP to notify if a message was successfully sent -->
      <?php if (!empty($_GET["sent"])) {
        echo '<script language="javascript">';
        echo 'alert("Thank you for your message. I will get back to you shortly :).")';
        echo '</script>';} 
      ?>


    <div id="container">
        <!-- Nav header -->
    <nav class="navbar navbar-default " role="navigation">
      <div class="navText container col-sm-12 col-lg-10 col-sm-offset-0 col-lg-offset-1 ">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <!-- You'll want to use a responsive image option so this logo looks good on devices - I recommend using something like retina.js (do a quick Google search for it and you'll find it) -->
          <div class="navbar-header" >
            <a class="navbar-brand" href="index.html">
              <img alt="Logo" src="content/brand.png">
            </a>
          </div>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse navbar-ex1-collapse">
          <ul class="nav navbar-nav navbar-right">
            <!-- <li><a href="index.html"><i class="homeIcon fa fa-home"></i>Home</a></li> -->
            <li><a href="index.html">About</a></li>
            <li><a href="experience.html">Experience</a></li>
            <li><a href="projects.html">Projects</a></li>
            <li><a href="publications.html">Publications</a></li>
            <li class="active"><a href="contact.php">Contact</a></li>
          </ul>
        </div><!-- /.navbar-collapse -->
      </div><!-- /.container -->
    </nav>


      <div class="container-fluid">
        <div class="row" id="contentRow">
          <div class="col-md-10 col-md-offset-1">
            <h1 id="pageHeader">Contact</h1>
            <div class="col-xs-12 col-md-6" id="locationPicture">
              <img src="content/contactPic2.png" class="img-responsive img-thumbnail" alt="Team Picture"/>
            </div>
            <div class="col-xs-12 col-md-6" id="contactSection">
              <p>   
                 If you have any questions or would like to chat about any projects, you can contact me by <a href="mailto:tle23@uw.edu">e-mail</a> or leave me a message through this form. 
              </p>
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h2 class="panel-title">Contact Form</h2>
                </div>
                <div class="panel-body">
                  <form name="contactform" method="post" action="mailer.php" class="form-horizontal" role="form">
                    <div class="form-group">
                      <label for="inputName" class="col-lg-2 control-label">Name</label>
                      <div class="col-lg-10">
                        <input type="text" class="form-control" id="inputName" name="inputName" placeholder="Your Name">
                      </div>
                    </div>
                    <div class="form-group">
                      <label for="inputEmail1" class="col-lg-2 control-label">Email</label>
                      <div class="col-lg-10">
                        <input type="text" class="form-control" id="inputEmail" name="inputEmail" placeholder="Your Email">
                      </div>
                    </div>
                    <div class="form-group">
                      <label for="inputSubject" class="col-lg-2 control-label">Subject</label>
                      <div class="col-lg-10">
                        <input type="text" class="form-control" id="inputSubject" name="inputSubject" placeholder="Subject Message">
                      </div>
                    </div>
                    <div class="form-group">
                      <label for="inputPassword1" class="col-lg-2 control-label">Message</label>
                      <div class="col-lg-10">
                        <textarea class="form-control" rows="4" id="inputMessage" name="inputMessage" placeholder="Your message..."></textarea>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-lg-offset-2 col-lg-10">
                        <button type="submit" class="btn btn-default">
                          Send Message
                        </button>
                      </div>
                    </div>
                  </form>

                </div> <!--/.panel-body-->   
              </div> <!--/.panel-->
            </div>



          </div> <!--/.col-md-10-->
        </div> <!--/.row-->
      </div>


    <!-- Content for the footer -->
    <footer>
        <div class="col-lg-12">
            <p><a href="index.html">About</a> | <a href="experience.html">Experience</a> | <a href="projects.html">Projects</a> | <a href="publications.html">Publications</a> | <a class="active" href="contact.php">Contact</a></p>
      </div>
    </footer>

  </div> <!--/#container -->

    <script src="js/jquery-1.11.1.min.js"></script>   
    <script src="js/bootstrap.min.js"></script>     
  </body>
</html>