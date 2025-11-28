import { City } from "@/types/person";

export const FRENCH_CITIES: City[] = [
  // Métropole - 96 départements
  { name: "Bourg-en-Bresse", coordinates: [5.2281, 46.2056] }, // 01 Ain
  { name: "Laon", coordinates: [3.6238, 49.5637] }, // 02 Aisne
  { name: "Moulins", coordinates: [3.3334, 46.5667] }, // 03 Allier
  { name: "Digne-les-Bains", coordinates: [6.2363, 44.0936] }, // 04 Alpes-de-Haute-Provence
  { name: "Gap", coordinates: [6.0796, 44.5593] }, // 05 Hautes-Alpes
  { name: "Nice", coordinates: [7.2619, 43.7102] }, // 06 Alpes-Maritimes
  { name: "Privas", coordinates: [4.5994, 44.7353] }, // 07 Ardèche
  { name: "Charleville-Mézières", coordinates: [4.7197, 49.7739] }, // 08 Ardennes
  { name: "Foix", coordinates: [1.6063, 42.9649] }, // 09 Ariège
  { name: "Troyes", coordinates: [4.0744, 48.2973] }, // 10 Aube
  { name: "Carcassonne", coordinates: [2.3488, 43.2130] }, // 11 Aude
  { name: "Rodez", coordinates: [2.5752, 44.3503] }, // 12 Aveyron
  { name: "Marseille", coordinates: [5.3698, 43.2965] }, // 13 Bouches-du-Rhône
  { name: "Caen", coordinates: [-0.3707, 49.1829] }, // 14 Calvados
  { name: "Aurillac", coordinates: [2.4419, 44.9264] }, // 15 Cantal
  { name: "Angoulême", coordinates: [0.1608, 45.6484] }, // 16 Charente
  { name: "La Rochelle", coordinates: [-1.1508, 46.1603] }, // 17 Charente-Maritime
  { name: "Bourges", coordinates: [2.3964, 47.0844] }, // 18 Cher
  { name: "Tulle", coordinates: [1.7711, 45.2664] }, // 19 Corrèze
  { name: "Ajaccio", coordinates: [8.7384, 41.9267] }, // 20A Corse-du-Sud
  { name: "Bastia", coordinates: [9.4497, 42.7028] }, // 20B Haute-Corse
  { name: "Dijon", coordinates: [5.0415, 47.322] }, // 21 Côte-d'Or
  { name: "Saint-Brieuc", coordinates: [-2.7651, 48.5144] }, // 22 Côtes-d'Armor
  { name: "Guéret", coordinates: [1.8714, 46.1701] }, // 23 Creuse
  { name: "Périgueux", coordinates: [0.7211, 45.1885] }, // 24 Dordogne
  { name: "Besançon", coordinates: [6.0240, 47.2378] }, // 25 Doubs
  { name: "Valence", coordinates: [4.8918, 44.9333] }, // 26 Drôme
  { name: "Évreux", coordinates: [1.1510, 49.0246] }, // 27 Eure
  { name: "Chartres", coordinates: [1.4879, 48.4469] }, // 28 Eure-et-Loir
  { name: "Quimper", coordinates: [-4.0977, 47.9960] }, // 29 Finistère
  { name: "Nîmes", coordinates: [4.3601, 43.8367] }, // 30 Gard
  { name: "Toulouse", coordinates: [1.4442, 43.6047] }, // 31 Haute-Garonne
  { name: "Auch", coordinates: [0.5861, 43.6460] }, // 32 Gers
  { name: "Bordeaux", coordinates: [-0.5792, 44.8378] }, // 33 Gironde
  { name: "Montpellier", coordinates: [3.8767, 43.6108] }, // 34 Hérault
  { name: "Rennes", coordinates: [-1.6778, 48.1173] }, // 35 Ille-et-Vilaine
  { name: "Châteauroux", coordinates: [1.6914, 46.8108] }, // 36 Indre
  { name: "Tours", coordinates: [0.6833, 47.3941] }, // 37 Indre-et-Loire
  { name: "Grenoble", coordinates: [5.7245, 45.1885] }, // 38 Isère
  { name: "Lons-le-Saunier", coordinates: [5.5542, 46.6753] }, // 39 Jura
  { name: "Mont-de-Marsan", coordinates: [-0.4999, 43.8897] }, // 40 Landes
  { name: "Blois", coordinates: [1.3285, 47.5864] }, // 41 Loir-et-Cher
  { name: "Saint-Étienne", coordinates: [4.3872, 45.4397] }, // 42 Loire
  { name: "Le Puy-en-Velay", coordinates: [3.8845, 45.0439] }, // 43 Haute-Loire
  { name: "Nantes", coordinates: [-1.5536, 47.2184] }, // 44 Loire-Atlantique
  { name: "Orléans", coordinates: [1.9093, 47.9029] }, // 45 Loiret
  { name: "Cahors", coordinates: [1.4411, 44.4479] }, // 46 Lot
  { name: "Agen", coordinates: [0.6209, 44.2034] }, // 47 Lot-et-Garonne
  { name: "Mende", coordinates: [3.5007, 44.5181] }, // 48 Lozère
  { name: "Angers", coordinates: [-0.5532, 47.4784] }, // 49 Maine-et-Loire
  { name: "Saint-Lô", coordinates: [-1.0916, 49.1156] }, // 50 Manche
  { name: "Reims", coordinates: [4.0317, 49.2583] }, // 51 Marne
  { name: "Chaumont", coordinates: [5.1392, 48.1106] }, // 52 Haute-Marne
  { name: "Laval", coordinates: [-0.7703, 48.0696] }, // 53 Mayenne
  { name: "Nancy", coordinates: [6.1840, 48.6921] }, // 54 Meurthe-et-Moselle
  { name: "Bar-le-Duc", coordinates: [5.1608, 48.7722] }, // 55 Meuse
  { name: "Vannes", coordinates: [-2.7574, 47.6586] }, // 56 Morbihan
  { name: "Metz", coordinates: [6.1757, 49.1193] }, // 57 Moselle
  { name: "Nevers", coordinates: [3.1615, 46.9896] }, // 58 Nièvre
  { name: "Lille", coordinates: [3.0573, 50.6292] }, // 59 Nord
  { name: "Beauvais", coordinates: [2.0853, 49.4295] }, // 60 Oise
  { name: "Alençon", coordinates: [0.0897, 48.4328] }, // 61 Orne
  { name: "Arras", coordinates: [2.7772, 50.2912] }, // 62 Pas-de-Calais
  { name: "Clermont-Ferrand", coordinates: [3.0878, 45.7772] }, // 63 Puy-de-Dôme
  { name: "Pau", coordinates: [-0.3686, 43.2951] }, // 64 Pyrénées-Atlantiques
  { name: "Tarbes", coordinates: [0.0789, 43.2332] }, // 65 Hautes-Pyrénées
  { name: "Perpignan", coordinates: [2.8948, 42.6886] }, // 66 Pyrénées-Orientales
  { name: "Strasbourg", coordinates: [7.7521, 48.5734] }, // 67 Bas-Rhin
  { name: "Colmar", coordinates: [7.3589, 48.0794] }, // 68 Haut-Rhin
  { name: "Lyon", coordinates: [4.8357, 45.764] }, // 69 Rhône
  { name: "Vesoul", coordinates: [6.1544, 47.6211] }, // 70 Haute-Saône
  { name: "Mâcon", coordinates: [4.8283, 46.3067] }, // 71 Saône-et-Loire
  { name: "Le Mans", coordinates: [0.1996, 47.9959] }, // 72 Sarthe
  { name: "Chambéry", coordinates: [5.9177, 45.5646] }, // 73 Savoie
  { name: "Annecy", coordinates: [6.1294, 45.8992] }, // 74 Haute-Savoie
  { name: "Paris", coordinates: [2.3522, 48.8566] }, // 75 Paris
  { name: "Rouen", coordinates: [1.0993, 49.4432] }, // 76 Seine-Maritime
  { name: "Melun", coordinates: [2.6603, 48.5392] }, // 77 Seine-et-Marne
  { name: "Versailles", coordinates: [2.1301, 48.8014] }, // 78 Yvelines
  { name: "Niort", coordinates: [-0.4594, 46.3236] }, // 79 Deux-Sèvres
  { name: "Amiens", coordinates: [2.2957, 49.8942] }, // 80 Somme
  { name: "Albi", coordinates: [2.1480, 43.9277] }, // 81 Tarn
  { name: "Montauban", coordinates: [1.3548, 44.0178] }, // 82 Tarn-et-Garonne
  { name: "Toulon", coordinates: [5.928, 43.1242] }, // 83 Var
  { name: "Avignon", coordinates: [4.8108, 43.9493] }, // 84 Vaucluse
  { name: "La Roche-sur-Yon", coordinates: [-1.4269, 46.6702] }, // 85 Vendée
  { name: "Poitiers", coordinates: [0.3404, 46.5802] }, // 86 Vienne
  { name: "Limoges", coordinates: [1.2611, 45.8336] }, // 87 Haute-Vienne
  { name: "Épinal", coordinates: [6.4499, 48.1733] }, // 88 Vosges
  { name: "Auxerre", coordinates: [3.5731, 47.7976] }, // 89 Yonne
  { name: "Belfort", coordinates: [6.8628, 47.6389] }, // 90 Territoire de Belfort
  { name: "Évry", coordinates: [2.4291, 48.6247] }, // 91 Essonne
  { name: "Nanterre", coordinates: [2.2069, 48.8925] }, // 92 Hauts-de-Seine
  { name: "Bobigny", coordinates: [2.4389, 48.9072] }, // 93 Seine-Saint-Denis
  { name: "Créteil", coordinates: [2.4608, 48.7900] }, // 94 Val-de-Marne
  { name: "Cergy", coordinates: [2.0777, 49.0367] }, // 95 Val-d'Oise
  
  // Outre-mer - 5 départements
  { name: "Basse-Terre", coordinates: [-61.7314, 16.0000] }, // 971 Guadeloupe
  { name: "Fort-de-France", coordinates: [-61.0594, 14.6160] }, // 972 Martinique
  { name: "Cayenne", coordinates: [-52.3332, 4.9223] }, // 973 Guyane
  { name: "Saint-Denis", coordinates: [55.4504, -20.8823] }, // 974 La Réunion
  { name: "Mamoudzou", coordinates: [45.2269, -12.7806] }, // 976 Mayotte
  
  // Grandes villes et agglomérations importantes
  { name: "Villeurbanne", coordinates: [4.8800, 45.7667] },
  { name: "Aix-en-Provence", coordinates: [5.4474, 43.5297] },
  { name: "Brest", coordinates: [-4.4860, 48.3905] },
  { name: "Le Havre", coordinates: [0.1079, 49.4944] },
  { name: "Limoges", coordinates: [1.2578, 45.8336] },
  { name: "Dunkerque", coordinates: [2.3767, 51.0342] },
  { name: "Calais", coordinates: [1.8515, 50.9513] },
  { name: "Tourcoing", coordinates: [3.1609, 50.7236] },
  { name: "Roubaix", coordinates: [3.1746, 50.6942] },
  { name: "Mulhouse", coordinates: [7.3389, 47.7508] },
  { name: "Cannes", coordinates: [7.0174, 43.5528] },
  { name: "Antibes", coordinates: [7.1243, 43.5808] },
  { name: "Grasse", coordinates: [6.9227, 43.6584] },
  { name: "Saint-Nazaire", coordinates: [-2.2133, 47.2733] },
  { name: "Boulogne-Billancourt", coordinates: [2.2399, 48.8352] },
  { name: "Argenteuil", coordinates: [2.2469, 48.9474] },
  { name: "Montreuil", coordinates: [2.4419, 48.8637] },
  { name: "Saint-Paul", coordinates: [55.2698, -21.0096] },
  { name: "Lorient", coordinates: [-3.3667, 47.7500] },
  { name: "Chambéry", coordinates: [5.9177, 45.5646] },
  { name: "Metz", coordinates: [6.1757, 49.1193] },
  { name: "Béziers", coordinates: [3.2148, 43.3443] },
  { name: "Rouen", coordinates: [1.0993, 49.4432] },
  { name: "Caen", coordinates: [-0.3707, 49.1829] },
  { name: "Orléans", coordinates: [1.9093, 47.9029] },
  { name: "Amiens", coordinates: [2.2957, 49.8942] },
  { name: "Dijon", coordinates: [5.0415, 47.3220] },
  { name: "Angers", coordinates: [-0.5532, 47.4784] },
  { name: "Grenoble", coordinates: [5.7245, 45.1885] },
  { name: "Nîmes", coordinates: [4.3601, 43.8367] },
  { name: "Villejuif", coordinates: [2.3667, 48.7833] },
  { name: "Saint-Maur-des-Fossés", coordinates: [2.4978, 48.7997] },
  { name: "Asnières-sur-Seine", coordinates: [2.2856, 48.9142] },
  { name: "Colombes", coordinates: [2.2528, 48.9236] },
  { name: "Courbevoie", coordinates: [2.2528, 48.8978] },
  { name: "Rueil-Malmaison", coordinates: [2.1869, 48.8772] },
  { name: "Aubervilliers", coordinates: [2.3839, 48.9144] },
  { name: "Champigny-sur-Marne", coordinates: [2.4978, 48.8169] },
  { name: "Aulnay-sous-Bois", coordinates: [2.4939, 48.9333] },
  { name: "Vitry-sur-Seine", coordinates: [2.3933, 48.7875] },
  { name: "Pau", coordinates: [-0.3686, 43.2951] },
  { name: "La Rochelle", coordinates: [-1.1508, 46.1603] },
  { name: "Ajaccio", coordinates: [8.7384, 41.9267] },
  { name: "Bastia", coordinates: [9.4497, 42.7028] },
  { name: "Cholet", coordinates: [-0.8797, 47.0608] },
  { name: "Annecy", coordinates: [6.1294, 45.8992] },
  { name: "Beauvais", coordinates: [2.0853, 49.4295] },
  { name: "Quimper", coordinates: [-4.0977, 47.9960] },
  { name: "Poitiers", coordinates: [0.3404, 46.5802] },
  { name: "Troyes", coordinates: [4.0744, 48.2973] },
  { name: "Créteil", coordinates: [2.4608, 48.7900] },
  { name: "Bourges", coordinates: [2.3964, 47.0844] },
  { name: "La Seyne-sur-Mer", coordinates: [5.8800, 43.1017] },
  { name: "Châteauroux", coordinates: [1.6914, 46.8108] },
  { name: "Épinay-sur-Seine", coordinates: [2.3089, 48.9533] },
  { name: "Meaux", coordinates: [2.8878, 48.9606] },
  { name: "Fréjus", coordinates: [6.7367, 43.4333] },
  { name: "Narbonne", coordinates: [3.0044, 43.1836] },
  { name: "Sarcelles", coordinates: [2.3781, 48.9986] },
  { name: "Vénissieux", coordinates: [4.8872, 45.6967] },
  { name: "Clichy", coordinates: [2.3064, 48.9042] },
  { name: "Levallois-Perret", coordinates: [2.2875, 48.8933] },
  { name: "Issy-les-Moulineaux", coordinates: [2.2700, 48.8239] },
  { name: "Neuilly-sur-Seine", coordinates: [2.2686, 48.8847] },
  { name: "Antony", coordinates: [2.2978, 48.7544] },
  { name: "Cagnes-sur-Mer", coordinates: [7.1489, 43.6636] },
  { name: "Montauban", coordinates: [1.3548, 44.0178] },
  { name: "Sète", coordinates: [3.6972, 43.4028] },
  { name: "Niort", coordinates: [-0.4594, 46.3236] },
  { name: "Chambéry", coordinates: [5.9177, 45.5646] },
  { name: "Charleville-Mézières", coordinates: [4.7197, 49.7739] },
  { name: "Laval", coordinates: [-0.7703, 48.0696] },
  { name: "Colmar", coordinates: [7.3589, 48.0794] },
  { name: "Mérignac", coordinates: [-0.6431, 44.8403] },
  { name: "Hyères", coordinates: [6.1289, 43.1203] },
  { name: "Pessac", coordinates: [-0.6306, 44.8061] },
  { name: "Saint-Quentin", coordinates: [3.2867, 49.8481] },
  { name: "Albi", coordinates: [2.1480, 43.9277] },
  { name: "Évry", coordinates: [2.4291, 48.6247] },
  { name: "Cergy", coordinates: [2.0777, 49.0367] },
  { name: "Arles", coordinates: [4.6283, 43.6767] },
  { name: "Belfort", coordinates: [6.8628, 47.6389] },
  { name: "Blois", coordinates: [1.3285, 47.5864] },
  { name: "Chartres", coordinates: [1.4879, 48.4469] },
  { name: "Évreux", coordinates: [1.1510, 49.0246] },
  { name: "Périgueux", coordinates: [0.7211, 45.1885] },
  { name: "Carcassonne", coordinates: [2.3488, 43.2130] },
  { name: "Châlons-en-Champagne", coordinates: [4.3633, 48.9569] },
  { name: "Montluçon", coordinates: [2.6033, 46.3400] },
  { name: "Tarbes", coordinates: [0.0789, 43.2332] },
  { name: "Castres", coordinates: [2.2403, 43.6053] },
  { name: "Bourg-en-Bresse", coordinates: [5.2281, 46.2056] },
  { name: "Arras", coordinates: [2.7772, 50.2912] },
  { name: "Valence", coordinates: [4.8918, 44.9333] },
  { name: "Mâcon", coordinates: [4.8283, 46.3067] },
  { name: "Angoulême", coordinates: [0.1608, 45.6484] },
  { name: "Brive-la-Gaillarde", coordinates: [1.5333, 45.1583] },
  { name: "Salon-de-Provence", coordinates: [5.0983, 43.6403] },
  
  // Villes moyennes supplémentaires
  { name: "Bayonne", coordinates: [-1.4748, 43.4933] },
  { name: "Biarritz", coordinates: [-1.5586, 43.4832] },
  { name: "Anglet", coordinates: [-1.5211, 43.4919] },
  { name: "Dax", coordinates: [-1.0502, 43.7098] },
  { name: "Thonon-les-Bains", coordinates: [6.4794, 46.3711] },
  { name: "Annemasse", coordinates: [6.2367, 46.1944] },
  { name: "Cognac", coordinates: [-0.3292, 45.6950] },
  { name: "Rochefort", coordinates: [-0.9619, 45.9372] },
  { name: "Saintes", coordinates: [-0.6333, 45.7467] },
  { name: "Dieppe", coordinates: [1.0775, 49.9258] },
  { name: "Compiègne", coordinates: [2.8256, 49.4178] },
  { name: "Haguenau", coordinates: [7.7897, 48.8150] },
  { name: "Lens", coordinates: [2.8314, 50.4289] },
  { name: "Douai", coordinates: [3.0800, 50.3719] },
  { name: "Valenciennes", coordinates: [3.5233, 50.3592] },
  { name: "Maubeuge", coordinates: [3.9733, 50.2778] },
  { name: "Cambrai", coordinates: [3.2356, 50.1764] },
  { name: "Montbéliard", coordinates: [6.7981, 47.5097] },
  { name: "Oyonnax", coordinates: [5.6556, 46.2561] },
  { name: "Vienne", coordinates: [4.8772, 45.5256] },
  { name: "Romans-sur-Isère", coordinates: [5.0519, 45.0444] },
  { name: "Aubenas", coordinates: [4.3903, 44.6203] },
  { name: "Briançon", coordinates: [6.6389, 44.8989] },
  { name: "Orange", coordinates: [4.8083, 44.1358] },
  { name: "Carpentras", coordinates: [5.0489, 44.0556] },
  { name: "Cavaillon", coordinates: [5.0381, 43.8367] },
  { name: "Martigues", coordinates: [5.0531, 43.4047] },
  { name: "Istres", coordinates: [4.9878, 43.5136] },
  { name: "Aubagne", coordinates: [5.5708, 43.2928] },
  { name: "La Ciotat", coordinates: [5.6064, 43.1747] },
  { name: "Draguignan", coordinates: [6.4658, 43.5378] },
  { name: "Brignoles", coordinates: [6.0617, 43.4058] },
  { name: "Six-Fours-les-Plages", coordinates: [5.8381, 43.0917] },
  { name: "Menton", coordinates: [7.5006, 43.7747] },
  { name: "Porto-Vecchio", coordinates: [9.2792, 41.5911] },
  { name: "Corte", coordinates: [9.1506, 42.3056] },
  { name: "Thionville", coordinates: [6.1683, 49.3581] },
  { name: "Épernay", coordinates: [3.9594, 49.0425] },
  { name: "Châtellerault", coordinates: [0.5461, 46.8178] },
  { name: "Bergerac", coordinates: [0.4833, 44.8500] },
  { name: "Agen", coordinates: [0.6209, 44.2034] },
  { name: "Rodez", coordinates: [2.5752, 44.3503] },
  { name: "Aurillac", coordinates: [2.4419, 44.9264] },
  { name: "Cahors", coordinates: [1.4411, 44.4479] },
  { name: "Mende", coordinates: [3.5007, 44.5181] },
  { name: "Le Puy-en-Velay", coordinates: [3.8845, 45.0439] },
  { name: "Tulle", coordinates: [1.7711, 45.2664] },
  { name: "Guéret", coordinates: [1.8714, 46.1701] },
  { name: "Foix", coordinates: [1.6063, 42.9649] },
  { name: "Auch", coordinates: [0.5861, 43.6460] },
  { name: "Mont-de-Marsan", coordinates: [-0.4999, 43.8897] },
  { name: "Nevers", coordinates: [3.1615, 46.9896] },
  { name: "Auxerre", coordinates: [3.5731, 47.7976] },
  { name: "Sens", coordinates: [3.2833, 48.1978] },
  { name: "Joigny", coordinates: [3.3967, 47.9822] },
  { name: "Lons-le-Saunier", coordinates: [5.5542, 46.6753] },
  { name: "Vesoul", coordinates: [6.1544, 47.6211] },
  { name: "Bar-le-Duc", coordinates: [5.1608, 48.7722] },
  { name: "Verdun", coordinates: [5.3839, 49.1597] },
  { name: "Chaumont", coordinates: [5.1392, 48.1106] },
  { name: "Saint-Dizier", coordinates: [4.9492, 48.6358] },
  { name: "Privas", coordinates: [4.5994, 44.7353] },
  { name: "Laon", coordinates: [3.6238, 49.5637] },
  { name: "Soissons", coordinates: [3.3236, 49.3817] },
  { name: "Alençon", coordinates: [0.0897, 48.4328] },
  { name: "Flers", coordinates: [-0.5703, 48.7500] },
  { name: "Évreux", coordinates: [1.1510, 49.0246] },
  { name: "Louviers", coordinates: [1.1686, 49.2150] },
  { name: "Vernon", coordinates: [1.4856, 49.0928] },
];
