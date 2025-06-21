function shareArticle(e) {
    document.querySelector('#share-facebook').href = `https://www.facebook.com/share.php?u=${window.location.href}`
    document.querySelector('#share-x').href = `https://x.com/intent/tweet?text=${window.location.href}`
}

shareArticle();