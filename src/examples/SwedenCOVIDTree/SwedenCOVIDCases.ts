// Statistikdatum	Totalt_antal_fall	Blekinge	Dalarna	Gotland	Gävleborg	Halland	Jämtland_Härjedalen	Jönköping	Kalmar	Kronoberg	Norrbotten	Skåne	Stockholm	Sörmland	Uppsala	Värmland	Västerbotten	Västernorrland	Västmanland	Västra_Götaland	Örebro	Östergötland
const rawSwedenData = `2020-02-04	1	0	0	0	0	0	0	1	0	0	0	0	0	0	0	0	0	0	0	0	0	0
2020-02-05	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
2020-02-06	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
2020-02-07	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
2020-02-08	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
2020-02-09	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
2020-02-10	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
2020-02-11	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
2020-02-12	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
2020-02-13	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
2020-02-14	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
2020-02-15	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
2020-02-16	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
2020-02-17	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
2020-02-18	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
2020-02-19	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
2020-02-20	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
2020-02-21	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
2020-02-22	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
2020-02-23	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
2020-02-24	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
2020-02-25	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
2020-02-26	1	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	1	0	0
2020-02-27	1	0	0	0	0	0	0	0	0	0	0	0	1	0	0	0	0	0	0	0	0	0
2020-02-28	8	0	0	0	0	0	0	1	0	0	0	0	2	0	2	0	0	0	0	3	0	0
2020-02-29	3	0	0	0	0	0	0	0	0	0	0	0	1	0	0	0	0	0	0	2	0	0
2020-03-01	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
2020-03-02	5	0	0	0	0	0	0	0	0	0	0	1	1	0	0	0	0	0	0	3	0	0
2020-03-03	13	0	0	0	0	0	0	0	0	0	0	1	10	0	0	0	0	0	0	2	0	0
2020-03-04	30	0	0	0	0	0	0	0	0	0	0	7	21	0	0	0	0	0	0	1	1	0
2020-03-05	25	0	0	0	0	0	0	0	0	0	0	0	22	0	2	0	0	0	0	1	0	0
2020-03-06	59	0	0	0	2	0	0	0	0	0	0	8	36	0	1	11	0	0	0	1	0	0
2020-03-07	33	0	0	0	0	0	0	0	0	0	0	5	21	0	1	0	0	0	0	5	1	0
2020-03-08	46	0	0	0	0	1	0	2	0	0	0	0	29	0	1	0	0	0	0	11	2	0
2020-03-09	101	0	0	0	0	4	0	6	0	0	1	3	64	1	0	7	0	0	0	15	0	0
2020-03-10	98	1	0	0	0	1	0	0	1	1	0	34	26	0	4	3	8	6	0	13	0	0
2020-03-11	196	6	1	2	1	16	3	16	2	7	4	37	32	6	4	2	0	0	0	57	0	0
2020-03-12	151	2	3	0	2	9	5	7	2	2	0	32	42	3	11	4	1	3	0	19	3	1
2020-03-13	152	0	1	0	1	9	3	4	0	3	1	42	31	6	10	3	0	2	5	19	2	10
2020-03-14	71	0	0	0	1	0	3	0	2	1	0	25	18	1	4	1	3	0	0	5	0	7
2020-03-15	69	1	0	0	0	2	7	4	0	1	0	4	17	4	0	1	1	0	0	18	0	9
2020-03-16	83	0	0	0	2	1	1	2	0	0	0	3	34	12	2	2	2	1	7	6	0	8
2020-03-17	119	1	3	1	4	3	0	1	0	1	1	6	35	5	5	1	3	1	6	13	16	13
2020-03-18	145	1	2	1	2	2	4	2	1	1	0	8	58	0	17	1	3	1	0	10	3	28
2020-03-19	143	0	2	1	0	2	1	2	1	1	1	2	66	5	5	0	2	0	1	14	9	28
2020-03-20	180	0	5	0	5	5	3	3	1	0	5	5	84	4	1	2	5	0	2	23	5	22
2020-03-21	134	0	0	0	4	3	14	4	1	0	3	5	71	6	2	1	0	0	0	8	0	12
2020-03-22	117	0	5	0	0	1	9	1	1	0	3	3	59	11	5	1	1	0	0	4	0	13
2020-03-23	182	0	9	0	3	4	0	2	3	0	5	7	99	2	8	2	0	2	3	9	6	18
2020-03-24	230	0	9	0	5	0	4	5	1	2	6	5	105	14	11	3	3	2	4	10	11	30
2020-03-25	314	3	13	1	7	7	2	7	2	1	5	13	154	37	15	0	4	2	3	19	8	11
2020-03-26	286	0	8	4	5	9	7	9	6	2	3	7	132	16	12	0	3	3	5	20	6	29
2020-03-27	366	2	15	1	9	3	3	15	5	4	4	10	176	26	20	1	2	2	11	18	6	33
2020-03-28	300	0	6	0	12	6	8	9	1	2	4	2	147	8	7	3	5	2	3	25	8	42
2020-03-29	281	4	10	0	11	2	2	8	1	4	2	3	150	4	11	1	1	9	0	15	3	40
2020-03-30	415	0	9	0	10	5	2	15	3	1	5	5	171	60	21	1	7	6	23	27	17	27
2020-03-31	475	1	23	1	14	7	1	17	2	5	6	7	209	49	15	0	8	13	10	29	11	47
2020-04-01	486	5	19	0	30	4	0	13	5	1	5	8	206	49	24	2	5	2	11	29	5	63
2020-04-02	555	3	6	0	17	9	4	32	5	7	8	8	218	34	28	0	12	1	18	47	28	70
2020-04-03	602	1	20	2	16	12	2	29	2	2	6	24	246	59	38	1	17	3	27	48	20	27
2020-04-04	357	4	18	0	12	2	2	15	1	2	3	12	129	17	11	1	17	6	14	30	3	58
2020-04-05	341	1	7	0	7	3	0	12	3	2	2	6	172	27	9	1	9	2	7	30	0	41
2020-04-06	390	0	16	0	12	10	5	10	5	3	10	7	131	17	31	2	5	4	18	53	12	39
2020-04-07	738	1	28	0	16	13	5	23	4	14	17	24	243	42	37	7	14	10	46	64	73	57
2020-04-08	656	2	28	1	17	9	8	19	2	7	12	15	271	33	29	1	12	5	23	68	37	57
2020-04-09	644	1	30	1	18	12	8	21	1	5	5	11	240	38	29	4	12	4	24	116	10	54
2020-04-10	455	1	17	0	18	4	8	19	1	4	6	24	148	41	4	3	15	8	27	69	7	31
2020-04-11	394	0	9	0	10	2	2	5	3	10	2	6	200	22	15	2	2	0	33	32	13	26
2020-04-12	463	1	31	0	17	3	6	9	2	4	2	14	182	14	13	4	0	5	18	41	75	22
2020-04-13	437	0	12	0	11	3	6	5	6	3	17	9	200	20	13	3	5	6	18	48	21	31
2020-04-14	480	1	12	0	11	6	14	12	5	6	4	12	180	16	39	2	5	5	12	63	52	23
2020-04-15	604	0	28	2	17	6	15	28	2	12	3	19	215	42	32	3	14	5	30	70	30	31
2020-04-16	623	0	25	1	21	15	12	23	4	10	13	17	221	47	37	7	3	3	31	84	30	19
2020-04-17	688	0	26	0	24	9	19	36	5	12	15	21	221	64	44	3	19	5	27	77	32	29
2020-04-18	531	0	27	0	29	7	9	35	2	21	1	17	179	8	18	3	3	2	18	48	52	52
2020-04-19	389	0	8	0	8	6	6	15	4	11	2	5	192	13	18	4	7	8	29	31	6	16
2020-04-20	462	1	10	1	4	10	1	8	6	9	8	9	211	14	32	7	4	2	28	50	23	24
2020-04-21	194	0	0	0	12	0	0	10	4	0	1	2	60	1	3	0	2	0	31	33	16	19`;

const rawSwedenCOVIDCases: { [date: string]: string } = {
  "2020-04-22": `Blekinge: 44 sjukdomsfall

27.6 sjukdomsfall per 100 000 invånare
Avlidna: 2

Dalarna: 501 sjukdomsfall

174 sjukdomsfall per 100 000 invånare
Avlidna: 65

Gotland: 20 sjukdomsfall

33.5 sjukdomsfall per 100 000 invånare
Avlidna: 1

Gävleborg: 427 sjukdomsfall

148.6 sjukdomsfall per 100 000 invånare
Avlidna: 40

Halland: 247 sjukdomsfall

74 sjukdomsfall per 100 000 invånare
Avlidna: 24

Jämtland Härjedalen: 214 sjukdomsfall

163.6 sjukdomsfall per 100 000 invånare
Avlidna: 1

Jönköping: 522 sjukdomsfall

143.6 sjukdomsfall per 100 000 invånare
Avlidna: 41

Kalmar: 108 sjukdomsfall

44 sjukdomsfall per 100 000 invånare
Avlidna: 6

Kronoberg: 184 sjukdomsfall

91.3 sjukdomsfall per 100 000 invånare
Avlidna: 11

Norrbotten: 201 sjukdomsfall

80.4 sjukdomsfall per 100 000 invånare
Avlidna: 23

Skåne: 560 sjukdomsfall

40.6 sjukdomsfall per 100 000 invånare
Avlidna: 56

Stockholm: 6,189 sjukdomsfall

260.4 sjukdomsfall per 100 000 invånare
Avlidna: 1,022

Sörmland: 898 sjukdomsfall

301.8 sjukdomsfall per 100 000 invånare
Avlidna: 136

Uppsala: 701 sjukdomsfall

182.7 sjukdomsfall per 100 000 invånare
Avlidna: 64

Värmland: 111 sjukdomsfall

39.3 sjukdomsfall per 100 000 invånare
Avlidna: 4

Västerbotten: 244 sjukdomsfall

89.8 sjukdomsfall per 100 000 invånare
Avlidna: 11

Västernorrland: 141 sjukdomsfall

57.5 sjukdomsfall per 100 000 invånare
Avlidna: 21

Västmanland: 573 sjukdomsfall

207.7 sjukdomsfall per 100 000 invånare
Avlidna: 36

Västra Götaland: 1,557 sjukdomsfall

90.2 sjukdomsfall per 100 000 invånare
Avlidna: 103

Örebro: 663 sjukdomsfall

217.5 sjukdomsfall per 100 000 invånare
Avlidna: 34

Östergötland: 1,217 sjukdomsfall

261.4 sjukdomsfall per 100 000 invånare
Avlidna: 64
`
};

export class DayCases extends Map<string, { cases: number; deaths: number }> {}

export const SwedenRegions = new Map<string, number>();
function parse() {
  const dates = new Map<string, DayCases>();
  let latestMap = new DayCases();
  const accum = (
    caseMap: DayCases,
    latestMap: DayCases,
    name: string,
    value: string
  ) => {
    caseMap.set(name, {
      cases: parseInt(value) + (latestMap.get(name) ?? { cases: 0 }).cases,
      deaths: 0
    });
  };
  rawSwedenData.split("\n").forEach(line => {
    const [
      Statistikdatum,
      Totalt_antal_fall,
      Blekinge,
      Dalarna,
      Gotland,
      Gävleborg,
      Halland,
      Jämtland_Härjedalen,
      Jönköping,
      Kalmar,
      Kronoberg,
      Norrbotten,
      Skåne,
      Stockholm,
      Sörmland,
      Uppsala,
      Värmland,
      Västerbotten,
      Västernorrland,
      Västmanland,
      Västra_Götaland,
      Örebro,
      Östergötland
    ] = line.split("\t");
    const caseMap = new Map<string, { cases: number; deaths: number }>();
    accum(caseMap, latestMap, "Blekinge", Blekinge);
    accum(caseMap, latestMap, "Dalarna", Dalarna);
    accum(caseMap, latestMap, "Gotland", Gotland);
    accum(caseMap, latestMap, "Gävleborg", Gävleborg);
    accum(caseMap, latestMap, "Halland", Halland);
    accum(caseMap, latestMap, "Jämtland Härjedalen", Jämtland_Härjedalen);
    accum(caseMap, latestMap, "Jönköping", Jönköping);
    accum(caseMap, latestMap, "Kalmar", Kalmar);
    accum(caseMap, latestMap, "Kronoberg", Kronoberg);
    accum(caseMap, latestMap, "Norrbotten", Norrbotten);
    accum(caseMap, latestMap, "Skåne", Skåne);
    accum(caseMap, latestMap, "Stockholm", Stockholm);
    accum(caseMap, latestMap, "Sörmland", Sörmland);
    accum(caseMap, latestMap, "Uppsala", Uppsala);
    accum(caseMap, latestMap, "Värmland", Värmland);
    accum(caseMap, latestMap, "Västerbotten", Västerbotten);
    accum(caseMap, latestMap, "Västernorrland", Västernorrland);
    accum(caseMap, latestMap, "Västmanland", Västmanland);
    accum(caseMap, latestMap, "Västra Götaland", Västra_Götaland);
    accum(caseMap, latestMap, "Örebro", Örebro);
    accum(caseMap, latestMap, "Östergötland", Östergötland);
    dates.set(Statistikdatum, caseMap);
    latestMap = caseMap;
  });
  return dates;
}
function parseCases(cases: string): DayCases {
  const caseMap = new DayCases();
  const lines = cases.split("\n");
  let name = undefined;
  let sjukdomsfall = 0;
  let sjukdomsfallPerHundraTusen = undefined;
  let avlidna = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length === 0) continue;
    if (name === undefined) {
      const nameMatch = line.match(/^([^:]+): ([0-9,]+)/);
      if (nameMatch) {
        name = nameMatch[1];
        sjukdomsfall = parseInt(nameMatch[2].replace(/,/g, ""));
      }
    } else if (sjukdomsfallPerHundraTusen === undefined) {
      const ratioMatch = line.match(/^[0-9\.]+/);
      if (ratioMatch) {
        sjukdomsfallPerHundraTusen = parseFloat(ratioMatch[0]);
      }
    } else {
      const avlidnaMatch = line.match(/[0-9,]+/);
      if (avlidnaMatch) {
        avlidna = parseInt(avlidnaMatch[0].replace(/,/g, ""));
        caseMap.set(name, { cases: sjukdomsfall, deaths: avlidna });
        SwedenRegions.set(
          name,
          Math.floor(1e5 * (sjukdomsfall / sjukdomsfallPerHundraTusen))
        );
        name = undefined;
        sjukdomsfallPerHundraTusen = undefined;
      }
    }
  }
  return caseMap;
}

export const SwedenCOVIDCases = parse();

// Fill in SwedenRegions population and more detailed data
for (let date in rawSwedenCOVIDCases) {
  SwedenCOVIDCases.set(date, parseCases(rawSwedenCOVIDCases[date]));
}
