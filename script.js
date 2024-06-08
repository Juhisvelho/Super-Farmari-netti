const vaihdaNappi = document.getElementById('vaihdanappi');
const heitaNappi = document.getElementById('heitanappi');
const seuraavaNappi = document.getElementById('seuraavanappi');
const pelaajaNimiText = document.getElementById('pelaajaNimi');
const oranssiNoppaText = document.getElementById('oranssiNoppa');
const sininenNoppaText = document.getElementById('sininenNoppa');
const vaihtoSivu = document.getElementById('vaihtokauppaContainer');
const koiraContainer = document.querySelector('.koirat');
let oranssiNoppa;   
let sininenNoppa;
let vuoro = 0;

const eläinElementit = {
    puput: document.getElementById('pupuLKM'),
    lampaat: document.getElementById('lammasLKM'),
    possut: document.getElementById('possuLKM'),
    lehmat: document.getElementById('lehmaLKM'),
    hevoset: document.getElementById('hevonenLKM'),
};

const koiraElementit = {
    pienet: document.getElementById('pieniLKM'),
    isot: document.getElementById('isoLKM'),
}

const kuvaElementit = {
    pupuVaihdettava: document.getElementById('pupuVaihdettava'),
    lammasVaihdettava: document.getElementById('lammasVaihdettava'),
    possuVaihdettava: document.getElementById('possuVaihdettava'),
    lehmaVaihdettava: document.getElementById('lehmaVaihdettava'),
    lammasVaihdettavaK: document.getElementById('lammasVaihdettavaK'),
    lehmaVaihdettavaK: document.getElementById('lehmaVaihdettavaK'),
    lammasTuote: document.getElementById('lammasTuote'),
    possuTuote: document.getElementById('possuTuote'),
    lehmaTuote: document.getElementById('lehmaTuote'),
    hevonenTuote: document.getElementById('hevonenTuote'),
    isoKoira: document.getElementById('isoKoira'),
    pieniKoira: document.getElementById('pieniKoira'),
}

// luodaan nopille tietokannat
const nopat = [
    {
        tyyppi: "oranssi",
        vaihtoehdot: ['pupu', 'lammas', 'possu', 'kettu', 'hevonen'],
        määrät: [5, 7, 9, 10, 11],
    },
    {
        tyyppi: "sininen",
        vaihtoehdot: ['pupu', 'lammas', 'possu', 'lehmä', 'susi'],
        määrät: [5, 8, 9, 10, 11], // jos luku väliltä [0, 11] on 5 tai alle, palauttaa noppa pupu, jos taas 6-8, palauttaa se lamas
    }
]

const pelaajat = [];
const eläimet = ['pupu', 'lammas', 'possu', 'lehmä', 'hevonen'];

window.onload = function() {
    määritäPelaajat();
    aloitaPeli();
}

function aloitaPeli() {
    // päivitä nappulatilanne
    aktiivinenPelaaja = pelaajat[vuoro];
    updatePelaaja();
    updateNappulat();
    updateKoirat();
    updateVaihtokauppa();
    heitaNappi.addEventListener('click', heitäNoppa);
}

function seuraavaVuoro() {
    seuraavaNappi.removeEventListener('click', seuraavaVuoro);
    seuraavaNappi.disabled = true;
    heitaNappi.disabled = false;
    oranssiNoppaText.innerText = '';
    sininenNoppaText.innerText = '';
    tarkistaVoittaja();updateVaihtokauppa();
    vuoro = (vuoro + 1) % pelaajat.length;
    suljeVaihto();
    aloitaPeli();
}

    
function määritäPelaajat() {
    const pelaajaLKM = Number(prompt("Syötä pelaajamäärä: "));
    for (let i = 0; i < pelaajaLKM; i++) {
        let pelaaja = 
        {
            peliNimi: prompt(`Syötä pelaajan ${i+1} pelaajanimi: `),
            nappulat: {
                puput: 1,
                lampaat: 0,
                possut: 0,
                lehmat: 0,
                hevoset: 0
            },
            koirat: {
                pienet: 1,
                isot: 0
            }
        }
        pelaajat.push(pelaaja);
    }
}

function rng(max) {
    return Math.floor(Math.random()*max)
}


// palauttaa nopan värin perusteella eläimen, joka tulee nopan silmälukujen perusteella (0-11)
function pisteytäNoppa(tyyppi) {
    silmäluku = rng(12);
    let noppa = valitseNoppa(tyyppi);
    for (let index in noppa.vaihtoehdot) {
        if (silmäluku <= noppa.määrät[index]) {
            return noppa.vaihtoehdot[index];
        }
    }
}

function heitäNoppa() {
    heitaNappi.removeEventListener('click', heitäNoppa);
    heitaNappi.disabled = true;
    oranssiNoppa = pisteytäNoppa("oranssi");
    sininenNoppa = pisteytäNoppa("sininen");
    oranssiNoppaText.innerText = oranssiNoppa;
    sininenNoppaText.innerText = sininenNoppa;
    lisääNappulat();
    updateNappulat();
    updateKoirat();
    updateVaihtokauppa();
    seuraavaNappi.addEventListener('click', seuraavaVuoro);
    seuraavaNappi.disabled = false;
}

function määritäMuutettavaNappula(noppa) {
    nappulat = ['puput', 'lampaat', 'possut', 'lehmat', 'hevoset'];
    return nappulat[eläimet.indexOf(noppa)];
}

function lisääNappulat() {
    // ensin tarkistaa, oliko joukossa susi tai kettu, jos susi, ohjelma skippaa loput ja poistaa halutut asiat, jos koiraa ei ole. 
    // Jos kyseessä on kettu, ohjelma antaa pelaajalle nappulat ja vasta sitten poistaa puput, jos koiraa ei ole  
    if (aktiivinenPelaaja.koirat.isot > 0 || sininenNoppa != 'susi') {
        if (sininenNoppa === 'susi') {
            aktiivinenPelaaja.koirat.isot -= 1
            koiraElementit.isot.innerText = aktiivinenPelaaja.koirat.isot;
            if (oranssiNoppa != 'kettu') {
                aktiivinenPelaaja.nappulat[määritäMuutettavaNappula(oranssiNoppa)] += Math.floor((aktiivinenPelaaja.nappulat[määritäMuutettavaNappula(oranssiNoppa)] + 1) / 2);
            } else {
                kettu()
            }
            
        } else if (oranssiNoppa == sininenNoppa) {
            aktiivinenPelaaja.nappulat[määritäMuutettavaNappula(oranssiNoppa)] += Math.floor((aktiivinenPelaaja.nappulat[määritäMuutettavaNappula(oranssiNoppa)] + 2) / 2);
        } else if (oranssiNoppa === 'kettu') {
            aktiivinenPelaaja.nappulat[määritäMuutettavaNappula(sininenNoppa)] += Math.floor((aktiivinenPelaaja.nappulat[määritäMuutettavaNappula(sininenNoppa)] + 1) / 2);
            kettu();
        } else {
            aktiivinenPelaaja.nappulat[määritäMuutettavaNappula(oranssiNoppa)] += Math.floor((aktiivinenPelaaja.nappulat[määritäMuutettavaNappula(oranssiNoppa)] + 1) / 2);
            aktiivinenPelaaja.nappulat[määritäMuutettavaNappula(sininenNoppa)] += Math.floor((aktiivinenPelaaja.nappulat[määritäMuutettavaNappula(sininenNoppa)] + 1) / 2);
        }
        
    } else {
        susi();
    }
}

function kettu() {
    if (aktiivinenPelaaja.koirat.pienet > 0) {
        if (aktiivinenPelaaja.nappulat.puput > 0) {
            // pelaaja menettää pienen koiran vain jos pupuja on
            aktiivinenPelaaja.koirat.pienet -= 1;
            koiraElementit.pienet.innerText = aktiivinenPelaaja.koirat.pienet;
        }
        
    }
    else {
        aktiivinenPelaaja.nappulat.puput = 0;
    }
}

function susi() {
    // susi tulee eikä ole koiria, jolloin pelaajalle jää yksi pieni koira sekä mahdollinen hevonen
    if (aktiivinenPelaaja.koirat.pienet > 0) aktiivinenPelaaja.koirat.pienet = 1;
    if (aktiivinenPelaaja.nappulat.hevoset > 0) aktiivinenPelaaja.nappulat.hevoset = 1;

    const keys = Object.keys(aktiivinenPelaaja.nappulat);

    for (let key in aktiivinenPelaaja.nappulat) {
        if (key != keys[keys.length - 1]) {
            aktiivinenPelaaja.nappulat[key] = 0;
        }
    }
}

function valitseNoppa(väri) {
    for (let noppa of nopat) {
        if (noppa.tyyppi === väri) {
            return noppa;
        }
    }
}

// tulostaa pelaajan nappulat (debug)
function updateNappulat() {
    for (let nappula in aktiivinenPelaaja.nappulat) {
        eläinElementit[nappula].innerText = aktiivinenPelaaja.nappulat[nappula];
    }
}

function updateKoirat() {
    for (let koira in aktiivinenPelaaja.koirat) {
        koiraElementit[koira].innerText = aktiivinenPelaaja.koirat[koira];
    }
}

function updateVaihtokauppa() {
    if (aktiivinenPelaaja.nappulat.puput >= 6 || aktiivinenPelaaja.nappulat.lampaat > 0 || aktiivinenPelaaja.nappulat.possut > 0 || aktiivinenPelaaja.nappulat.lehmat > 0 || aktiivinenPelaaja.nappulat.hevoset > 0) {
        vaihdaNappi.disabled = false;
        vaihdaNappi.addEventListener('click', vaihda);
    } else {
        vaihdaNappi.disabled = true;
        vaihdaNappi.removeEventListener('click', vaihda);
    }
}

updateVaihtokuvakkeet() {
    // poistaa luokan "vaihtokuvake", joka lisää harmaan värityksen. Samalla myös lisää eventlistener ("click", trade)
}

function vaihda() {
    vaihtoSivu.style.display = 'block';
    document.querySelector('main').style.filter = "blur(5px)";
    vaihdaNappi.textContent = 'Sulje';
    vaihdaNappi.addEventListener('click', suljeVaihto);
    koiraContainer.style.display = 'none';
    updateVaihtokuvakkeet();
}

function suljeVaihto() {
    vaihtoSivu.style.display = 'none';
    document.querySelector('main').style.filter = "none";
    updateVaihtokauppa();
    vaihdaNappi.textContent = 'Vaihda';
    vaihdaNappi.removeEventListener('click', suljeVaihto);
    vaihdaNappi.addEventListener('click', vaihda);
    koiraContainer.style.display = 'block';
}

function updatePelaaja() {
    pelaajaNimiText.innerText = aktiivinenPelaaja.peliNimi;
}

function gameOver() {
    window.postMessage(aktiivinenPelaaja.peliNimi + "on voittanut pelin!");
}

// tarkistaa voittajan 
function tarkistaVoittaja() {
    for (let pelaaja of pelaajat) {
        for (let nappula in pelaaja.nappulat) {
            if (pelaaja.nappulat[nappula] === 0 ) return;
        }
        gameOver();
    }
}