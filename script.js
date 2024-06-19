const vaihdaNappi = document.getElementById('vaihdanappi');
const heitaNappi = document.getElementById('heitanappi');
const seuraavaNappi = document.getElementById('seuraavanappi');
const pelaajaNimiText = document.getElementById('pelaajaNimi');
const oranssiNoppaText = document.getElementById('oranssiNoppa');
const sininenNoppaText = document.getElementById('sininenNoppa');
const vaihtoSivu = document.getElementById('vaihtokauppaContainer');
const koiraContainer = document.querySelector('.koirat');
const rajat = [6,2,3,2,1,1];
let oranssiNoppa;   
let sininenNoppa;
let vuoro = 0;

const eläinTekstiElementit = {
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

const vaihdettavaKuvaElementit = {
    pupuVaihdettava: document.getElementById('pupuVaihdettava'),
    lammasVaihdettava: document.getElementById('lammasVaihdettava'),
    possuVaihdettava: document.getElementById('possuVaihdettava'),
    lehmaVaihdettava: document.getElementById('lehmaVaihdettava'),
    lammasVaihdettavaK: document.getElementById('lammasVaihdettavaK'),
    lehmaVaihdettavaK: document.getElementById('lehmaVaihdettavaK'),
}

const tuoteKuvaElementit = {
    lammasTuote: document.getElementById('lammasTuote'),
    possuTuote: document.getElementById('possuTuote'),
    lehmaTuote: document.getElementById('lehmaTuote'),
    hevonenTuote: document.getElementById('hevonenTuote'),
    pieniKoira: document.getElementById('pieniKoira'),
    isoKoira: document.getElementById('isoKoira'),
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
    heitaNappi.addEventListener('click', heitäNoppa);
}

function seuraavaVuoro() {
    seuraavaNappi.removeEventListener('click', seuraavaVuoro);
    seuraavaNappi.disabled = true;
    heitaNappi.disabled = false;
    oranssiNoppaText.innerText = '';
    sininenNoppaText.innerText = '';
    tarkistaVoittaja();
    vuoro = (vuoro + 1) % pelaajat.length;
    suljeVaihto();
    aloitaPeli();
    vaihdaNappi.disabled = true;
    vaihdaNappi.removeEventListener('click', vaihda);
}

    
function määritäPelaajat() {
    const pelaajaLKM = Number(prompt("Syötä pelaajamäärä: "));
    for (let i = 0; i < pelaajaLKM; i++) {
        let pelaaja = {
            peliNimi: prompt(`Syötä pelaajan ${i+1} pelaajanimi: `),
            nappulat: {
                puput: 1,
                lampaat: 0,
                possut: 0,
                lehmat: 0,
                hevoset: 0
            },
            koirat: {
                pienet: 0,
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
    updateVaihtoNappi();
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
        eläinTekstiElementit[nappula].innerText = aktiivinenPelaaja.nappulat[nappula];
    }
}

function updateKoirat() {
    for (let koira in aktiivinenPelaaja.koirat) {
        koiraElementit[koira].innerText = aktiivinenPelaaja.koirat[koira];
    }
}

function updateVaihtoNappi() {
    // tuoteKuvaElementit.lammasTuote.classList.remove('disabled');
    if (aktiivinenPelaaja.nappulat.puput >= 6 || aktiivinenPelaaja.nappulat.lampaat > 0 || aktiivinenPelaaja.nappulat.possut > 0 || aktiivinenPelaaja.nappulat.lehmat > 0 || aktiivinenPelaaja.nappulat.hevoset > 0 || aktiivinenPelaaja.koirat.pienet > 0 || aktiivinenPelaaja.koirat.isot > 0) {
        vaihdaNappi.disabled = false;
        vaihdaNappi.addEventListener('click', vaihda);
    } else {
        vaihdaNappi.disabled = true;
        vaihdaNappi.removeEventListener('click', vaihda);
    }
}

// poistaa luokan "vaihtokuvake", joka lisää harmaan värityksen. Samalla myös lisää eventlistener ("click", trade)
function updateVaihtokuvakkeet() {
    // tarkastellaan aluksi nappulat, jotka saadaan vaihtamalla useampi. 
    let vaihdettavat = ['puput', 'lampaat', 'possut', 'lehmat', 'lampaat', 'lehmat'];
    const tuoteFunktiot = [pupuLampaaksi, lammasPossuksi, possuLehmaksi, lehmaHevoseksi, lammasKoiraksi, lehmaKoiraksi]
    let tuoteKuvaLista = Object.keys(tuoteKuvaElementit); 
    let indeksi;
    for (let indeksi in vaihdettavat) {
        vaihdettava = vaihdettavat[indeksi];
        if (aktiivinenPelaaja.nappulat[vaihdettava] >= rajat[indeksi]) {
            tuoteKuvaElementit[tuoteKuvaLista[indeksi]].classList.remove('disabled');
            tuoteKuvaElementit[tuoteKuvaLista[indeksi]].addEventListener('click', tuoteFunktiot[indeksi]);
        }  else {
            tuoteKuvaElementit[tuoteKuvaLista[indeksi]].classList.add('disabled');
            tuoteKuvaElementit[tuoteKuvaLista[indeksi]].removeEventListener('click', tuoteFunktiot[indeksi]);
        }
    }

    // tarkastellaan nappulat, jotka saadaan vaihtamalla yksi
    let tuotteet = ['lampaat', 'possut', 'lehmat', 'hevoset', 'pienet', 'isot'];
    let vaihdettavaKuvaLista = Object.keys(vaihdettavaKuvaElementit);
    const vaihdettavaFunktiot = [lammasPupuksi, possuLampaaksi, lehmaPossuksi, hevonenLehmaksi, koiraLampaaksi, koiraLehmaksi];

    for (let indeksi in tuotteet) {
        if (aktiivinenPelaaja.nappulat[tuotteet[indeksi]] > 0 || aktiivinenPelaaja.koirat[tuotteet[indeksi]] > 0) {
            vaihdettavaKuvaElementit[vaihdettavaKuvaLista[indeksi]].classList.remove('disabled');
            vaihdettavaKuvaElementit[vaihdettavaKuvaLista[indeksi]].addEventListener('click', vaihdettavaFunktiot[indeksi]);
        } else {
            vaihdettavaKuvaElementit[vaihdettavaKuvaLista[indeksi]].classList.add('disabled');
            vaihdettavaKuvaElementit[vaihdettavaKuvaLista[indeksi]].removeEventListener('click', vaihdettavaFunktiot[indeksi]);
        }
       }
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
    vaihdaNappi.textContent = 'Vaihda';
    vaihdaNappi.removeEventListener('click', suljeVaihto);
    vaihdaNappi.addEventListener('click', vaihda);
    koiraContainer.style.display = 'block';
}

function updatePelaaja() {
    pelaajaNimiText.innerText = aktiivinenPelaaja.peliNimi;
}

// [pupuLampaaksi, lammasPossuksi, possuLehmaksi, lehmaHevoseksi, lammasKoiraksi, lehmaKoiraksi]

function pupuLampaaksi() {
    if (aktiivinenPelaaja.nappulat.puput >= rajat[0]) {
        aktiivinenPelaaja.nappulat.puput -= rajat[0];
        aktiivinenPelaaja.nappulat.lampaat += 1;
        updateNappulat();
        updateVaihtokuvakkeet();
    }
}
function lammasPossuksi() {
    if (aktiivinenPelaaja.nappulat.lampaat >= rajat[1]) {
        aktiivinenPelaaja.nappulat.lampaat -= rajat[1];
        aktiivinenPelaaja.nappulat.possut += 1;
        updateNappulat();
        updateVaihtokuvakkeet();
    }
}
function possuLehmaksi() {
    if (aktiivinenPelaaja.nappulat.possut >= rajat[2]) {
        aktiivinenPelaaja.nappulat.possut -= rajat[2];
        aktiivinenPelaaja.nappulat.lehmat += 1;
        updateNappulat();
        updateVaihtokuvakkeet();
    }
}
function lehmaHevoseksi() {
    if (aktiivinenPelaaja.nappulat.lehmat >= rajat[3]) {
        aktiivinenPelaaja.nappulat.lehmat -= rajat[3];
        aktiivinenPelaaja.nappulat.hevoset += 1;
        updateNappulat();
        updateVaihtokuvakkeet();
    }
}
function lammasKoiraksi() {
    if (aktiivinenPelaaja.nappulat.lampaat >= rajat[4]) {
        aktiivinenPelaaja.nappulat.lampaat -= rajat[4];
        aktiivinenPelaaja.koirat.pienet += 1;
        updateNappulat();
        updateKoirat();
        updateVaihtokuvakkeet();
    }
}
function lehmaKoiraksi() {
    if (aktiivinenPelaaja.nappulat.lehmat >= rajat[5]) {
        aktiivinenPelaaja.nappulat.lehmat -= rajat[5];
        aktiivinenPelaaja.koirat.isot += 1;
        updateNappulat();
        updateKoirat();
        updateVaihtokuvakkeet();
    }
}

// [lammasPupuksi, possuLampaaksi, lehmaPossuksi, hevonenLehmaksi, koiraLampaaksi, koiraLehmaksi]

function lammasPupuksi() {
    if (aktiivinenPelaaja.nappulat.lampaat > 0) {
        aktiivinenPelaaja.nappulat.lampaat -= 1;
        aktiivinenPelaaja.nappulat.puput += rajat[0];
        updateNappulat();
        updateVaihtokuvakkeet();
    }
}
function possuLampaaksi() {
    if (aktiivinenPelaaja.nappulat.possut > 0) {
        aktiivinenPelaaja.nappulat.possut -= 1;
        aktiivinenPelaaja.nappulat.lampaat += rajat[1];
        updateNappulat();
        updateVaihtokuvakkeet();
    }
}
function lehmaPossuksi() {
    if (aktiivinenPelaaja.nappulat.lehmat > 0) {
        aktiivinenPelaaja.nappulat.lehmat -= 1;
        aktiivinenPelaaja.nappulat.possut += rajat[2];
        updateNappulat();
        updateVaihtokuvakkeet();
    }
}
function hevonenLehmaksi() {
    if (aktiivinenPelaaja.nappulat.hevoset > 0) {
        aktiivinenPelaaja.nappulat.hevoset -= 1;
        aktiivinenPelaaja.nappulat.lehmat += rajat[3];
        updateNappulat();
        updateVaihtokuvakkeet();
    }
}
function koiraLampaaksi() {
    if (aktiivinenPelaaja.koirat.pienet > 0) {
        aktiivinenPelaaja.koirat.pienet -= 1;
        aktiivinenPelaaja.nappulat.lampaat += rajat[4];
        updateNappulat();
        updateKoirat();
        updateVaihtokuvakkeet();
    }
}
function koiraLehmaksi() {
    if (aktiivinenPelaaja.koirat.isot > 0) {
        aktiivinenPelaaja.koirat.isot -= 1;
        aktiivinenPelaaja.nappulat.lehmat += rajat[5];
        updateNappulat();
        updateKoirat();
        updateVaihtokuvakkeet();
    }
}


function gameOver() {
    console.log(aktiivinenPelaaja.peliNimi + " on voittanut pelin!");
    window.alert(aktiivinenPelaaja.peliNimi + " on voittanut pelin!");
    määritäPelaajat();
    aloitaPeli();
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