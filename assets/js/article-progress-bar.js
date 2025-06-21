function handleProgressBar() {
    let docElem = document.documentElement;
    let docBody = document.body;
    let scrollTop;
    let scrollBottom = (document.querySelector('#blog-article').offsetHeight) - (window.innerHeight);
    if (docElem['scrollTop'] <= scrollBottom) {
        scrollTop = docElem['scrollTop'];
    } else {
        scrollTop = scrollBottom;
    }
    let scrollPercent = scrollTop / scrollBottom * 100 + '%';
    document.getElementById("article-progress-bar").style.width = `${scrollPercent}`;
}

document.addEventListener('scroll', handleProgressBar)