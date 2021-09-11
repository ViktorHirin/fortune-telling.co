$(function () {
  $('.title-show-products a').click(function(){
  	$('.menu-right').toggle()
  });
//   $('.slider-week').slick({
// 	  slidesToShow: 4,
// 	  responsive: [
// 	    {
// 	      breakpoint: 768,
// 	      settings: {
// 	        slidesToShow: 2
// 	      }
// 	    },
// 	    {
// 	      breakpoint: 480,
// 	      settings: {
// 	        arrows: false,
// 	        slidesToShow: 1
// 	      }
// 	    }
// 	  ]
// 	});

 
  $('.toggle-menu').click(function(){
  	$('.right-header').toggleClass('active');
  	$(this).toggleClass('active');
  });
  $('.toogle-chat').click(function(){
  	$('.chat-main').toggleClass('active');
  	$(this).toggleClass('active');
  });
  //  if($('.chat-main').length){
  //  	 $(".scroll-user, .list-chat").niceScroll({cursorcolor:"#e6e6e6"});
	// }
 
})