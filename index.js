class Paivamaara extends Date {
  toString() {
    return this.toLocaleDateString();
  }

  edellinen_viikonpaiva(viikonpaiva) {
    const nykyinen = new Paivamaara(this);
    const nykyinen_viikonpaiva = nykyinen.getDay();

    return new Paivamaara(nykyinen.setDate(nykyinen.getDate() + (viikonpaiva + nykyinen_viikonpaiva - 7)));
  }

  seuraava_viikonpaiva(viikonpaiva) {
    const nykyinen = new Paivamaara(this);
    const nykyinen_viikonpaiva = nykyinen.getDay();

    return new Paivamaara(nykyinen.setDate(nykyinen.getDate() + (viikonpaiva - nykyinen_viikonpaiva)));
  }

  lisaa_paivia(lukumaara) {
    const nykyinen = new Paivamaara(this);
    return new Paivamaara(nykyinen.setDate(nykyinen.getDate() + lukumaara));
  }

  get edellinen_paiva() {
    const nykyinen = new Paivamaara(this);
    return new Paivamaara(nykyinen.setDate(nykyinen.getDate() - 1));
  }

  get seuraava_paiva() {
    const nykyinen = new Paivamaara(this);
    return new Paivamaara(nykyinen.setDate(nykyinen.getDate() + 1));
  }
}

class Vapaapaivat {
  constructor(year = (new Date()).getFullYear()){
    this.year = year;
    
  }

  debug() {
    console.log(this.year);
    console.log(...this.map);
  }

  get map() {
    const m = new Map();

    m.set("Uudenvuodenpäivä", this.uudenvuodenpaiva);
    m.set("Loppiainen", this.loppiainen);
    m.set("Pitkäperjantai", this.pitkaperjantai);
    m.set("Pääsiäispäivä", this.paasiaispaiva);
    m.set("2. pääsiäispäivä", this.toinen_paasiaispaiva);
    m.set("Vappu", this.vappu);
    m.set("Helatorstai", this.helatorstai);
    m.set("Helluntaipäivä", this.helluntaipaiva);
    m.set("Juhannusaatto", this.juhannusaatto);
    m.set("Juhannuspäivä", this.juhannuspaiva);
    m.set("Pyhäinpäivä", this.pyhainpaiva);
    m.set("Itsenäisyyspäivä", this.itsenaisyyspaiva);
    m.set("Jouluaatto", this.jouluaatto);
    m.set("Joulupäivä", this.joulupaiva);
    m.set("2. joulupäivä", this.toinen_joulupaiva);

    return m;
  }

  get map_reversed() {
    const m = this.map;
    const n = new Map();

    for(const [key, value] of m)
      n.set(value, key);

    return n;
  }

  get uudenvuodenpaiva() {
    return new Paivamaara(this.year, 0, 1);
  }

  get loppiainen() {
    return new Paivamaara(this.year, 0, 6);
  }

  get pitkaperjantai() {
    return this.paasiaispaiva.edellinen_viikonpaiva(5);
  }

  get paasiaispaiva() {
    const y = Math.floor(this.year);
    const c = Math.floor(y / 100);
    const n = y - 19 * Math.floor(y / 19);
    const k = Math.floor((c - 17) / 25);
    let i = c - Math.floor(c / 4) - Math.floor((c - k) / 3) + 19 * n + 15;
    i = i - 30 * Math.floor(i / 30);
    i = i - Math.floor(i / 28) * (1 - Math.floor(i / 28) * Math.floor(29 / (i + 1)) * Math.floor((21 - n) / 11));
    let j = y + Math.floor(y / 4) + i + 2 - c + Math.floor(c / 4);
    j = j - 7 * Math.floor(j / 7);
    const l = i - j;
    const m = 3 + Math.floor((l + 40) / 44);
    const d = l + 28 - 31 * Math.floor(m / 4);
    const z = new Paivamaara();

    z.setFullYear(y, m - 1, d);

    return z;
  }

  get toinen_paasiaispaiva() {
    return this.paasiaispaiva.seuraava_viikonpaiva(1);
  }

  get vappu() {
    return new Paivamaara(this.year, 4, 1);
  }

  get helatorstai() {
    return this.paasiaispaiva.lisaa_paivia(39);
  }

  get helluntaipaiva() {
    return this.paasiaispaiva.lisaa_paivia(49);
  }

  get juhannusaatto() {
    return this.juhannuspaiva.edellinen_paiva;
  }

  get juhannuspaiva() {
    return (new Paivamaara(this.year, 5, 20)).seuraava_viikonpaiva(6);
  }

  get pyhainpaiva() {
    return (new Paivamaara(this.year, 9, 31)).seuraava_viikonpaiva(6);
  }

  get itsenaisyyspaiva() {
    return new Paivamaara(this.year, 11, 6);
  }

  get jouluaatto() {
    return this.joulupaiva.edellinen_paiva;
  }

  get joulupaiva() {
    return new Paivamaara(this.year, 11, 25);
  }

  get toinen_joulupaiva() {
    return new Paivamaara(this.year, 11, 26);
  }
}
