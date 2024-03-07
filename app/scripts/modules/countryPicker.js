'use strict';
/**
 * @name countryPicker
 * @desc Generate a language configurable list of countries as options of the select element.
 * @author Tomas Garcia <tomygarcia10@gmail.com>
 *
 * @param {string} [pvpCountryPicker=alpha3] The value to which ngModel is bound being the options 'alpha2', 'alpha3',
 * 'numeric' and 'name'. If not specified, 'alpha3' is used as default.
 * @example
 * <select ng-model="selectedCountry" pvp-country-picker="name"></select>
 */
angular.module('countryPicker',[])
  .provider('countries', function rombusCountries() {
    var countries = [
      {"name":"Afghanistan","alpha2":"AF","alpha3":"AFG","numeric":"004","esp":"Afganistán","eng":"Afghanistan","por":""},
      {"name":"Albania","alpha2":"AL","alpha3":"ALB","numeric":"008","esp":"Albania","eng":"Albania","por":""},
      {"name":"Algeria","alpha2":"DZ","alpha3":"DZA","numeric":"012","esp":"Algeria","eng":"Algeria","por":""},
      {"name":"American Samoa","alpha2":"AS","alpha3":"ASM","numeric":"016","esp":"Samoa Americana","eng":"American Samoa","por":""},
      {"name":"Andorra","alpha2":"AD","alpha3":"AND","numeric":"020","esp":"Andorra","eng":"Andorra","por":""},
      {"name":"Angola","alpha2":"AO","alpha3":"AGO","numeric":"024","esp":"Angola","eng":"Angola","por":""},
      {"name":"Anguilla","alpha2":"AI","alpha3":"AIA","numeric":"660","esp":"Anguila","eng":"Anguilla","por":""},
      {"name":"Antarctica","alpha2":"AQ","alpha3":"ATA","numeric":"010","esp":"Antártida","eng":"Antarctica","por":""},
      {"name":"Antigua and Barbuda","alpha2":"AG","alpha3":"ATG","numeric":"028","esp":"Antigua y Barbuda","eng":"Antigua and Barbuda","por":""},
      {"name":"Argentina","alpha2":"AR","alpha3":"ARG","numeric":"032","esp":"Argentina","eng":"Argentina","por":""},
      {"name":"Armenia","alpha2":"AM","alpha3":"ARM","numeric":"051","esp":"Armenia","eng":"Armenia","por":""},
      {"name":"Aruba","alpha2":"AW","alpha3":"ABW","numeric":"533","esp":"Aruba","eng":"Aruba","por":""},
      {"name":"Australia","alpha2":"AU","alpha3":"AUS","numeric":"036","esp":"Australia","eng":"Australia","por":""},
      {"name":"Austria","alpha2":"AT","alpha3":"AUT","numeric":"040","esp":"Austria","eng":"Austria","por":""},
      {"name":"Azerbaijan","alpha2":"AZ","alpha3":"AZE","numeric":"031","esp":"Azerbaiyán","eng":"Azerbaijan","por":""},
      {"name":"Bahamas","alpha2":"BS","alpha3":"BHS","numeric":"044","esp":"Bahamas","eng":"Bahamas","por":""},
      {"name":"Bahrain","alpha2":"BH","alpha3":"BHR","numeric":"048","esp":"Baréin","eng":"Bahrain","por":""},
      {"name":"Bangladesh","alpha2":"BD","alpha3":"BGD","numeric":"050","esp":"Bangladés","eng":"Bangladesh","por":""},
      {"name":"Barbados","alpha2":"BB","alpha3":"BRB","numeric":"052","esp":"Barbados","eng":"Barbados","por":""},
      {"name":"Belarus","alpha2":"BY","alpha3":"BLR","numeric":"112","esp":"Bielorrusia","eng":"Belarus","por":""},
      {"name":"Belgium","alpha2":"BE","alpha3":"BEL","numeric":"056","esp":"Bélgica","eng":"Belgium","por":""},
      {"name":"Belize","alpha2":"BZ","alpha3":"BLZ","numeric":"084","esp":"Belice","eng":"Belize","por":""},
      {"name":"Benin","alpha2":"BJ","alpha3":"BEN","numeric":"204","esp":"Benin","eng":"Benin","por":""},
      {"name":"Bermuda","alpha2":"BM","alpha3":"BMU","numeric":"060","esp":"Bermudas","eng":"Bermuda","por":""},
      {"name":"Bhutan","alpha2":"BT","alpha3":"BTN","numeric":"064","esp":"Bután","eng":"Bhutan","por":""},
      {"name":"Bolivia","alpha2":"BO","alpha3":"BOL","numeric":"068","esp":"Bolivia","eng":"Bolivia","por":""},
      {"name":"Bosnia and Herzegovina","alpha2":"BA","alpha3":"BIH","numeric":"070","esp":"Bosnia y Herzegovina","eng":"Bosnia and Herzegovina","por":""},
      {"name":"Botswana","alpha2":"BW","alpha3":"BWA","numeric":"072","esp":"Botsuana","eng":"Botswana","por":""},
      {"name":"Bouvet Island","alpha2":"BV","alpha3":"BVT","numeric":"074","esp":"Isla Bouvet","eng":"Bouvet Island","por":""},
      {"name":"Brazil","alpha2":"BR","alpha3":"BRA","numeric":"076","esp":"Brasil","eng":"Brazil","por":""},
      {"name":"British Indian Ocean Territory","alpha2":"IO","alpha3":"IOT","numeric":"086","esp":"Territorio británico del océano Índico","eng":"British Indian Ocean Territory","por":""},
      {"name":"Brunei Darussalam","alpha2":"BN","alpha3":"BRN","numeric":"096","esp":"Brunéi","eng":"Brunei Darussalam","por":""},
      {"name":"Bulgaria","alpha2":"BG","alpha3":"BGR","numeric":"100","esp":"Bulgaria","eng":"Bulgaria","por":""},
      {"name":"Burkina Faso","alpha2":"BF","alpha3":"BFA","numeric":"854","esp":"Burkina Faso","eng":"Burkina Faso","por":""},
      {"name":"Burundi","alpha2":"BI","alpha3":"BDI","numeric":"108","esp":"Burundi","eng":"Burundi","por":""},
      {"name":"Cape Verde","alpha2":"CV","alpha3":"CPV","numeric":"132","esp":"Cabo Verde","eng":"Cape Verde","por":""},
      {"name":"Cambodia","alpha2":"KH","alpha3":"KHM","numeric":"116","esp":"Camboya","eng":"Cambodia","por":""},
      {"name":"Cameroon","alpha2":"CM","alpha3":"CMR","numeric":"120","esp":"Camerún","eng":"Cameroon","por":""},
      {"name":"Canada","alpha2":"CA","alpha3":"CAN","numeric":"124","esp":"Canadá","eng":"Canada","por":""},
      {"name":"Cayman Islands","alpha2":"KY","alpha3":"CYM","numeric":"136","esp":"Islas Caymán","eng":"Cayman Islands","por":""},
      {"name":"Central African Republic","alpha2":"CF","alpha3":"CAF","numeric":"140","esp":"República Centroafricana","eng":"Central African Republic","por":""},
      {"name":"Chad","alpha2":"TD","alpha3":"TCD","numeric":"148","esp":"Chad","eng":"Chad","por":""},
      {"name":"Chile","alpha2":"CL","alpha3":"CHL","numeric":"152","esp":"Chile","eng":"Chile","por":""},
      {"name":"China","alpha2":"CN","alpha3":"CHN","numeric":"156","esp":"China","eng":"China","por":""},
      {"name":"Christmas Island","alpha2":"CX","alpha3":"CXR","numeric":"162","esp":"Isla Navidad","eng":"Christmas Island","por":""},
      {"name":"Cocos Islands ","alpha2":"CC","alpha3":"CCK","numeric":"166","esp":"Islas Cocos o Islas Keeling","eng":"Cocos Islands ","por":""},
      {"name":"Colombia","alpha2":"CO","alpha3":"COL","numeric":"170","esp":"Colombia","eng":"Colombia","por":""},
      {"name":"Comoros","alpha2":"KM","alpha3":"COM","numeric":"174","esp":"Comoras","eng":"Comoros","por":""},
      {"name":"Democratic Republic of Congo","alpha2":"CD","alpha3":"COD","numeric":"180","esp":"República Democrática del Congo","eng":"Democratic Republic of Congo","por":""},
      {"name":"Cook Islands","alpha2":"CK","alpha3":"COK","numeric":"184","esp":"Islas Cook","eng":"Cook Islands","por":""},
      {"name":"Costa Rica","alpha2":"CR","alpha3":"CRI","numeric":"188","esp":"Costa Rica","eng":"Costa Rica","por":""},
      {"name":"Cote d'Ivoire","alpha2":"CI","alpha3":"CIV","numeric":"384","esp":"Costa de Marfil","eng":"CÃ´te d'Ivoire","por":""},
      {"name":"Croatia","alpha2":"HR","alpha3":"HRV","numeric":"191","esp":"Croacia","eng":"Croatia","por":""},
      {"name":"Cuba","alpha2":"CU","alpha3":"CUB","numeric":"192","esp":"Cuba","eng":"Cuba","por":""},
      {"name":"Cyprus","alpha2":"CY","alpha3":"CYP","numeric":"196","esp":"Chipre","eng":"Cyprus","por":""},
      {"name":"Czech Republic","alpha2":"CZ","alpha3":"CZE","numeric":"203","esp":"Replública Checa","eng":"Czech Republic","por":""},
      {"name":"Denmark","alpha2":"DK","alpha3":"DNK","numeric":"208","esp":"Dinamarca","eng":"Denmark","por":""},
      {"name":"Djibouti","alpha2":"DJ","alpha3":"DJI","numeric":"262","esp":"Yibuti","eng":"Djibouti","por":""},
      {"name":"Dominica","alpha2":"DM","alpha3":"DMA","numeric":"212","esp":"Dominica","eng":"Dominica","por":""},
      {"name":"Dominican Republic ","alpha2":"DO","alpha3":"DOM","numeric":"214","esp":"Replúbica Dominicana","eng":"Dominican Republic ","por":""},
      {"name":"Ecuador","alpha2":"EC","alpha3":"ECU","numeric":"218","esp":"Ecuador","eng":"Ecuador","por":""},
      {"name":"Egypt","alpha2":"EG","alpha3":"EGY","numeric":"818","esp":"Egipto","eng":"Egypt","por":""},
      {"name":"El Salvador","alpha2":"SV","alpha3":"SLV","numeric":"222","esp":"El Salvador","eng":"El Salvador","por":""},
      {"name":"Equatorial Guinea","alpha2":"GQ","alpha3":"GNQ","numeric":"226","esp":"Guinea Ecuatorial","eng":"Equatorial Guinea","por":""},
      {"name":"Eritrea","alpha2":"ER","alpha3":"ERI","numeric":"232","esp":"Eritrea","eng":"Eritrea","por":""},
      {"name":"Estonia","alpha2":"EE","alpha3":"EST","numeric":"233","esp":"Estonia","eng":"Estonia","por":""},
      {"name":"Ethiopia","alpha2":"ET","alpha3":"ETH","numeric":"231","esp":"Etiopía","eng":"Ethiopia","por":""},
      {"name":"Falkland Islands","alpha2":"FK","alpha3":"FLK","numeric":"238","esp":"Islas Malvinas","eng":"Falkland Islands","por":""},
      {"name":"Faroe Islands","alpha2":"FO","alpha3":"FRO","numeric":"234","esp":"Islas Faroe","eng":"Faroe Islands","por":""},
      {"name":"Fiji","alpha2":"FJ","alpha3":"FJI","numeric":"242","esp":"Fiyi","eng":"Fiji","por":""},
      {"name":"Finland","alpha2":"FI","alpha3":"FIN","numeric":"246","esp":"Finalandia","eng":"Finland","por":""},
      {"name":"France","alpha2":"FR","alpha3":"FRA","numeric":"250","esp":"Francia","eng":"France","por":""},
      {"name":"French Guiana","alpha2":"GF","alpha3":"GUF","numeric":"254","esp":"Guinea Francesa","eng":"French Guiana","por":""},
      {"name":"French Polynesia","alpha2":"PF","alpha3":"PYF","numeric":"258","esp":"Polinesia Francesa","eng":"French Polynesia","por":""},
      {"name":"Gabon","alpha2":"GA","alpha3":"GAB","numeric":"266","esp":"Gabón","eng":"Gabon","por":""},
      {"name":"Gambia ","alpha2":"GM","alpha3":"GMB","numeric":"270","esp":"Gambia","eng":"Gambia ","por":""},
      {"name":"Georgia","alpha2":"GE","alpha3":"GEO","numeric":"268","esp":"Georgia","eng":"Georgia","por":""},
      {"name":"Germany","alpha2":"DE","alpha3":"DEU","numeric":"276","esp":"Alemania","eng":"Germany","por":""},
      {"name":"Ghana","alpha2":"GH","alpha3":"GHA","numeric":"288","esp":"Gahna","eng":"Ghana","por":""},
      {"name":"Gibraltar","alpha2":"GI","alpha3":"GIB","numeric":"292","esp":"Gibraltar","eng":"Gibraltar","por":""},
      {"name":"Greece","alpha2":"GR","alpha3":"GRC","numeric":"300","esp":"Grecia","eng":"Greece","por":""},
      {"name":"Greenland","alpha2":"GL","alpha3":"GRL","numeric":"304","esp":"Groenlandia","eng":"Greenland","por":""},
      {"name":"Grenada","alpha2":"GD","alpha3":"GRD","numeric":"308","esp":"Granada","eng":"Grenada","por":""},
      {"name":"Guadeloupe","alpha2":"GP","alpha3":"GLP","numeric":"312","esp":"Guadalupe","eng":"Guadeloupe","por":""},
      {"name":"Guam","alpha2":"GU","alpha3":"GUM","numeric":"316","esp":"Guam","eng":"Guam","por":""},
      {"name":"Guatemala","alpha2":"GT","alpha3":"GTM","numeric":"320","esp":"Guatemala","eng":"Guatemala","por":""},
      {"name":"Guernsey","alpha2":"GG","alpha3":"GGY","numeric":"831","esp":"Bailiazgo de Guernsey","eng":"Guernsey","por":""},
      {"name":"Guinea","alpha2":"GN","alpha3":"GIN","numeric":"324","esp":"Guinea","eng":"Guinea","por":""},
      {"name":"Guinea-Bissau","alpha2":"GW","alpha3":"GNB","numeric":"624","esp":"Guinea-Bisáu","eng":"Guinea-Bissau","por":""},
      {"name":"Guyana","alpha2":"GY","alpha3":"GUY","numeric":"328","esp":"Guyana","eng":"Guyana","por":""},
      {"name":"Haiti","alpha2":"HT","alpha3":"HTI","numeric":"332","esp":"Haití","eng":"Haiti","por":""},
      {"name":"Heard Island and McDonald Islands","alpha2":"HM","alpha3":"HMD","numeric":"334","esp":"Islas Heard y McDonald","eng":"Heard Island and McDonald Islands","por":""},
      {"name":"Holy See","alpha2":"VA","alpha3":"VAT","numeric":"336","esp":"Santa Sede (Ciudad del Vaticano)","eng":"Holy See","por":""},
      {"name":"Honduras","alpha2":"HN","alpha3":"HND","numeric":"340","esp":"Honduras","eng":"Honduras","por":""},
      {"name":"Hong Kong","alpha2":"HK","alpha3":"HKG","numeric":"344","esp":"Hong Kong","eng":"Hong Kong","por":""},
      {"name":"Hungary","alpha2":"HU","alpha3":"HUN","numeric":"348","esp":"Hungría","eng":"Hungary","por":""},
      {"name":"Iceland","alpha2":"IS","alpha3":"ISL","numeric":"352","esp":"Islandi","eng":"Iceland","por":""},
      {"name":"India","alpha2":"IN","alpha3":"IND","numeric":"356","esp":"India","eng":"India","por":""},
      {"name":"Indonesia","alpha2":"ID","alpha3":"IDN","numeric":"360","esp":"Indonesia","eng":"Indonesia","por":""},
      {"name":"Iran Islamic Republic","alpha2":"IR","alpha3":"IRN","numeric":"364","esp":"Replública Islamica de Irán","eng":"Iran Islamic Republic","por":""},
      {"name":"Iraq","alpha2":"IQ","alpha3":"IRQ","numeric":"368","esp":"Iraq","eng":"Iraq","por":""},
      {"name":"Ireland","alpha2":"IE","alpha3":"IRL","numeric":"372","esp":"Irlanda","eng":"Ireland","por":""},
      {"name":"Israel","alpha2":"IL","alpha3":"ISR","numeric":"376","esp":"Israel","eng":"Israel","por":""},
      {"name":"Italy","alpha2":"IT","alpha3":"ITA","numeric":"380","esp":"Italia","eng":"Italy","por":""},
      {"name":"Jamaica","alpha2":"JM","alpha3":"JAM","numeric":"388","esp":"Jamaica","eng":"Jamaica","por":""},
      {"name":"Japan","alpha2":"JP","alpha3":"JPN","numeric":"392","esp":"Japón","eng":"Japan","por":""},
      {"name":"Jordan","alpha2":"JO","alpha3":"JOR","numeric":"400","esp":"Jordania","eng":"Jordan","por":""},
      {"name":"Kazakhstan","alpha2":"KZ","alpha3":"KAZ","numeric":"398","esp":"Kazajistán","eng":"Kazakhstan","por":""},
      {"name":"Kenya","alpha2":"KE","alpha3":"KEN","numeric":"404","esp":"Kenia","eng":"Kenya","por":""},
      {"name":"Kiribati","alpha2":"KI","alpha3":"KIR","numeric":"296","esp":"Kiribati","eng":"Kiribati","por":""},
      {"name":"Korea North","alpha2":"KP","alpha3":"PRK","numeric":"408","esp":"Korea del Norte","eng":"Korea North","por":""},
      {"name":"Korea South","alpha2":"KR","alpha3":"KOR","numeric":"410","esp":"Korea del Sur","eng":"Korea South","por":""},
      {"name":"Kuwait","alpha2":"KW","alpha3":"KWT","numeric":"414","esp":"Kuwait","eng":"Kuwait","por":""},
      {"name":"Kyrgyzstan","alpha2":"KG","alpha3":"KGZ","numeric":"417","esp":"Kirguistán","eng":"Kyrgyzstan","por":""},
      {"name":"Laos","alpha2":"LA","alpha3":"LAO","numeric":"418","esp":"Laos","eng":"Laos","por":""},
      {"name":"Latvia","alpha2":"LV","alpha3":"LVA","numeric":"428","esp":"Letonia","eng":"Latvia","por":""},
      {"name":"Lebanon","alpha2":"LB","alpha3":"LBN","numeric":"422","esp":"Líbano","eng":"Lebanon","por":""},
      {"name":"Lesotho","alpha2":"LS","alpha3":"LSO","numeric":"426","esp":"Lesoto","eng":"Lesotho","por":""},
      {"name":"Liberia","alpha2":"LR","alpha3":"LBR","numeric":"430","esp":"Liberia","eng":"Liberia","por":""},
      {"name":"Libya","alpha2":"LY","alpha3":"LBY","numeric":"434","esp":"Libia","eng":"Libya","por":""},
      {"name":"Liechtenstein","alpha2":"LI","alpha3":"LIE","numeric":"438","esp":"Liechtenstein","eng":"Liechtenstein","por":""},
      {"name":"Lithuania","alpha2":"LT","alpha3":"LTU","numeric":"440","esp":"Lituania","eng":"Lithuania","por":""},
      {"name":"Luxembourg","alpha2":"LU","alpha3":"LUX","numeric":"442","esp":"Luxemburgo","eng":"Luxembourg","por":""},
      {"name":"Macao","alpha2":"MO","alpha3":"MAC","numeric":"446","esp":"Macao","eng":"Macao","por":""},
      {"name":"Macedonia","alpha2":"MK","alpha3":"MKD","numeric":"807","esp":"Macedonia","eng":"Macedonia","por":""},
      {"name":"Madagascar","alpha2":"MG","alpha3":"MDG","numeric":"450","esp":"Madagascar","eng":"Madagascar","por":""},
      {"name":"Malawi","alpha2":"MW","alpha3":"MWI","numeric":"454","esp":"Malawi","eng":"Malawi","por":""},
      {"name":"Malaysia","alpha2":"MY","alpha3":"MYS","numeric":"458","esp":"Malasia","eng":"Malaysia","por":""},
      {"name":"Maldives","alpha2":"MV","alpha3":"MDV","numeric":"462","esp":"Maldivas","eng":"Maldives","por":""},
      {"name":"Mali","alpha2":"ML","alpha3":"MLI","numeric":"466","esp":"Mali","eng":"Mali","por":""},
      {"name":"Malta","alpha2":"MT","alpha3":"MLT","numeric":"470","esp":"Malta","eng":"Malta","por":""},
      {"name":"Marshall Islands ","alpha2":"MH","alpha3":"MHL","numeric":"584","esp":"Islas Marshall","eng":"Marshall Islands ","por":""},
      {"name":"Martinique","alpha2":"MQ","alpha3":"MTQ","numeric":"474","esp":"Martinica","eng":"Martinique","por":""},
      {"name":"Mauritania","alpha2":"MR","alpha3":"MRT","numeric":"478","esp":"Mauritania","eng":"Mauritania","por":""},
      {"name":"Mauritius","alpha2":"MU","alpha3":"MUS","numeric":"480","esp":"Maurities","eng":"Mauritius","por":""},
      {"name":"Mayotte","alpha2":"YT","alpha3":"MYT","numeric":"175","esp":"Mayotte","eng":"Mayotte","por":""},
      {"name":"Mexico","alpha2":"MX","alpha3":"MEX","numeric":"484","esp":"México","eng":"Mexico","por":""},
      {"name":"Micronesia","alpha2":"FM","alpha3":"FSM","numeric":"583","esp":"Micronesia","eng":"Micronesia","por":""},
      {"name":"Moldova","alpha2":"MD","alpha3":"MDA","numeric":"498","esp":"Moldavia","eng":"Moldova","por":""},
      {"name":"Monaco","alpha2":"MC","alpha3":"MCO","numeric":"492","esp":"Mónaco","eng":"Monaco","por":""},
      {"name":"Mongolia","alpha2":"MN","alpha3":"MNG","numeric":"496","esp":"Mongolia","eng":"Mongolia","por":""},
      {"name":"Montenegro","alpha2":"ME","alpha3":"MNE","numeric":"499","esp":"Montenegro","eng":"Montenegro","por":""},
      {"name":"Montserrat","alpha2":"MS","alpha3":"MSR","numeric":"500","esp":"Isla de Montserrat","eng":"Montserrat","por":""},
      {"name":"Morocco","alpha2":"MA","alpha3":"MAR","numeric":"504","esp":"Marruecos","eng":"Morocco","por":""},
      {"name":"Mozambique","alpha2":"MZ","alpha3":"MOZ","numeric":"508","esp":"Mozambique","eng":"Mozambique","por":""},
      {"name":"Namibia","alpha2":"NA","alpha3":"NAM","numeric":"516","esp":"Namibia","eng":"Namibia","por":""},
      {"name":"Nauru","alpha2":"NR","alpha3":"NRU","numeric":"520","esp":"República de Nauru","eng":"Nauru","por":""},
      {"name":"Nepal","alpha2":"NP","alpha3":"NPL","numeric":"524","esp":"Nepal","eng":"Nepal","por":""},
      {"name":"Netherlands ","alpha2":"NL","alpha3":"NLD","numeric":"528","esp":"Holanda","eng":"Netherlands ","por":""},
      {"name":"New Caledonia","alpha2":"NC","alpha3":"NCL","numeric":"540","esp":"Nueva Caledonia","eng":"New Caledonia","por":""},
      {"name":"New Zealand","alpha2":"NZ","alpha3":"NZL","numeric":"554","esp":"Nueva Zelanda","eng":"New Zealand","por":""},
      {"name":"Nicaragua","alpha2":"NI","alpha3":"NIC","numeric":"558","esp":"Nicaragua","eng":"Nicaragua","por":""},
      {"name":"Niger ","alpha2":"NE","alpha3":"NER","numeric":"562","esp":"Niger","eng":"Niger ","por":""},
      {"name":"Nigeria","alpha2":"NG","alpha3":"NGA","numeric":"566","esp":"Nigeria","eng":"Nigeria","por":""},
      {"name":"Niue","alpha2":"NU","alpha3":"NIU","numeric":"570","esp":"Niue","eng":"Niue","por":""},
      {"name":"Norfolk Island","alpha2":"NF","alpha3":"NFK","numeric":"574","esp":"Isla Norfolk","eng":"Norfolk Island","por":""},
      {"name":"Norway","alpha2":"NO","alpha3":"NOR","numeric":"578","esp":"Noruega","eng":"Norway","por":""},
      {"name":"Oman","alpha2":"OM","alpha3":"OMN","numeric":"512","esp":"Oman","eng":"Oman","por":""},
      {"name":"Pakistan","alpha2":"PK","alpha3":"PAK","numeric":"586","esp":"Pakistán","eng":"Pakistan","por":""},
      {"name":"Palau","alpha2":"PW","alpha3":"PLW","numeric":"585","esp":"Palau","eng":"Palau","por":""},
      {"name":"Palestine","alpha2":"PS","alpha3":"PSE","numeric":"275","esp":"Palestina","eng":"Palestine","por":""},
      {"name":"Panama","alpha2":"PA","alpha3":"PAN","numeric":"591","esp":"Panamá","eng":"Panama","por":""},
      {"name":"Papua New Guinea","alpha2":"PG","alpha3":"PNG","numeric":"598","esp":"Papua Nueva Guinea","eng":"Papua New Guinea","por":""},
      {"name":"Paraguay","alpha2":"PY","alpha3":"PRY","numeric":"600","esp":"Paraguay","eng":"Paraguay","por":""},
      {"name":"Peru","alpha2":"PE","alpha3":"PER","numeric":"604","esp":"Perú","eng":"Peru","por":""},
      {"name":"Philippines ","alpha2":"PH","alpha3":"PHL","numeric":"608","esp":"Filipinas","eng":"Philippines ","por":""},
      {"name":"Poland","alpha2":"PL","alpha3":"POL","numeric":"616","esp":"Polonia","eng":"Poland","por":""},
      {"name":"Portugal","alpha2":"PT","alpha3":"PRT","numeric":"620","esp":"Portugal","eng":"Portugal","por":""},
      {"name":"Puerto Rico","alpha2":"PR","alpha3":"PRI","numeric":"630","esp":"Puerto Rico","eng":"Puerto Rico","por":""},
      {"name":"Qatar","alpha2":"QA","alpha3":"QAT","numeric":"634","esp":"Qatar","eng":"Qatar","por":""},
      {"name":"Romania","alpha2":"RO","alpha3":"ROU","numeric":"642","esp":"Rumania","eng":"Romania","por":""},
      {"name":"Russian Federation ","alpha2":"RU","alpha3":"RUS","numeric":"643","esp":"Rusia","eng":"Russian Federation ","por":""},
      {"name":"Rwanda","alpha2":"RW","alpha3":"RWA","numeric":"646","esp":"Ruanda","eng":"Rwanda","por":""},
      {"name":"Samoa","alpha2":"WS","alpha3":"WSM","numeric":"882","esp":"Samoa","eng":"Samoa","por":""},
      {"name":"San Marino","alpha2":"SM","alpha3":"SMR","numeric":"674","esp":"San Marino","eng":"San Marino","por":""},
      {"name":"Saudi Arabia","alpha2":"SA","alpha3":"SAU","numeric":"682","esp":"Arabia Saudita","eng":"Saudi Arabia","por":""},
      {"name":"Senegal","alpha2":"SN","alpha3":"SEN","numeric":"686","esp":"Senegal","eng":"Senegal","por":""},
      {"name":"Serbia","alpha2":"RS","alpha3":"SRB","numeric":"688","esp":"Serbia","eng":"Serbia","por":""},
      {"name":"Seychelles","alpha2":"SC","alpha3":"SYC","numeric":"690","esp":"Seychelles","eng":"Seychelles","por":""},
      {"name":"Sierra Leone","alpha2":"SL","alpha3":"SLE","numeric":"694","esp":"Sierra Leona","eng":"Sierra Leone","por":""},
      {"name":"Singapore","alpha2":"SG","alpha3":"SGP","numeric":"702","esp":"Singapur","eng":"Singapore","por":""},
      {"name":"Slovakia","alpha2":"SK","alpha3":"SVK","numeric":"703","esp":"Eslovaquia","eng":"Slovakia","por":""},
      {"name":"Slovenia","alpha2":"SI","alpha3":"SVN","numeric":"705","esp":"Eslovenia","eng":"Slovenia","por":""},
      {"name":"Solomon Islands","alpha2":"SB","alpha3":"SLB","numeric":"090","esp":"Islas Solomon","eng":"Solomon Islands","por":""},
      {"name":"Somalia","alpha2":"SO","alpha3":"SOM","numeric":"706","esp":"Somalia","eng":"Somalia","por":""},
      {"name":"South Africa","alpha2":"ZA","alpha3":"ZAF","numeric":"710","esp":"Sudáfrica","eng":"South Africa","por":""},
      {"name":"Spain","alpha2":"ES","alpha3":"ESP","numeric":"724","esp":"España","eng":"Spain","por":""},
      {"name":"Sri Lanka","alpha2":"LK","alpha3":"LKA","numeric":"144","esp":"Sri Lanka","eng":"Sri Lanka","por":""},
      {"name":"Sudan ","alpha2":"SD","alpha3":"SDN","numeric":"729","esp":"Sudan","eng":"Sudan ","por":""},
      {"name":"Suriname","alpha2":"SR","alpha3":"SUR","numeric":"740","esp":"Surinam","eng":"Suriname","por":""},
      {"name":"Swaziland","alpha2":"SZ","alpha3":"SWZ","numeric":"748","esp":"Swaziland","eng":"Swaziland","por":""},
      {"name":"Sweden","alpha2":"SE","alpha3":"SWE","numeric":"752","esp":"Suecia","eng":"Sweden","por":""},
      {"name":"Switzerland","alpha2":"CH","alpha3":"CHE","numeric":"756","esp":"Suiza","eng":"Switzerland","por":""},
      {"name":"Syrian Arab Republic","alpha2":"SY","alpha3":"SYR","numeric":"760","esp":"Siria","eng":"Syrian Arab Republic","por":""},
      {"name":"Taiwan","alpha2":"TW","alpha3":"TWN","numeric":"158","esp":"Taiwan","eng":"Taiwan","por":""},
      {"name":"Tajikistan","alpha2":"TJ","alpha3":"TJK","numeric":"762","esp":"Tajikistán","eng":"Tajikistan","por":""},
      {"name":"Tanzania","alpha2":"TZ","alpha3":"TZA","numeric":"834","esp":"Tanzania","eng":"Tanzania","por":""},
      {"name":"Thailand","alpha2":"TH","alpha3":"THA","numeric":"764","esp":"Tailandia","eng":"Thailand","por":""},
      {"name":"Togo","alpha2":"TG","alpha3":"TGO","numeric":"768","esp":"Togo","eng":"Togo","por":""},
      {"name":"Tokelau","alpha2":"TK","alpha3":"TKL","numeric":"772","esp":"Tokelau","eng":"Tokelau","por":""},
      {"name":"Tonga","alpha2":"TO","alpha3":"TON","numeric":"776","esp":"Tonga","eng":"Tonga","por":""},
      {"name":"Trinidad and Tobago","alpha2":"TT","alpha3":"TTO","numeric":"780","esp":"Trinidad y Tobago","eng":"Trinidad and Tobago","por":""},
      {"name":"Tunisia","alpha2":"TN","alpha3":"TUN","numeric":"788","esp":"Túnez","eng":"Tunisia","por":""},
      {"name":"Turkey","alpha2":"TR","alpha3":"TUR","numeric":"792","esp":"Turquía","eng":"Turkey","por":""},
      {"name":"Turkmenistan","alpha2":"TM","alpha3":"TKM","numeric":"795","esp":"Turkmenistan","eng":"Turkmenistan","por":""},
      {"name":"Tuvalu","alpha2":"TV","alpha3":"TUV","numeric":"798","esp":"Tuvalu","eng":"Tuvalu","por":""},
      {"name":"Uganda","alpha2":"UG","alpha3":"UGA","numeric":"800","esp":"Uganda","eng":"Uganda","por":""},
      {"name":"Ukraine","alpha2":"UA","alpha3":"UKR","numeric":"804","esp":"Ucrania","eng":"Ukraine","por":""},
      {"name":"United Arab Emirates ","alpha2":"AE","alpha3":"ARE","numeric":"784","esp":"Emiratos Arabes Unidos","eng":"United Arab Emirates ","por":""},
      {"name":"United Kingdom","alpha2":"GB","alpha3":"GBR","numeric":"826","esp":"Reino Unido","eng":"United Kingdom","por":""},
      {"name":"United States of America ","alpha2":"US","alpha3":"USA","numeric":"840","esp":"Estados Unidos","eng":"United States of America ","por":""},
      {"name":"Uruguay","alpha2":"UY","alpha3":"URY","numeric":"858","esp":"Uruguay","eng":"Uruguay","por":""},
      {"name":"Uzbekistan","alpha2":"UZ","alpha3":"UZB","numeric":"860","esp":"Uzbekistan","eng":"Uzbekistan","por":""},
      {"name":"Venezuela","alpha2":"VE","alpha3":"VEN","numeric":"862","esp":"Venezuela","eng":"Venezuela","por":""},
      {"name":"Vietnam","alpha2":"VN","alpha3":"VNM","numeric":"704","esp":"Vietnam","eng":"Vietnam","por":""},
      {"name":"Virgin Islands (British)","alpha2":"VG","alpha3":"VGB","numeric":"092","esp":"Islas Vírgenes Británicas","eng":"Virgin Islands (British)","por":""},
      {"name":"Virgin Islands (U.S.)","alpha2":"VI","alpha3":"VIR","numeric":"850","esp":"Islas Virgenes (US)","eng":"Virgin Islands (U.S.)","por":""},
      {"name":"Western Sahara","alpha2":"EH","alpha3":"ESH","numeric":"732","esp":"Sahara","eng":"Western Sahara","por":""},
      {"name":"Yemen","alpha2":"YE","alpha3":"YEM","numeric":"887","esp":"Yemen","eng":"Yemen","por":""},
      {"name":"Zambia","alpha2":"ZM","alpha3":"ZMB","numeric":"894","esp":"Zambia","eng":"Zambia","por":""},
      {"name":"Zimbabwe","alpha2":"ZW","alpha3":"ZWE","numeric":"716","esp":"Zimbabwe","eng":"Zimbabwe","por":""}
    ];
    return {
      setCountries: function(listOfCountries) {
        countries = listOfCountries;
      },
      $get: function() {
        return {
          getCountries: function() {
            return countries;
          }
        };
      }
    };
  })
  .service('CountryPickerService', ['countries', '$filter', function (rombusCountries, $filter) {
    var service = this;
    service.loadCountriesPerLang = function (lang) {
      service.lang = lang;
      angular.forEach(rombusCountries.getCountries(), function (item) {
        if(lang === 'esp'){
          item.name = item.esp;
        }
        else {
          item.name = item.eng;
        }
      });
    };
    service.getCountryCodeFromName = function (name) {
      if(name !== null && name !== ''){
        var result;
        try{
          if(service.lang === 'eng'){
            result = $filter('filter')(rombusCountries.getCountries(), {eng: name})[0];
          }
          else{
            result = $filter('filter')(rombusCountries.getCountries(), {esp: name})[0];
          }
        } catch (err){ return ''; }
        return result.alpha3;
      }
      else{
        return null;
      }
    };
    service.getCountryNameFromCode = function (code) {
      var result = '';
      if(code !== undefined && code !== null){
        try{
          if(service.lang === 'eng'){
            result = $filter('filter')(rombusCountries.getCountries(), {alpha3: code})[0].eng;
          }
          else{
            result = $filter('filter')(rombusCountries.getCountries(), {alpha3: code})[0].esp;
          }
        } catch (err){ return ''; }
      }
      return result;
    };
  }])
  .directive('rombusCountryPicker', ['$compile', '$filter', function($compile, $filter) {
    var PRIORITY = 1;
    return {
      priority: PRIORITY,
      terminal: true,
      controller: ['$scope', 'countries', function($scope, rombusCountries) {
        $scope.countries = $filter('orderBy')(rombusCountries.getCountries(), 'name');
      }],
      compile: function (tElement, tAttrs) {
        if(! tAttrs.rombusCountryPicker) {
          tAttrs.rombusCountryPicker = 'alpha3';
        }
        var ngOptions = 'country.' + tAttrs.rombusCountryPicker + ' as country.name for country in countries';
        tAttrs.$set('ngOptions',  ngOptions);

        return function postLink(scope, iElement) {
          $compile(iElement, null, PRIORITY)(scope);
        };
      },
      restrict: 'A'
    };
  }]);