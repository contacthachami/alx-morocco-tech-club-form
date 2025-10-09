document.addEventListener("DOMContentLoaded", function () {
  document.documentElement.style.scrollBehavior = "smooth";

  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress-bar";
  progressBar.innerHTML = '<div class="scroll-progress-fill"></div>';
  document.body.prepend(progressBar);

  window.addEventListener("scroll", function () {
    const winScroll = document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const fill = document.querySelector(".scroll-progress-fill");
    if (fill) {
      fill.style.width = scrolled + "%";
    }
  });

  const header = document.querySelector(".header");
  if (header) {
    window.addEventListener("scroll", function () {
      const scrolled = window.pageYOffset;
      if (scrolled < 500) {
        header.style.transform = "translateY(" + scrolled * 0.5 + "px)";
        header.style.opacity = 1 - scrolled / 600;
      }
    });
  }

  const iframe = document.querySelector(".google-form-iframe");
  if (iframe) {
    const loader = document.createElement("div");
    loader.className = "form-loader";
    loader.innerHTML = '<div class="spinner"></div><p>Loading form...</p>';
    iframe.parentElement.appendChild(loader);

    iframe.addEventListener("load", function () {
      setTimeout(function () {
        loader.style.opacity = "0";
        setTimeout(function () {
          if (loader.parentElement) {
            loader.remove();
          }
        }, 500);
      }, 1000);
    });

    setTimeout(function () {
      if (loader.parentElement) {
        loader.style.opacity = "0";
        setTimeout(function () {
          if (loader.parentElement) {
            loader.remove();
          }
        }, 500);
      }
    }, 5000);
  }

  console.log(
    "%c ALX Morocco Tech Club",
    "color: #6366f1; font-size: 20px; font-weight: bold;"
  );
});
