(function($) {
  "use strict"; // Start of use strict
  window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.getElementById("navbar").style.padding = "10px 10px";
    document.getElementById("logo").style.fontSize = "25px";
  } else {
    document.getElementById("navbar").style.padding = "20px 10px";
    document.getElementById("logo").style.fontSize = "35px";
  }
}
$('#logo').click(function(e){
  $(document).scrollTop(100)
});
})(jQuery); // End of use strict
