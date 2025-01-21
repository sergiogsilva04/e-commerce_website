$(document).ready(function () {
    $.each($("[data-include]"), function () {
        $(this).load(`../views/${$(this).data("include")}.html`, function () {
            $("#scrollToTopButton").on("click", function () {
                $("html, body").animate({ scrollTop: 0 }, 500);
            });
        });
    });

    $(window).scroll(function () {
        if ($(this).scrollTop() > 40) {
            $("#scrollToTopButton").fadeIn();

        } else {
            $("#scrollToTopButton").fadeOut();
        }
    });

    document.getElementById("copyright").innerHTML = `Copyright &copy ${new Date().getFullYear()} Todos os direitos reservados | <strong>E-commerce</strong>`;

    $("#scrollToTopButton").on("click", function () {
        $("html, body").animate({ scrollTop: 0 }, 500);
    });
});