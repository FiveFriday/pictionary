$(document).foundation();
$(document).ready(function() {
  $("img.lazy").lazyload();
  var d = new Date();
  $('.copyright').replaceWith($('.copyright').text().replace('2016', d.getFullYear()));
});
