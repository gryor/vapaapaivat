function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getWeekdaysOfYear(year, days) {
  const current = moment([year]);
  const end = moment([year]).endOf('year');
  const output = [];
  
  while(current.isSameOrBefore(end)) {
    if(days === undefined) {
       output.push(current.format('D.M.YYYY'));
    } else {
      if(days.includes(current.weekday()))
        output.push(current.format('D.M.YYYY'));
    } 
      
    
    current.add(1, 'day');
  }
  
  return output;
}

function getDutyDays(year) {
  moment.locale('fi');
  year = +year;
  const holidays = (new Vapaapaivat(year)).map_strings_reversed;
  //const weekends = getWeekdaysOfYear(year, [4,5,6]);
  const everyday = getWeekdaysOfYear(year);
  let output = [];
  
  holidays.forEach((value, key) => holidays.set(key, {dayOfWeek: capitalize(moment(key, 'D.M.YYYY').format('dddd')), description: value}));
  
  output = Array.from(holidays).map(e => [e[0], e[1].dayOfWeek, e[1].description]);

  //weekends.filter(e => !holidays.has(e)).forEach(e => output.push([e, capitalize(moment(e, 'D.M.YYYY').format('dddd'))]));
  everyday.filter(e => !holidays.has(e)).forEach(e => output.push([e, capitalize(moment(e, 'D.M.YYYY').format('dddd'))]));

  output.sort((a, b) => moment(a[0], 'D.M.YYYY').isBefore(moment(b[0], 'D.M.YYYY')) ? -1 : 1);

  console.log({year, output});
  return output;
}
               
class Paivamaara extends Date {
  toString() {
    return this.toLocaleDateString('fi-FI');
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
    m.set("Loppiaisaatto", this.loppiaisaatto);
    m.set("Loppiainen", this.loppiainen);
    m.set("Pitkäperjantain aatto", this.pitkaperjantainaatto);
    m.set("Pitkäperjantai", this.pitkaperjantai);
    m.set("Pääsiäispäivä", this.paasiaispaiva);
    m.set("2. pääsiäispäivä", this.toinen_paasiaispaiva);
    m.set("Vappuaatto", this.vappuaatto);
    m.set("Vappu", this.vappu);
    m.set("Helatorstain aatto", this.helatorstainaatto);
    m.set("Helatorstai", this.helatorstai);
    m.set("Helluntaipäivä", this.helluntaipaiva);
    m.set("Juhannusaaton aatto", this.juhannusaatonaatto);
    m.set("Juhannusaatto", this.juhannusaatto);
    m.set("Juhannuspäivä", this.juhannuspaiva);
    m.set("Pyhäinpäivä", this.pyhainpaiva);
    m.set("Itsenäisyyspäivän aatto", this.itsenaisyyspaivanaatto);
    m.set("Itsenäisyyspäivä", this.itsenaisyyspaiva);
    m.set("Jouluaaton aatto", this.jouluaatonaatto);
    m.set("Jouluaatto", this.jouluaatto);
    m.set("Joulupäivä", this.joulupaiva);
    m.set("2. joulupäivä", this.toinen_joulupaiva);
    m.set("Uudenvuodenaatto", this.uudenvuodenaatto);

    return m;
  }

  get map_strings() {
    const m = this.map;
    const n = new Map();

    for(const [key, value] of m)
      n.set(key, value.toString());

    return n;
  }

  get map_reversed() {
    const m = this.map;
    const n = new Map();

    for(const [key, value] of m)
      n.set(value, key);

    return n;
  }

  get map_strings_reversed() {
    const m = this.map_strings;
    const n = new Map();

    for(const [key, value] of m)
      n.set(value, key);

    return n;
  }

  get uudenvuodenpaiva() {
    return new Paivamaara(this.year, 0, 1);
  }

  get loppiaisaatto() {
    return this.loppiainen.edellinen_paiva;
  }

  get loppiainen() {
    return new Paivamaara(this.year, 0, 6);
  }

  get pitkaperjantainaatto() {
    return this.pitkaperjantai.edellinen_paiva;
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

  get vappuaatto() {
    return this.vappu.edellinen_paiva;
  }

  get vappu() {
    return new Paivamaara(this.year, 4, 1);
  }

  get helatorstainaatto() {
    return this.helatorstai.edellinen_paiva;
  }

  get helatorstai() {
    return this.paasiaispaiva.lisaa_paivia(39);
  }

  get helluntaipaiva() {
    return this.paasiaispaiva.lisaa_paivia(49);
  }

  get juhannusaatonaatto() {
    return this.juhannusaatto.edellinen_paiva;
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

  get itsenaisyyspaivanaatto() {
    return this.itsenaisyyspaiva.edellinen_paiva;
  }

  get itsenaisyyspaiva() {
    return new Paivamaara(this.year, 11, 6);
  }

  get jouluaatonaatto() {
    return this.jouluaatto.edellinen_paiva;
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

  get uudenvuodenaatto() {
    return new Paivamaara(this.year, 11, 31);
  }
}
