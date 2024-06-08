let prompt = require(`prompt-sync`)({sigint: true});
// const pupuText = document.getElementById('pupuLKM');
// const lammasText = document.getElementById('lammasLKM');
// const possuText = document.getElementById('possuLKM');
// const lehmaText = document.getElementById('lehmaLKM');
// const hevonenText = document.getElementById('hevonenLKM');

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
                pienet: 0,
                isot: 0
            }
        }
        pelaajat.push(pelaaja)
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

function määritäMuutettavaNappula(noppa) {
    nappulat = ['puput', 'lampaat', 'possut', 'lehmat', 'hevoset'];
    return nappulat[eläimet.indexOf(noppa)];
}

function lisääNappulat() {
    // ensin tarkistaa, oliko joukossa susi tai kettu, jos susi, ohjelma skippaa loput ja poistaa halutut asiat, jos koiraa ei ole. 
    // Jos kyseessä on kettu, ohjelma antaa pelaajalle nappulat ja vasta sitten poistaa puput, jos koiraa ei ole  
    if (aktiivinenPelaaja.koirat.isot > 0 || sininenNoppa != 'susi') {
        if (sininenNoppa === 'susi') aktiivinenPelaaja.koirat.isot -= 1
        if (oranssiNoppa == sininenNoppa) {
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
    if (aktiivinenPelaaja.koirat.pienet > 0) aktiivinenPelaaja.koirat.pienet -= 1;
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
function tulostaNappulat(nappulat) {
    console.log(nappulat);
}

// tarkistaa voittajan 
function tarkistaVoittaja() {
    for (let pelaaja of pelaajat) {
        for (let nappula in pelaaja.nappulat) {
            if (pelaaja.nappulat[nappula] === 0 ) return;
        }
        console.log(`Pelaaja ${pelaaja.peliNimi} on voittanut!`);
        return true;
    }
}

// pelin varsinainen looppi

määritäPelaajat();
let oranssiNoppa;
let sininenNoppa;

while (!tarkistaVoittaja()) {
    for (let vuoro in pelaajat){
        // päivitä nappulatilanne
        aktiivinenPelaaja = pelaajat[vuoro];
        console.log(`Pelaajan ${aktiivinenPelaaja.peliNimi} vuoro!`)
        oranssiNoppa = pisteytäNoppa("oranssi");
        console.log("Heitit " + oranssiNoppa);
        sininenNoppa = pisteytäNoppa("sininen");
        console.log("Heitit " + sininenNoppa);  
        lisääNappulat();
        tulostaNappulat(aktiivinenPelaaja); // päivitä nappulat nettisivulle
        // vaihtokauppa 
        updateVaihtokauppa();
        // päivitä nappulatilanne ja kysy haluaako pelaaja vaihtaa vuoroa
    }
}