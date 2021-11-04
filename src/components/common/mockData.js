const dummyItems = [{
    "id": 1,
    "itemName": "Salmonella",
    "currentStock": 33
}, {
    "id": 2,
    "itemName": "Honeydew Melon",
    "currentStock": 66
}, {
    "id": 3,
    "itemName": "Ibutilide Fumarate",
    "currentStock": 78
}, {
    "id": 4,
    "itemName": "ranitidine hydrochloride",
    "currentStock": 18
}, {
    "id": 5,
    "itemName": "SERTRALINE",
    "currentStock": 67
}, {
    "id": 6,
    "itemName": "Allopurinol",
    "currentStock": 80
}, {
    "id": 7,
    "itemName": "Triclosan",
    "currentStock": 36
}, {
    "id": 8,
    "itemName": "Miconazole Nitrate",
    "currentStock": 5
}, {
    "id": 9,
    "itemName": "TITANIUM DIOXIDE, OCTINOXATE",
    "currentStock": 27
}, {
    "id": 10,
    "itemName": "GLYCERIN",
    "currentStock": 24
}, {
    "id": 11,
    "itemName": "American Sycamore",
    "currentStock": 18
}, {
    "id": 12,
    "itemName": "Levothyroxine Sodium",
    "currentStock": 15
}, {
    "id": 13,
    "itemName": "Ceftriaxone Sodium",
    "currentStock": 76
}, {
    "id": 14,
    "itemName": "OCTINOXATE, TITANIUM DIOXIDE, and ZINC OXIDE",
    "currentStock": 5
}, {
    "id": 15,
    "itemName": "Ethyl Alcohol",
    "currentStock": 56
}, {
    "id": 16,
    "itemName": "Atomoxetine hydrochloride",
    "currentStock": 11
}, {
    "id": 17,
    "itemName": "BENZALKONIUM CHLORIDE",
    "currentStock": 89
}, {
    "id": 18,
    "itemName": "Berberis vulgaris, Echinacea angustifolia, Coccus cacti, Kali muriaticum, Lycopodium clavatum, Nitricum acidum,",
    "currentStock": 79
}, {
    "id": 19,
    "itemName": "Dimethicone",
    "currentStock": 83
}, {
    "id": 20,
    "itemName": "Duloxetine",
    "currentStock": 40
}, {
    "id": 21,
    "itemName": "Benazepril Hydrochloride",
    "currentStock": 44
}, {
    "id": 22,
    "itemName": "Menthol",
    "currentStock": 44
}, {
    "id": 23,
    "itemName": "Octinoxate, octisalate, octocrylene, titanium dioxide",
    "currentStock": 67
}, {
    "id": 24,
    "itemName": "Anacardium orientale, Belladonna, Cactus grandiflorus, Calcarea carbonica, Carboneum sulphuratum, Cuprum aceticum, Magnesia phosphorica, Secale cornutum",
    "currentStock": 54
}, {
    "id": 25,
    "itemName": "Propranolol Hydrochloride",
    "currentStock": 69
}, {
    "id": 26,
    "itemName": "Acetaminophen, Diphenhydramine HCl and Phenylephrine HCL",
    "currentStock": 97
}, {
    "id": 27,
    "itemName": "Prednisone",
    "currentStock": 85
}, {
    "id": 28,
    "itemName": "Glyburide",
    "currentStock": 76
}, {
    "id": 29,
    "itemName": "PRAMIPEXOLE DIHYDROCHLORIDE",
    "currentStock": 55
}, {
    "id": 30,
    "itemName": "Salicylic Acid",
    "currentStock": 72
}, {
    "id": 31,
    "itemName": "OCTINOXATE, TITANIUM DIOXIDE",
    "currentStock": 8
}, {
    "id": 32,
    "itemName": "Diphenhydramine",
    "currentStock": 41
}, {
    "id": 33,
    "itemName": "Benzocaine",
    "currentStock": 74
}, {
    "id": 34,
    "itemName": "Norethindrone and Ethinyl Estradiol Tablets",
    "currentStock": 70
}, {
    "id": 35,
    "itemName": "Acetaminophen",
    "currentStock": 73
}, {
    "id": 36,
    "itemName": "Fluconazole",
    "currentStock": 84
}, {
    "id": 37,
    "itemName": "Barberry, potassium hydrate, buttercup, poison oak",
    "currentStock": 1
}, {
    "id": 38,
    "itemName": "Escitalopram Oxalate",
    "currentStock": 65
}, {
    "id": 39,
    "itemName": "Zinc Oxide",
    "currentStock": 18
}, {
    "id": 40,
    "itemName": "Alcohol",
    "currentStock": 21
}, {
    "id": 41,
    "itemName": "penbutolol sulfate",
    "currentStock": 10
}, {
    "id": 42,
    "itemName": "Lamotrigine",
    "currentStock": 27
}, {
    "id": 43,
    "itemName": "IBUPROFEN, METHYL SALICYLATE, MENTHOL, CAPSAICIN",
    "currentStock": 22
}, {
    "id": 44,
    "itemName": "Acetaminophen",
    "currentStock": 57
}, {
    "id": 45,
    "itemName": "Digoxin",
    "currentStock": 23
}, {
    "id": 46,
    "itemName": "TITANIUM DIOXIDE, OCTINOXATE, and ZINC OXIDE",
    "currentStock": 65
}, {
    "id": 47,
    "itemName": "benzalkonium chloride",
    "currentStock": 5
}, {
    "id": 48,
    "itemName": "Hydralazine Hydrochloride",
    "currentStock": 41
}, {
    "id": 49,
    "itemName": "Alcohol",
    "currentStock": 40
}, {
    "id": 50,
    "itemName": "Simethicone",
    "currentStock": 44
}, {
    "id": 51,
    "itemName": "Aspirin",
    "currentStock": 74
}, {
    "id": 52,
    "itemName": "OCTINOXATE, OCTOCRYLENE, and TITANIUM DIOXIDE",
    "currentStock": 12
}, {
    "id": 53,
    "itemName": "Not applicable",
    "currentStock": 94
}, {
    "id": 54,
    "itemName": "Adenosine",
    "currentStock": 23
}, {
    "id": 55,
    "itemName": "Chlorpromazine Hydrochloride",
    "currentStock": 97
}, {
    "id": 56,
    "itemName": "risperidone",
    "currentStock": 22
}, {
    "id": 57,
    "itemName": "Butalbital, Acetaminophen and Caffeine",
    "currentStock": 1
}, {
    "id": 58,
    "itemName": "Metformin Hydrochloride",
    "currentStock": 74
}, {
    "id": 59,
    "itemName": "Irbesartan",
    "currentStock": 36
}, {
    "id": 60,
    "itemName": "Ziprasidone Hydrochloride",
    "currentStock": 43
}, {
    "id": 61,
    "itemName": "Yellow Jacket hymenoptera venom Venomil Diagnostic",
    "currentStock": 90
}, {
    "id": 62,
    "itemName": "Isoxsuprine hydrochloride",
    "currentStock": 3
}, {
    "id": 63,
    "itemName": "Treatment Set TS335657",
    "currentStock": 87
}, {
    "id": 64,
    "itemName": "Alcohol",
    "currentStock": 30
}, {
    "id": 65,
    "itemName": "cetylpyridinium chloride",
    "currentStock": 64
}, {
    "id": 66,
    "itemName": "lisdexamfetamine dimesylate",
    "currentStock": 59
}, {
    "id": 67,
    "itemName": "desonide",
    "currentStock": 76
}, {
    "id": 68,
    "itemName": "Loperamide HCl",
    "currentStock": 33
}, {
    "id": 69,
    "itemName": "Lovastatin",
    "currentStock": 85
}, {
    "id": 70,
    "itemName": "Calcium carbonate",
    "currentStock": 58
}, {
    "id": 71,
    "itemName": "Clopidogrel bisulfate",
    "currentStock": 21
}, {
    "id": 72,
    "itemName": "Pollens - Grasses, Southern Grass Mix",
    "currentStock": 44
}, {
    "id": 73,
    "itemName": "Amitriptyline Hydrochloride",
    "currentStock": 16
}, {
    "id": 74,
    "itemName": "Disulfiram",
    "currentStock": 39
}, {
    "id": 75,
    "itemName": "Amoxicillin and Clavulanate Potassium",
    "currentStock": 96
}, {
    "id": 76,
    "itemName": "OXYGEN",
    "currentStock": 76
}, {
    "id": 77,
    "itemName": "Menthol Eucalyptus",
    "currentStock": 12
}, {
    "id": 78,
    "itemName": "malarial plasmodium group immunoserum rabbit",
    "currentStock": 87
}, {
    "id": 79,
    "itemName": "ciprofloxacin",
    "currentStock": 59
}, {
    "id": 80,
    "itemName": "White Petroleum",
    "currentStock": 49
}, {
    "id": 81,
    "itemName": "Quetiapine fumarate",
    "currentStock": 10
}, {
    "id": 82,
    "itemName": "DIMETHICONE",
    "currentStock": 41
}, {
    "id": 83,
    "itemName": "Benzonatate",
    "currentStock": 16
}, {
    "id": 84,
    "itemName": "Furosemide",
    "currentStock": 93
}, {
    "id": 85,
    "itemName": "Ciprofloxacin Hydrochloride",
    "currentStock": 18
}, {
    "id": 86,
    "itemName": "Melaleuca Pollen",
    "currentStock": 18
}, {
    "id": 87,
    "itemName": "Bethanechol Chloride",
    "currentStock": 38
}, {
    "id": 88,
    "itemName": "SULFUR",
    "currentStock": 85
}, {
    "id": 89,
    "itemName": "Alcohol",
    "currentStock": 60
}, {
    "id": 90,
    "itemName": "DOCUSATE CALCIUM",
    "currentStock": 39
}, {
    "id": 91,
    "itemName": "Clonazepam",
    "currentStock": 51
}, {
    "id": 92,
    "itemName": "Isoniazid",
    "currentStock": 43
}, {
    "id": 93,
    "itemName": "Neutral Sodium Fluoride",
    "currentStock": 94
}, {
    "id": 94,
    "itemName": "Iodixanol",
    "currentStock": 89
}, {
    "id": 95,
    "itemName": "OCTINOXATE, TITANIUM DIOXIDE",
    "currentStock": 76
}, {
    "id": 96,
    "itemName": "HEPARIN SODIUM",
    "currentStock": 24
}, {
    "id": 97,
    "itemName": "Citalopram Hydrobromide",
    "currentStock": 67
}, {
    "id": 98,
    "itemName": "ALCOHOL",
    "currentStock": 87
}, {
    "id": 99,
    "itemName": "Mugwort",
    "currentStock": 84
}, {
    "id": 100,
    "itemName": "Povidone-iodine",
    "currentStock": 15
}]

const mockLists = [{
    "id": 1,
    "name": "Orange",
    "currentStock": 20,
    "items": [
        {
            "id": 10,
            "quantity": 5,
            "name": "Dove Men plus Care"
        },
        {
            "id": 10,
            "quantity": 5,
            "name": "Testosterone Enanthate"
        },
        {
            "id": 12,
            "quantity": 3,
            "name": "ACETAMINOPHEN"
        }
    ],
    "createdBy": 5,
    "editedBy": 7,
    "lastUpdated": "2020-11-12 11:33:08"
}, {
    "id": 2,
    "name": "Fuscia",
    "currentStock": 16,
    "items": [
        {
            "id": 2,
            "quantity": 1,
            "name": "butalbital, acetominophen and caffeine"
        },
        {
            "id": 4,
            "quantity": 1,
            "name": "Raspberry Scented Hand Sanitizer"
        },
        {
            "id": 13,
            "quantity": 5,
            "name": "Red Delicious Apple"
        }
    ],
    "createdBy": 1,
    "editedBy": 7,
    "lastUpdated": "2021-01-07 19:56:39"
}, {
    "id": 3,
    "name": "Indigo",
    "currentStock": 10,
    "items": [
        {
            "id": 17,
            "quantity": 2,
            "name": "Metformin Hydrochloride"
        },
        {
            "id": 13,
            "quantity": 5,
            "name": "Dextroamphetamine Saccharate, Amphetamine Aspartate, Dextroamphetamine Sulfate, and Amphetamine Sulfate"
        },
        {
            "id": 21,
            "quantity": 4,
            "name": "Hydrogen Peroxide"
        }
    ],
    "createdBy": 10,
    "editedBy": 6,
    "lastUpdated": "2020-11-22 20:46:10"
}, {
    "id": 4,
    "name": "Mauv",
    "currentStock": 21,
    "items": [
        {
            "id": 2,
            "quantity": 4,
            "name": "DR. BABOR DERMA CELLULAR Ultimate Firming Decollete Mask"
        },
        {
            "id": 24,
            "quantity": 4,
            "name": "Ear Wax Remover"
        },
        {
            "id": 24,
            "quantity": 3,
            "name": "JET LAG RELIEF"
        },
        {
            "id": 11,
            "quantity": 3,
            "name": "LESCOL"
        }
    ],
    "createdBy": 2,
    "editedBy": 2,
    "lastUpdated": "2020-12-22 00:01:44"
}, {
    "id": 5,
    "name": "Mauv",
    "currentStock": 12,
    "items": [
        {
            "id": 22,
            "quantity": 3,
            "name": "Ketoprofen"
        },
        {
            "id": 1,
            "quantity": 2,
            "name": "Paroxetine"
        },
        {
            "id": 14,
            "quantity": 3,
            "name": "WHITE FLOWER ANALGESIC BALM FLORAL SCENTED"
        },
        {
            "id": 14,
            "quantity": 5,
            "name": "Cisatracurium Besylate"
        }
    ],
    "createdBy": 6,
    "editedBy": 7,
    "lastUpdated": "2021-05-17 06:51:53"
}, {
    "id": 6,
    "name": "Goldenrod",
    "currentStock": 4,
    "items": [
        {
            "id": 1,
            "quantity": 3,
            "name": "MoodBrite"
        },
        {
            "id": 9,
            "quantity": 3,
            "name": "Mistletoe and Mint Antibacterial Foaming Hand Wash"
        },
        {
            "id": 21,
            "quantity": 3,
            "name": "Standardized Mite Mix, Dermatophagoides pteronyssinus and Dermatophagoides farinae, 30000 AU per mL"
        },
        {
            "id": 15,
            "quantity": 4,
            "name": "Metformin Hydrochloride"
        }
    ],
    "createdBy": 5,
    "editedBy": 9,
    "lastUpdated": "2021-04-09 13:27:57"
}, {
    "id": 7,
    "name": "Pink",
    "currentStock": 13,
    "items": [
        {
            "id": 19,
            "quantity": 4,
            "name": "LAMICTAL"
        },
        {
            "id": 1,
            "quantity": 4,
            "name": "Hypertenevide-12.5"
        },
        {
            "id": 20,
            "quantity": 3,
            "name": "DIANEAL PD-2 with Dextrose"
        },
        {
            "id": 22,
            "quantity": 3,
            "name": "Fungicure"
        }
    ],
    "createdBy": 4,
    "editedBy": 6,
    "lastUpdated": "2021-04-24 22:08:21"
}, {
    "id": 8,
    "name": "Pink",
    "currentStock": 9,
    "items": [
        {
            "id": 20,
            "quantity": 5,
            "name": "RAPAFLO"
        },
        {
            "id": 15,
            "quantity": 1,
            "name": "Prochlorperazine Maleate"
        }
    ],
    "createdBy": 1,
    "editedBy": 6,
    "lastUpdated": "2021-05-29 05:17:41"
}, {
    "id": 9,
    "name": "Orange",
    "currentStock": 6,
    "items": [
        {
            "id": 19,
            "quantity": 4,
            "name": "Hydroxyzine Pamoate"
        },
        {
            "id": 14,
            "quantity": 5,
            "name": "Asthma Therapy"
        },
        {
            "id": 21,
            "quantity": 2,
            "name": "CPDA-1"
        },
        {
            "id": 1,
            "quantity": 3,
            "name": "Olanzapine"
        },
        {
            "id": 9,
            "quantity": 5,
            "name": "Escitalopram"
        }
    ],
    "createdBy": 4,
    "editedBy": 7,
    "lastUpdated": "2021-03-01 19:15:03"
}, {
    "id": 10,
    "name": "Crimson",
    "currentStock": 15,
    "items": [
        {
            "id": 1,
            "quantity": 5,
            "name": "Ferrum Metallicum"
        },
        {
            "id": 18,
            "quantity": 3,
            "name": "Neutrogena Skin Clearing"
        },
        {
            "id": 2,
            "quantity": 5,
            "name": "naproxen sodium"
        }
    ],
    "createdBy": 4,
    "editedBy": 6,
    "lastUpdated": "2021-04-02 17:17:50"
}]
const mockTransactions = [{
    "id": 1,
    "itemId": 3,
    "type": "withdraw",
    "change": 42,
    "user": 2,
    "timestamp": "2021-09-21 00:23:18"
}, {
    "id": 2,
    "itemId": 4,
    "type": "withdraw",
    "change": -50,
    "user": 2,
    "timestamp": "2021-09-18 12:05:10"
}, {
    "id": 3,
    "itemId": 2,
    "type": "withdraw",
    "change": -17,
    "user": 2,
    "timestamp": "2021-10-06 03:59:34"
}, {
    "id": 4,
    "itemId": 3,
    "type": "restock",
    "change": 22,
    "user": 2,
    "timestamp": "2021-09-23 18:42:50"
}, {
    "id": 5,
    "itemId": 3,
    "type": "withdraw",
    "change": -47,
    "user": 2,
    "timestamp": "2021-09-21 03:51:51"
}, {
    "id": 6,
    "itemId": 3,
    "type": "restock",
    "change": 2,
    "user": 2,
    "timestamp": "2021-09-19 03:18:48"
}, {
    "id": 7,
    "itemId": 3,
    "type": "withdraw",
    "change": 22,
    "user": 2,
    "timestamp": "2021-09-05 11:56:13"
}, {
    "id": 8,
    "itemId": 2,
    "type": "restock",
    "change": 9,
    "user": 1,
    "timestamp": "2021-09-15 13:51:38"
}, {
    "id": 9,
    "itemId": 1,
    "type": "restock",
    "change": -38,
    "user": 2,
    "timestamp": "2021-09-20 08:48:56"
}, {
    "id": 10,
    "itemId": 1,
    "type": "withdraw",
    "change": 12,
    "user": 2,
    "timestamp": "2021-10-10 13:52:28"
}, {
    "id": 11,
    "itemId": 4,
    "type": "withdraw",
    "change": 34,
    "user": 2,
    "timestamp": "2021-10-07 21:59:11"
}, {
    "id": 12,
    "itemId": 1,
    "type": "restock",
    "change": 38,
    "user": 1,
    "timestamp": "2021-10-11 10:53:45"
}, {
    "id": 13,
    "itemId": 1,
    "type": "restock",
    "change": -32,
    "user": 2,
    "timestamp": "2021-10-08 04:18:50"
}, {
    "id": 14,
    "itemId": 1,
    "type": "restock",
    "change": 2,
    "user": 2,
    "timestamp": "2021-09-06 10:20:37"
}, {
    "id": 15,
    "itemId": 1,
    "type": "withdraw",
    "change": -45,
    "user": 2,
    "timestamp": "2021-09-15 05:27:01"
}, {
    "id": 16,
    "itemId": 1,
    "type": "withdraw",
    "change": -39,
    "user": 2,
    "timestamp": "2021-09-26 21:31:10"
}, {
    "id": 17,
    "itemId": 2,
    "type": "withdraw",
    "change": -25,
    "user": 2,
    "timestamp": "2021-09-13 22:01:40"
}, {
    "id": 18,
    "itemId": 1,
    "type": "restock",
    "change": -3,
    "user": 2,
    "timestamp": "2021-09-13 08:11:36"
}, {
    "id": 19,
    "itemId": 1,
    "type": "withdraw",
    "change": 1,
    "user": 2,
    "timestamp": "2021-09-11 01:59:44"
}, {
    "id": 20,
    "itemId": 4,
    "type": "restock",
    "change": -10,
    "user": 2,
    "timestamp": "2021-10-03 02:24:09"
}, {
    "id": 21,
    "itemId": 2,
    "type": "restock",
    "change": 41,
    "user": 2,
    "timestamp": "2021-09-07 22:05:59"
}, {
    "id": 22,
    "itemId": 1,
    "type": "withdraw",
    "change": 1,
    "user": 1,
    "timestamp": "2021-10-06 00:14:09"
}, {
    "id": 23,
    "itemId": 1,
    "type": "restock",
    "change": -3,
    "user": 1,
    "timestamp": "2021-09-08 11:23:57"
}, {
    "id": 24,
    "itemId": 3,
    "type": "withdraw",
    "change": 12,
    "user": 1,
    "timestamp": "2021-09-02 13:42:30"
}, {
    "id": 25,
    "itemId": 4,
    "type": "restock",
    "change": 47,
    "user": 2,
    "timestamp": "2021-09-24 05:32:33"
}, {
    "id": 26,
    "itemId": 4,
    "type": "withdraw",
    "change": -47,
    "user": 1,
    "timestamp": "2021-09-06 14:47:05"
}, {
    "id": 27,
    "itemId": 3,
    "type": "restock",
    "change": -42,
    "user": 2,
    "timestamp": "2021-09-22 15:42:33"
}, {
    "id": 28,
    "itemId": 3,
    "type": "withdraw",
    "change": -24,
    "user": 2,
    "timestamp": "2021-09-16 03:52:16"
}, {
    "id": 29,
    "itemId": 2,
    "type": "withdraw",
    "change": 3,
    "user": 2,
    "timestamp": "2021-09-20 08:36:54"
}, {
    "id": 30,
    "itemId": 1,
    "type": "restock",
    "change": 0,
    "user": 2,
    "timestamp": "2021-09-17 16:29:40"
}, {
    "id": 31,
    "itemId": 4,
    "type": "restock",
    "change": 31,
    "user": 2,
    "timestamp": "2021-09-07 19:32:04"
}, {
    "id": 32,
    "itemId": 4,
    "type": "restock",
    "change": -37,
    "user": 2,
    "timestamp": "2021-09-15 21:00:09"
}, {
    "id": 33,
    "itemId": 1,
    "type": "withdraw",
    "change": 3,
    "user": 2,
    "timestamp": "2021-09-05 01:16:35"
}, {
    "id": 34,
    "itemId": 1,
    "type": "withdraw",
    "change": 17,
    "user": 2,
    "timestamp": "2021-09-09 23:40:16"
}, {
    "id": 35,
    "itemId": 2,
    "type": "withdraw",
    "change": -2,
    "user": 2,
    "timestamp": "2021-10-08 04:41:40"
}, {
    "id": 36,
    "itemId": 3,
    "type": "restock",
    "change": -46,
    "user": 2,
    "timestamp": "2021-09-11 03:22:33"
}, {
    "id": 37,
    "itemId": 2,
    "type": "withdraw",
    "change": 46,
    "user": 1,
    "timestamp": "2021-10-09 22:16:26"
}, {
    "id": 38,
    "itemId": 4,
    "type": "withdraw",
    "change": 49,
    "user": 2,
    "timestamp": "2021-10-02 06:26:48"
}, {
    "id": 39,
    "itemId": 4,
    "type": "restock",
    "change": -20,
    "user": 1,
    "timestamp": "2021-10-10 06:45:15"
}, {
    "id": 40,
    "itemId": 2,
    "type": "restock",
    "change": 31,
    "user": 1,
    "timestamp": "2021-10-04 12:20:31"
}, {
    "id": 41,
    "itemId": 1,
    "type": "withdraw",
    "change": -9,
    "user": 2,
    "timestamp": "2021-09-16 13:22:12"
}, {
    "id": 42,
    "itemId": 2,
    "type": "restock",
    "change": -19,
    "user": 2,
    "timestamp": "2021-09-24 23:27:08"
}, {
    "id": 43,
    "itemId": 4,
    "type": "withdraw",
    "change": 49,
    "user": 2,
    "timestamp": "2021-09-29 10:41:15"
}, {
    "id": 44,
    "itemId": 2,
    "type": "withdraw",
    "change": 39,
    "user": 2,
    "timestamp": "2021-09-30 08:45:11"
}, {
    "id": 45,
    "itemId": 4,
    "type": "withdraw",
    "change": -2,
    "user": 2,
    "timestamp": "2021-10-03 02:05:02"
}, {
    "id": 46,
    "itemId": 1,
    "type": "withdraw",
    "change": -47,
    "user": 1,
    "timestamp": "2021-10-09 21:40:25"
}, {
    "id": 47,
    "itemId": 1,
    "type": "withdraw",
    "change": -8,
    "user": 2,
    "timestamp": "2021-09-01 11:18:52"
}, {
    "id": 48,
    "itemId": 3,
    "type": "withdraw",
    "change": -38,
    "user": 2,
    "timestamp": "2021-09-20 19:31:13"
}, {
    "id": 49,
    "itemId": 3,
    "type": "restock",
    "change": -23,
    "user": 1,
    "timestamp": "2021-09-18 21:16:51"
}, {
    "id": 50,
    "itemId": 1,
    "type": "withdraw",
    "change": -30,
    "user": 2,
    "timestamp": "2021-09-14 22:54:36"
}, {
    "id": 51,
    "itemId": 2,
    "type": "withdraw",
    "change": 32,
    "user": 2,
    "timestamp": "2021-10-03 18:58:35"
}, {
    "id": 52,
    "itemId": 4,
    "type": "withdraw",
    "change": -17,
    "user": 1,
    "timestamp": "2021-09-26 10:00:25"
}, {
    "id": 53,
    "itemId": 3,
    "type": "restock",
    "change": 19,
    "user": 1,
    "timestamp": "2021-09-29 01:30:30"
}, {
    "id": 54,
    "itemId": 2,
    "type": "withdraw",
    "change": -33,
    "user": 2,
    "timestamp": "2021-09-07 13:53:07"
}, {
    "id": 55,
    "itemId": 4,
    "type": "withdraw",
    "change": -26,
    "user": 2,
    "timestamp": "2021-10-11 08:40:37"
}, {
    "id": 56,
    "itemId": 1,
    "type": "withdraw",
    "change": -33,
    "user": 1,
    "timestamp": "2021-10-10 10:06:09"
}, {
    "id": 57,
    "itemId": 4,
    "type": "withdraw",
    "change": -20,
    "user": 2,
    "timestamp": "2021-09-18 11:58:58"
}, {
    "id": 58,
    "itemId": 1,
    "type": "restock",
    "change": -33,
    "user": 1,
    "timestamp": "2021-10-10 22:16:40"
}, {
    "id": 59,
    "itemId": 3,
    "type": "withdraw",
    "change": -39,
    "user": 2,
    "timestamp": "2021-10-04 10:49:00"
}, {
    "id": 60,
    "itemId": 3,
    "type": "withdraw",
    "change": -24,
    "user": 2,
    "timestamp": "2021-09-09 11:39:26"
}, {
    "id": 61,
    "itemId": 3,
    "type": "withdraw",
    "change": -8,
    "user": 1,
    "timestamp": "2021-09-16 12:09:27"
}, {
    "id": 62,
    "itemId": 1,
    "type": "restock",
    "change": 45,
    "user": 2,
    "timestamp": "2021-10-09 04:07:48"
}, {
    "id": 63,
    "itemId": 2,
    "type": "withdraw",
    "change": -38,
    "user": 1,
    "timestamp": "2021-10-12 15:41:56"
}, {
    "id": 64,
    "itemId": 2,
    "type": "withdraw",
    "change": -48,
    "user": 2,
    "timestamp": "2021-09-15 09:17:46"
}, {
    "id": 65,
    "itemId": 2,
    "type": "withdraw",
    "change": -18,
    "user": 2,
    "timestamp": "2021-09-15 00:29:28"
}, {
    "id": 66,
    "itemId": 4,
    "type": "withdraw",
    "change": -46,
    "user": 1,
    "timestamp": "2021-09-24 05:00:10"
}, {
    "id": 67,
    "itemId": 4,
    "type": "restock",
    "change": 41,
    "user": 2,
    "timestamp": "2021-10-01 23:09:47"
}, {
    "id": 68,
    "itemId": 2,
    "type": "restock",
    "change": 47,
    "user": 2,
    "timestamp": "2021-09-03 09:58:47"
}, {
    "id": 69,
    "itemId": 1,
    "type": "restock",
    "change": -31,
    "user": 2,
    "timestamp": "2021-09-27 12:08:04"
}, {
    "id": 70,
    "itemId": 1,
    "type": "restock",
    "change": 23,
    "user": 2,
    "timestamp": "2021-09-17 23:27:57"
}, {
    "id": 71,
    "itemId": 4,
    "type": "withdraw",
    "change": -46,
    "user": 1,
    "timestamp": "2021-09-29 11:06:32"
}, {
    "id": 72,
    "itemId": 2,
    "type": "restock",
    "change": -28,
    "user": 2,
    "timestamp": "2021-10-09 07:20:29"
}, {
    "id": 73,
    "itemId": 3,
    "type": "restock",
    "change": -13,
    "user": 1,
    "timestamp": "2021-10-04 00:43:18"
}, {
    "id": 74,
    "itemId": 3,
    "type": "restock",
    "change": 43,
    "user": 1,
    "timestamp": "2021-09-02 13:58:46"
}, {
    "id": 75,
    "itemId": 1,
    "type": "restock",
    "change": 19,
    "user": 2,
    "timestamp": "2021-09-22 08:47:30"
}, {
    "id": 76,
    "itemId": 1,
    "type": "restock",
    "change": 44,
    "user": 2,
    "timestamp": "2021-09-01 19:25:49"
}, {
    "id": 77,
    "itemId": 1,
    "type": "withdraw",
    "change": -50,
    "user": 2,
    "timestamp": "2021-09-11 21:34:57"
}, {
    "id": 78,
    "itemId": 1,
    "type": "restock",
    "change": -1,
    "user": 2,
    "timestamp": "2021-09-14 01:32:34"
}, {
    "id": 79,
    "itemId": 2,
    "type": "restock",
    "change": 28,
    "user": 1,
    "timestamp": "2021-10-12 15:49:08"
}, {
    "id": 80,
    "itemId": 1,
    "type": "withdraw",
    "change": 5,
    "user": 1,
    "timestamp": "2021-09-25 12:13:55"
}, {
    "id": 81,
    "itemId": 2,
    "type": "restock",
    "change": 21,
    "user": 1,
    "timestamp": "2021-09-18 08:58:30"
}, {
    "id": 82,
    "itemId": 4,
    "type": "withdraw",
    "change": 46,
    "user": 2,
    "timestamp": "2021-10-11 11:14:55"
}, {
    "id": 83,
    "itemId": 2,
    "type": "withdraw",
    "change": 36,
    "user": 2,
    "timestamp": "2021-09-21 01:14:48"
}, {
    "id": 84,
    "itemId": 4,
    "type": "restock",
    "change": -46,
    "user": 2,
    "timestamp": "2021-09-15 16:45:20"
}, {
    "id": 85,
    "itemId": 4,
    "type": "withdraw",
    "change": -45,
    "user": 1,
    "timestamp": "2021-09-09 21:21:20"
}, {
    "id": 86,
    "itemId": 1,
    "type": "withdraw",
    "change": 48,
    "user": 1,
    "timestamp": "2021-09-10 21:12:04"
}, {
    "id": 87,
    "itemId": 1,
    "type": "restock",
    "change": -9,
    "user": 1,
    "timestamp": "2021-09-03 12:03:50"
}, {
    "id": 88,
    "itemId": 2,
    "type": "restock",
    "change": 20,
    "user": 2,
    "timestamp": "2021-09-28 10:31:20"
}, {
    "id": 89,
    "itemId": 4,
    "type": "withdraw",
    "change": -17,
    "user": 1,
    "timestamp": "2021-09-24 21:08:40"
}, {
    "id": 90,
    "itemId": 4,
    "type": "restock",
    "change": -46,
    "user": 1,
    "timestamp": "2021-09-26 09:24:49"
}, {
    "id": 91,
    "itemId": 4,
    "type": "withdraw",
    "change": -32,
    "user": 2,
    "timestamp": "2021-10-11 17:02:15"
}, {
    "id": 92,
    "itemId": 4,
    "type": "withdraw",
    "change": 45,
    "user": 1,
    "timestamp": "2021-09-03 05:15:53"
}, {
    "id": 93,
    "itemId": 4,
    "type": "restock",
    "change": -17,
    "user": 2,
    "timestamp": "2021-09-05 00:14:20"
}, {
    "id": 94,
    "itemId": 2,
    "type": "restock",
    "change": -44,
    "user": 2,
    "timestamp": "2021-10-03 20:14:39"
}, {
    "id": 95,
    "itemId": 2,
    "type": "restock",
    "change": 43,
    "user": 2,
    "timestamp": "2021-09-13 16:56:56"
}, {
    "id": 96,
    "itemId": 2,
    "type": "restock",
    "change": -48,
    "user": 1,
    "timestamp": "2021-09-23 09:36:54"
}, {
    "id": 97,
    "itemId": 3,
    "type": "restock",
    "change": -6,
    "user": 1,
    "timestamp": "2021-09-07 17:04:42"
}, {
    "id": 98,
    "itemId": 2,
    "type": "withdraw",
    "change": 23,
    "user": 2,
    "timestamp": "2021-09-16 15:11:31"
}, {
    "id": 99,
    "itemId": 2,
    "type": "restock",
    "change": -7,
    "user": 1,
    "timestamp": "2021-09-17 22:20:47"
}, {
    "id": 100,
    "itemId": 2,
    "type": "withdraw",
    "change": -33,
    "user": 1,
    "timestamp": "2021-09-14 05:35:00"
}]
const mockLocations = [
    {
        id: 1,
        organisationId: 5,
        name: "Chertsey",
        createdBy: 18,
        editedBy: 100,
        lastUpdated: "2021-06-19 04:26:06"
    },
    {
        id: 2,
        organisationId: 2,
        name: "Ashford",
        createdBy: 63,
        editedBy: 62,
        lastUpdated: "2020-12-11 12:45:21"
    },
    {
        id: 3,
        organisationId: 1,
        name: "Farnborough",
        createdBy: 7,
        editedBy: 75,
        lastUpdated: "2021-06-10 03:08:49"
    },
    {
        id: 4,
        organisationId: 1,
        name: "Polegate",
        createdBy: 37,
        editedBy: 8,
        lastUpdated: "2021-05-09 10:59:11"
    },
    {
        id: 5,
        organisationId: 4,
        name: "Gatwick",
        createdBy: 65,
        editedBy: 68,
        lastUpdated: "2021-04-08 13:19:48"
    },
    {
        id: 6,
        organisationId: 5,
        name: "Tangmere",
        createdBy: 19,
        editedBy: 13,
        lastUpdated: "2021-01-03 10:08:13"
    },
    {
        id: 7,
        organisationId: 5,
        name: "Brighton",
        createdBy: 47,
        editedBy: 24,
        lastUpdated: "2021-10-13 11:21:00"
    },
    {
        id: 8,
        organisationId: 1,
        name: "Godalming",
        createdBy: 23,
        editedBy: 71,
        lastUpdated: "2021-01-31 12:02:31"
    },
    {
        id: 9,
        organisationId: 3,
        name: "Paddock Wood",
        createdBy: 99,
        editedBy: 31,
        lastUpdated: "2021-10-06 17:14:05"
    },
    {
        id: 10,
        organisationId: 4,
        name: "Hastings",
        createdBy: 90,
        editedBy: 94,
        lastUpdated: "2021-04-28 08:04:56"
    }
]
const mockSearchOptions = [
    {
        label: "Items",
        link: "/items",
        description: "Add or edit items"
    },
    {
        label: "Home",
        link: "/",
        description: "See an overview of stock levels"
    },
    {
        label: "Dashboard",
        link: "/",
        description: "See an overview of stock levels"
    },
    {
        label: "Stock",
        link: "/stock",
        description: "See stock levels in detail"
    },
    {
        label: "Withdraw",
        link: "/withdraw",
        description: "Withdraw stock"
    },
    {
        label: "Restock",
        link: "/restock",
        description: "Add stock"
    },
]

export {mockLocations, mockLists, mockSearchOptions};