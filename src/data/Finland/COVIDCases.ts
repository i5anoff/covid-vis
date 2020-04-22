// OBJECTID	sairaanhoitopiiri	date	tapauksia	ID	tapauksia_yhteensa	Shape__Area	Shape__Length	koodi	Vaesto	Ilmaantuvuus	testimaara_yhteensa	testimaara_suhde	tapauksia_suhde_testimaara
const rawCOVIDCases: { [date: string]: string } = {
  "2020-04-22": `1	Etelä-Pohjanmaa	2020-04-22T09:00:00.000Z			36	14352748066	716250.0253	445225	193207	18.63286527	905	468.4095297	3.977900552
2	Pohjois-Pohjanmaa	2020-04-22T09:00:00.000Z			115	38564938908	1669791.737	444996	410112	28.04112047	4414	1076.291355	2.605346624
4	Päijät-Häme	2020-04-22T09:00:00.000Z			66	7282114179	564519.8039	445014	210057	31.42004313	1797	855.4820834	3.67278798
5	HUS	2020-04-22T09:00:00.000Z			2723	8879177262	1736557.495	445193	1685983	161.5081528	32725	1941.00415	8.320855615
7	Ahvenanmaa	2020-04-22T09:00:00.000Z			10	1257213008	1208028.111	445131	29884	33.46272253	357	1194.619194	2.801120448
9	Itä-Savo	2020-04-22T09:00:00.000Z			10	5709208917	442852.5915	445175	40258	24.8397834	259	643.35039	3.861003861
10	Lappi	2020-04-22T09:00:00.000Z			68	91678883954	2126877.757	445224	116866	58.18629884	1984	1697.670837	3.427419355
12	Satakunta	2020-04-22T09:00:00.000Z			48	8189132603	802641.0427	445170	216752	22.14512438	1300	599.7637853	3.692307692
16	Kanta-Häme	2020-04-22T09:00:00.000Z			70	5701797574	490857.315	445206	170925	40.95363464	1162	679.8303349	6.024096386
22	Keski-Pohjanmaa	2020-04-22T09:00:00.000Z			13	6427155037	574714.7746	445230	77304	16.81672358	534	690.7792611	2.434456929
23	Kymenlaakso	2020-04-22T09:00:00.000Z			33	4823017565	570062.8866	445178	164456	20.06615751	1288	783.1882084	2.562111801
25	Keski-Suomi	2020-04-22T09:00:00.000Z			117	17177523325	906777.6917	445285	252716	46.29702908	1577	624.0206398	7.419150285
31	Pohjois-Karjala	2020-04-22T09:00:00.000Z			23	22899465668	887108.7454	445293	164465	13.98473839	1027	624.4489709	2.239532619
34	Etelä-Savo	2020-04-22T09:00:00.000Z			44	12100242518	722637.3009	445155	98823	44.52404805	819	828.7544398	5.372405372
39	Kainuu	2020-04-22T09:00:00.000Z			48	22675188723	806107.9636	445101	72306	66.3845324	525	726.0808232	9.142857143
44	Pohjois-Savo	2020-04-22T09:00:00.000Z			119	20347226547	843263.5239	445223	244236	48.72336592	2544	1041.615487	4.677672956
53	Etelä-Karjala	2020-04-22T09:00:00.000Z			14	6868161148	523871.5687	445043	127757	10.95830365	838	655.9327473	1.670644391
85	Länsi-Pohja	2020-04-22T09:00:00.000Z			89	7165476758	539560.0949	445190	60295	147.607596	997	1653.536778	8.926780341
302	Pirkanmaa	2020-04-22T09:00:00.000Z			201	17010973254	784173.2693	445282	514838	39.0414072	7361	1429.770141	2.730607254
310	Vaasa	2020-04-22T09:00:00.000Z			45	6352198223	1605232.793	445079	169495	26.54945574	1045	616.537361	4.306220096
354	Varsinais-Suomi	2020-04-22T09:00:00.000Z			237	10436286013	2437433.114	445197	482169	49.15289038	5124	1062.697934	4.62529274`
};
// 353	Kaikki sairaanhoitopiirit	2020-03-21T00:00:00.000Z	71		795	3.35898E+11	9626515.907	445222	5488988	14.48354414	25433	463.3458845	3.125860103

export class DayCases extends Map<string, { cases: number; deaths: number }> {}

export const Regions = new Map<string, number>();

function parseCases(cases: string): DayCases {
  const caseMap = new DayCases();
  cases.split("\n").forEach(line => {
    const [
      objectid,
      sairaanhoitopiiri,
      aika,
      tapauksia,
      id,
      tapauksia_yhteensa,
      Shape__Area,
      Shape__Length,
      koodi,
      vaesto,
      ilmaantuvuus,
      testimaara_yhteensa,
      testimaara_suhde,
      tapauksia_suhde_testimaara
    ] = line.split("\t");
    Regions.set(sairaanhoitopiiri, parseInt(vaesto));
    caseMap.set(sairaanhoitopiiri, {
      cases: parseInt(tapauksia_yhteensa),
      deaths: 0
    });
  });
  return caseMap;
}

export const COVIDCases = new Map();

for (let date in rawCOVIDCases) {
  COVIDCases.set(date, parseCases(rawCOVIDCases[date]));
}
