function toggleMenu() {
    var sidebar = document.getElementById("sidebar");
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
    } else {
        sidebar.style.width = "250px";
    }
}

window.addEventListener('load', function() {
    var loader = document.getElementById('loader');
    var content = document.getElementById('content');
    loader.style.display = 'none';
    content.style.display = 'block';
});

document.addEventListener("DOMContentLoaded", function() {
    let lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
    if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove("lazy");
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });
        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        let lazyLoadThrottleTimeout;
        function lazyload () {
            if(lazyLoadThrottleTimeout) {
                clearTimeout(lazyLoadThrottleTimeout);
            }    
            lazyLoadThrottleTimeout = setTimeout(function() {
                let scrollTop = window.pageYOffset;
                lazyImages.forEach(function(img) {
                    if(img.offsetTop < (window.innerHeight + scrollTop)) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                    }
                });
                if(lazyImages.length == 0) { 
                    document.removeEventListener("scroll", lazyload);
                    window.removeEventListener("resize", lazyload);
                    window.removeEventListener("orientationChange", lazyload);
                }
            }, 20);
        }
        document.addEventListener("scroll", lazyload);
        window.addEventListener("resize", lazyload);
        window.addEventListener("orientationChange", lazyload);
    }
});
const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/script/main.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

const purify = require('purify-css');
const fs = require('fs');
const path = require('path');

// Caminho para seus arquivos HTML e JS
const content = [path.join(__dirname, './index.html'), path.join(__dirname, 'src/**/*.js')];

// Caminho para o seu CSS
const css = [path.join(__dirname, 'src/styles/styles.css')];

// Diretório onde você deseja salvar o CSS purificado
const output = path.join(__dirname, 'dist/purified.css');

// Executa o PurifyCSS
const result = purify(content, css, { 
  // Opções adicionais
  minify: true,
  // Lista de classes que você deseja manter, se houver
  safelist: [],
});

// Salva o CSS purificado em um arquivo
fs.writeFileSync(output, result);

console.log('PurifyCSS concluído. CSS purificado salvo em dist/purified.css');