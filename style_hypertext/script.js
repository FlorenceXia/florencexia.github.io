window.addEventListener('scroll', function() {
    var scrollHeight = document.documentElement.scrollHeight;
    var scrollPosition = window.scrollY + window.innerHeight;  
    var quoteElems = document.querySelectorAll('.quote'); 

    quoteElems.forEach(function(quote) {
        var startPercentage = parseInt(quote.getAttribute('data-start'));
        var endPercentage = parseInt(quote.getAttribute('data-end'));

        var startPixel = (startPercentage / 100) * scrollHeight;
        var endPixel = (endPercentage / 100) * scrollHeight;

        if (scrollPosition > startPixel && scrollPosition < endPixel) {
            quote.style.opacity = "1";
        } else {
            quote.style.opacity = "0";
        }
    });
});
