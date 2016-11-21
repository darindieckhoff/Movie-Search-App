
!function ($) {
  'use strict';

/*=================
Event Handler for movie search. Requests data from OMDb API based on user input for Movie and Year.
=================*/
$('.description-page').hide();
$('#submit').on('click', function(evt){ 
  evt.preventDefault();
  var omdbURL = 'http://www.omdbapi.com/?';
  var $userInput = $('#search').val();
  var $userInputYear = $('#year').val();
  var data = {
    s: $userInput,
    y: $userInputYear,
    type: 'movie'
  };//end AJAX data array
  
/*=================
-$.getJSON request callback function. Iterates through each returned object in 'Search' array putting poster, title, and year information into a <li>. 
-Everything in <li> wrapped in anchor that links to specific IMDB page.
-All returned matched movie <li> are added to DOM.
=================*/
  function movieSearchResults (movies) {
    if (movies.Response === 'True') {
    var movieHTML= '';
    $.each(movies.Search, function (i, movie) {
      movieHTML += '<li><a href="http://www.imdb.com/title/' + movie.imdbID + '">';
      movieHTML += '<div class="poster-wrap">';
      
      /*=================
       -If movie poster is returned 'NA' a placeholder is put in place.
      =================*/
      switch (movie.Poster){
        case "N/A":
          movieHTML += '<i class="material-icons poster-placeholder">crop_original</i></div>';
          break;
        default: 
          movieHTML += '<img class="movie-poster" src="' + movie.Poster + '"></div>';
      } // end switch
      movieHTML += '<span class="movie-title">' + movie.Title + '</span>';
      movieHTML += '<span class="movie-year">' + movie.Year + '</span></a>';
      movieHTML += '<button type="button" class="movie-desc">Full Description</button></li>';
    }); //end .each
      $('#movies').html(movieHTML);
    
    /*=================
    -Let users know when search returns no movie data
    -If the search returns no movie data, display the text "No movies found that match: 'title'."
    =================*/
    } else {
      var failHTML = '<li class="no-movies">';
      failHTML += '<i class="material-icons icon-help">help_outline</i>No movies found that match: ' + $userInput + '.</li>';
      $('#movies').html(failHTML);
    } //end fail if
    
  } //end movie search callback
  $.getJSON(omdbURL, data, movieSearchResults); //AJAX request
  
}); //end submit
  
/*=================
-event handler for movie description.
  -Shows description page and hides movie list.
  -Disabled search input elements.
=================*/ 
$(document).on("click", ".movie-desc", function(movies){
  $('.movie-list').hide();
  $('.description-page').fadeIn('slow');
  $('#search').prop('disabled', true);
  $('#year').prop('disabled', true);
  
  /*=================
  -Gets imdb ID from clicked movie and uses it for another AJAX request from OMDb
  =================*/ 
  var clickedMovie = $(this).siblings().attr('href');
  var clickedMovieID = clickedMovie.replace('http://www.imdb.com/title/','');
  var omdbURL = 'http://www.omdbapi.com/?';
  var movieDesc = {
    i: clickedMovieID,
    type: 'movie'
  }; //end AJAX data array
  
  /*=================
  -$.getJSON callback function.
    -hides poster placeholder.
    -if 'N/A' is returned for poster then poster placeholder remains.
    -selected movie poster, title, IMDB rating, and plot added to DOM
  =================*/ 
  function selectedMovieDesc (selectedMovie) {
    if (selectedMovie.Response === 'True') {
      if (selectedMovie.Poster !== 'N/A'){
        $('.desc-poster-placeholder').hide();
        $('.poster').html('<img class="movie-poster" src="' + selectedMovie.Poster + '">');
      } else {
        $('.poster').html('<i class="material-icons desc-poster-placeholder">crop_original</i>');
      } // end if
      $('.desc-movie-name').text(selectedMovie.Title);
      $('.desc-movie-rating').text('IMDB Rating: ' + selectedMovie.imdbRating);
      $('.movie-plot').text(selectedMovie.Plot);
    } //end error if
  }// end callback function
  
  $.getJSON(omdbURL, movieDesc, selectedMovieDesc); //AJAX request

  /*=================
  -Event handler to return to search page.
  -Hides description page and shows search page.
  -Enables search and year inputs.
  =================*/ 
  $(document).on("click", "#return", function(){
    $('.description-page').hide();
    $('.movie-list').fadeIn('slow');
    $('#search').prop('disabled', false);
    $('#year').prop('disabled', false);
  }); // end return button click event
  
  /*=================
  -Event handler for 'View on IMDB button that links to selected movie's IMDB page.
  =================*/
  $('#IMDB').on('click', function() {
    window.location.href = clickedMovie;
  });
  
}); //end desc click
}(window.jQuery);