function checker(arr, target) {
// Check if all values exist in any list
    const allValuesExist = arr.some(item =>
        target.every(value => item.list.includes(Number(value)))
    );
    return allValuesExist;
}

let currentPage = 1;
let booster = {
    providers: [],
    signals: [],
    otherSignals: [], //uniquenotwifi
    datefreq: [],
    range: [],
}

async function handleQuizSelection(e) {
    // Select all providers btn
    if (e.currentTarget.getAttribute('data-type') == 'all_networks' && !e.currentTarget.classList.contains('selected')) {
        e.currentTarget.parentNode.querySelectorAll('.booster-quiz-card').forEach((card) => {
            card.classList.add('selected');
            if (card.getAttribute('data-term-id') == 'data') {
                card.classList.remove('selected');
            }
        });
    } else if (e.currentTarget.getAttribute('data-type') == 'all_networks' && e.currentTarget.classList.contains('selected')) {
        e.currentTarget.parentNode.querySelectorAll('.booster-quiz-card').forEach((card) => {
            card.classList.remove('selected');
        });
    }
    // Select only one card in range cards
    else if (e.currentTarget.getAttribute('data-term') == 'range') {
        document.querySelectorAll('[data-term="range"]').forEach((range) => {
            range.classList.remove('selected')
        })
        e.currentTarget.classList.add('selected');
    }
    // Card selection
    else {
        e.currentTarget.classList.toggle('selected');
    }
    let term = e.currentTarget.getAttribute('data-term');
    let id = e.currentTarget.getAttribute('data-term-id');
    if (e.currentTarget.getAttribute('data-type') == 'all_networks') {
        document.querySelectorAll('#slide1 .booster-quiz-card').forEach((el) => {
            let allIds;
            if (el.classList.contains('selected') && el.getAttribute('data-term-id')) {
                allIds = el.getAttribute('data-term-id');
                booster.providers.push(allIds);
            } else {
                booster.providers = [];
            }
        })
    } else {
        if (!booster[term].includes(id)) {
            booster[term].push(id);
        } else {
            let index = booster[term].indexOf(id);
            booster[term].splice(index, 1)
        }
    }
    if (e.currentTarget.getAttribute('data-term') == 'signals') {
        document.querySelectorAll('[data-term="signals"]').forEach((signal) => {
            let signalId = signal.getAttribute('data-term-id');
            if (!booster.otherSignals.includes(signalId)) {
                booster.otherSignals.push(signalId);
            }
        })
    }
    if (currentPage == 3) {
        let newIds = [...booster.providers?.filter(v => v !== 'data'), ...booster.signals];
        let datefreq = [];
        let freqs_array;
        await fetch('./freq.json')
            .then(res => res.json())
            .then((data) => {
                freqs_array = data;
                freqs_array.forEach((item) => {
                    if (checker(item.list, newIds)) {
                        datefreq.push(item.termID);
                    }
                });
            }).catch(err => console.error(err));
        freqs_array.forEach((item) => {
            if (newIds.every(val => item.list.includes(Number(val)))) {
                datefreq.push(item.termID);
            }
        });
        booster.datefreq = datefreq;
        setTimeout(() => {
            window.location.href = `https://mobileboosteruk.com/search-result/?prd=${booster?.providers?.join(',')}&rng=${booster?.range}&wifi=${booster?.signals?.join(',')}&fre=${booster?.datefreq?.join(',')}&nwifi=${booster?.otherSignals?.join(',')}`;
        }, 1000)
    }
    console.log(booster);
}


const slider = document.getElementById('slider');
const pageIndicator = document.getElementById('page-indicator');
const prevButton = document.querySelectorAll('[id*="prev"]');
const nextButton = document.getElementById('next');

function updateSlider() {
    slider.style.transform = `translateX(-${(currentPage - 1) * 100}%)`;
    pageIndicator.textContent = `(${currentPage}/3)`;
    if (currentPage == 3) {
        document.querySelector('#slide3').style = "display:flex;";
        setTimeout(() => {
            document.querySelector('#slide2').style = "display:none;";
            document.querySelector('#slide1').style = "display:none;";
        }, 300);
    } else if (currentPage == 2) {
        setTimeout(() => {
            document.querySelector('#slide3').style = "display:none;";
            document.querySelector('#slide1').style = "display:none;";
        }, 300);
        document.querySelector('#slide2').style = "display:flex;";
    }
    if (currentPage == 1) {
        setTimeout(() => {
            document.querySelector('#slide3').style = "display:none;";
            document.querySelector('#slide2').style = "display:none;";
        }, 300);
        document.querySelector('#slide1').style = "display:flex;";
    }
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${(currentPage * 33.333)}%`;
}

prevButton.forEach((btn) => {
    btn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateSlider();
        }
        if (currentPage == 1) {
            document.querySelectorAll('[id*="prev"]').forEach((btn) => {
                btn.classList.remove('visible');
            });
        }
    });
})
nextButton.addEventListener('click', () => {
    let selected = false;
    document.querySelectorAll(`#slide${currentPage} .booster-quiz-card`).forEach((el) => {
        if (el.classList.contains('selected')) {
            selected = true;
        }
    });
    if (currentPage < 3 && selected) {
        document.querySelectorAll('[id*="prev"]').forEach((btn) => {
            btn.classList.add('visible');
        });
        currentPage++;
        updateSlider();
    } else {
        document.querySelector('.quiz-error-message').classList.add('visible');
        setTimeout(() => {
            document.querySelector('.quiz-error-message').classList.remove('visible');
        }, 10000)
    }
});

updateSlider(); // Initialize the slider position
document.querySelectorAll('.booster-quiz-card').forEach((card) => {
    card.addEventListener('click', handleQuizSelection);
});
