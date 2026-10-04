import { TimelineUniverse } from "@/types/timeline";

export const mcuTimeline: TimelineUniverse = {
  id: "mcu",
  name: "Marvel Cinematic Universe",
  shortName: "MCU",
  description: "Explore the complete chronological journey of the Marvel Cinematic Universe from the dawn of time to the Multiverse Saga.",
  accentColor: "#EAB308",
  defaultFilterId: "all",
  filters: [
    { id: "all", label: "All Items", description: "All movies, series, and specials" },
    { id: "sacred", label: "Sacred Timeline", description: "Main continuity only" },
    { id: "anchors", label: "Anchors Only", description: "Major landmark events" },
    { id: "tva", label: "TVA & Outside Time", description: "TVA and timeless realm events" },
    { id: "multiverse", label: "Multiverse", description: "Alternate branches and Earths" },
  ],
  nodes: [
  {
    "id": "mcu-eyes-wakanda",
    "type": "mediaNode",
    "position": {
      "x": 80,
      "y": 450
    },
    "data": {
      "id": "mcu-eyes-wakanda",
      "tmdbId": 241388,
      "mediaType": "tv",
      "title": "Eyes of Wakanda",
      "releaseYear": "2025",
      "chronologicalYear": "1260 BC–1896",
      "posterPath": "/yuOfb1MgnaGPa4guzV0n1IFYVGN.jpg",
      "rating": 7.5,
      "phase": "Phase 6",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-cap-1",
    "type": "mediaNode",
    "position": {
      "x": 215,
      "y": 450
    },
    "data": {
      "id": "mcu-cap-1",
      "tmdbId": 1771,
      "mediaType": "movie",
      "title": "Captain America: The First Avenger",
      "releaseYear": "2011",
      "chronologicalYear": "1943–1945",
      "posterPath": "/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg",
      "rating": 7,
      "phase": "Phase 1",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-agent-carter-one-shot",
    "type": "mediaNode",
    "position": {
      "x": 350,
      "y": 450
    },
    "data": {
      "id": "mcu-agent-carter-one-shot",
      "tmdbId": 231362,
      "mediaType": "movie",
      "title": "Agent Carter: One-Shot",
      "releaseYear": "2013",
      "chronologicalYear": "1946",
      "posterPath": "/4vFKKWPvCVDJTOWiwReBfpAMScP.jpg",
      "rating": 7.2,
      "phase": "Phase 2",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-cap-marvel",
    "type": "mediaNode",
    "position": {
      "x": 485,
      "y": 450
    },
    "data": {
      "id": "mcu-cap-marvel",
      "tmdbId": 299537,
      "mediaType": "movie",
      "title": "Captain Marvel",
      "releaseYear": "2019",
      "chronologicalYear": "1995",
      "posterPath": "/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg",
      "rating": 6.9,
      "phase": "Phase 3",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-ironman-1",
    "type": "mediaNode",
    "position": {
      "x": 620,
      "y": 450
    },
    "data": {
      "id": "mcu-ironman-1",
      "tmdbId": 1726,
      "mediaType": "movie",
      "title": "Iron Man",
      "releaseYear": "2008",
      "chronologicalYear": "2008",
      "posterPath": "/78lPtwv72eTNqFW9COBYI0dWDJa.jpg",
      "rating": 7.6,
      "phase": "Phase 1",
      "canonType": "sacred",
      "branchName": "Sacred Timeline",
      "isAnchor": true,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-ironman-2",
    "type": "mediaNode",
    "position": {
      "x": 800,
      "y": 450
    },
    "data": {
      "id": "mcu-ironman-2",
      "tmdbId": 10138,
      "mediaType": "movie",
      "title": "Iron Man 2",
      "releaseYear": "2010",
      "chronologicalYear": "2010",
      "posterPath": "/6WBeq4fCfn7AN0o21W9qNcRF2l9.jpg",
      "rating": 6.8,
      "phase": "Phase 1",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-hulk",
    "type": "mediaNode",
    "position": {
      "x": 935,
      "y": 450
    },
    "data": {
      "id": "mcu-hulk",
      "tmdbId": 1724,
      "mediaType": "movie",
      "title": "The Incredible Hulk",
      "releaseYear": "2008",
      "chronologicalYear": "2010",
      "posterPath": "/gKzYx79y0AQTL4UAk1cBQJ3nvrm.jpg",
      "rating": 6.2,
      "phase": "Phase 1",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-thor-one-shot",
    "type": "mediaNode",
    "position": {
      "x": 1070,
      "y": 450
    },
    "data": {
      "id": "mcu-thor-one-shot",
      "tmdbId": 231361,
      "mediaType": "movie",
      "title": "A Funny Thing Happened on the Way to Thor's Hammer",
      "releaseYear": "2011",
      "chronologicalYear": "2011",
      "posterPath": "/njrOqsmFH4pxBrhcoslqLfw2OGk.jpg",
      "rating": 7,
      "phase": "Phase 1",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-thor-1",
    "type": "mediaNode",
    "position": {
      "x": 1205,
      "y": 450
    },
    "data": {
      "id": "mcu-thor-1",
      "tmdbId": 10195,
      "mediaType": "movie",
      "title": "Thor",
      "releaseYear": "2011",
      "chronologicalYear": "2011",
      "posterPath": "/prSfAi1xGrhLQNxVSUFh61xQ4Qy.jpg",
      "rating": 6.8,
      "phase": "Phase 1",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-consultant",
    "type": "mediaNode",
    "position": {
      "x": 1340,
      "y": 450
    },
    "data": {
      "id": "mcu-consultant",
      "tmdbId": 231360,
      "mediaType": "movie",
      "title": "The Consultant",
      "releaseYear": "2011",
      "chronologicalYear": "2011",
      "posterPath": "/xqNLXUUvBnfVk6m3QFGGU0Grgs7.jpg",
      "rating": 6.9,
      "phase": "Phase 1",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-avengers-1",
    "type": "mediaNode",
    "position": {
      "x": 1475,
      "y": 450
    },
    "data": {
      "id": "mcu-avengers-1",
      "tmdbId": 24428,
      "mediaType": "movie",
      "title": "The Avengers",
      "releaseYear": "2012",
      "chronologicalYear": "2012",
      "posterPath": "/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
      "rating": 7.7,
      "phase": "Phase 1",
      "canonType": "sacred",
      "branchName": "Sacred Timeline",
      "isAnchor": true,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-item-47",
    "type": "mediaNode",
    "position": {
      "x": 1655,
      "y": 450
    },
    "data": {
      "id": "mcu-item-47",
      "tmdbId": 231363,
      "mediaType": "movie",
      "title": "Item 47",
      "releaseYear": "2012",
      "chronologicalYear": "2012",
      "posterPath": "/hnSxG8clwLuAXEkp9emc8HCUcHD.jpg",
      "rating": 6.8,
      "phase": "Phase 1",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-thor-2",
    "type": "mediaNode",
    "position": {
      "x": 1790,
      "y": 450
    },
    "data": {
      "id": "mcu-thor-2",
      "tmdbId": 76338,
      "mediaType": "movie",
      "title": "Thor: The Dark World",
      "releaseYear": "2013",
      "chronologicalYear": "2013",
      "posterPath": "/wp6OxE4poJ4G7c0U2ZIXasTSMR7.jpg",
      "rating": 6.5,
      "phase": "Phase 2",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-ironman-3",
    "type": "mediaNode",
    "position": {
      "x": 1925,
      "y": 450
    },
    "data": {
      "id": "mcu-ironman-3",
      "tmdbId": 68721,
      "mediaType": "movie",
      "title": "Iron Man 3",
      "releaseYear": "2013",
      "chronologicalYear": "2012–2013",
      "posterPath": "/qhPtAc1TKbMPqNvcdXSOn9Bn7hZ.jpg",
      "rating": 6.9,
      "phase": "Phase 2",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-all-hail-king",
    "type": "mediaNode",
    "position": {
      "x": 2060,
      "y": 450
    },
    "data": {
      "id": "mcu-all-hail-king",
      "tmdbId": 257094,
      "mediaType": "movie",
      "title": "All Hail the King",
      "releaseYear": "2014",
      "chronologicalYear": "2014",
      "posterPath": "/y0QYZPWgeGKOvyrzi6Oz3aJPxJa.jpg",
      "rating": 7.1,
      "phase": "Phase 2",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-cap-2",
    "type": "mediaNode",
    "position": {
      "x": 2195,
      "y": 450
    },
    "data": {
      "id": "mcu-cap-2",
      "tmdbId": 100402,
      "mediaType": "movie",
      "title": "Captain America: The Winter Soldier",
      "releaseYear": "2014",
      "chronologicalYear": "2014",
      "posterPath": "/tVFRpFw3xTedgPGqxW0AOI8Qhh0.jpg",
      "rating": 7.7,
      "phase": "Phase 2",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-gotg-1",
    "type": "mediaNode",
    "position": {
      "x": 2330,
      "y": 450
    },
    "data": {
      "id": "mcu-gotg-1",
      "tmdbId": 118340,
      "mediaType": "movie",
      "title": "Guardians of the Galaxy",
      "releaseYear": "2014",
      "chronologicalYear": "2014",
      "posterPath": "/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg",
      "rating": 7.9,
      "phase": "Phase 2",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-gotg-2",
    "type": "mediaNode",
    "position": {
      "x": 2465,
      "y": 450
    },
    "data": {
      "id": "mcu-gotg-2",
      "tmdbId": 283995,
      "mediaType": "movie",
      "title": "Guardians of the Galaxy Vol. 2",
      "releaseYear": "2017",
      "chronologicalYear": "2014",
      "posterPath": "/y4MBh0EjBlMuOzv9axM4qJlmhzz.jpg",
      "rating": 7.6,
      "phase": "Phase 3",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-i-am-groot",
    "type": "mediaNode",
    "position": {
      "x": 2600,
      "y": 450
    },
    "data": {
      "id": "mcu-i-am-groot",
      "tmdbId": 114469,
      "mediaType": "tv",
      "title": "I Am Groot",
      "releaseYear": "2022",
      "chronologicalYear": "2014",
      "posterPath": "/3QfQYECgu6DX5UUWCBvv1Fl0BAJ.jpg",
      "rating": 6.8,
      "phase": "Phase 4",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-avengers-2",
    "type": "mediaNode",
    "position": {
      "x": 2735,
      "y": 450
    },
    "data": {
      "id": "mcu-avengers-2",
      "tmdbId": 99861,
      "mediaType": "movie",
      "title": "Avengers: Age of Ultron",
      "releaseYear": "2015",
      "chronologicalYear": "2015",
      "posterPath": "/4ssDuvEDkSArWEdyBl2X5EHvYKU.jpg",
      "rating": 7.3,
      "phase": "Phase 2",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-antman-1",
    "type": "mediaNode",
    "position": {
      "x": 2870,
      "y": 450
    },
    "data": {
      "id": "mcu-antman-1",
      "tmdbId": 102899,
      "mediaType": "movie",
      "title": "Ant-Man",
      "releaseYear": "2015",
      "chronologicalYear": "2015",
      "posterPath": "/rQRnQfUl3kfp78nCWq8Ks04vnq1.jpg",
      "rating": 7.1,
      "phase": "Phase 2",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-cap-3",
    "type": "mediaNode",
    "position": {
      "x": 3005,
      "y": 450
    },
    "data": {
      "id": "mcu-cap-3",
      "tmdbId": 271110,
      "mediaType": "movie",
      "title": "Captain America: Civil War",
      "releaseYear": "2016",
      "chronologicalYear": "2016",
      "posterPath": "/rAGiXaUfPzY7CDEyNKUofk3Kw2e.jpg",
      "rating": 7.4,
      "phase": "Phase 3",
      "canonType": "sacred",
      "branchName": "Sacred Timeline",
      "isAnchor": true,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-black-widow",
    "type": "mediaNode",
    "position": {
      "x": 3185,
      "y": 450
    },
    "data": {
      "id": "mcu-black-widow",
      "tmdbId": 497698,
      "mediaType": "movie",
      "title": "Black Widow",
      "releaseYear": "2021",
      "chronologicalYear": "2016",
      "posterPath": "/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg",
      "rating": 7.2,
      "phase": "Phase 4",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-black-panther-1",
    "type": "mediaNode",
    "position": {
      "x": 3320,
      "y": 450
    },
    "data": {
      "id": "mcu-black-panther-1",
      "tmdbId": 284054,
      "mediaType": "movie",
      "title": "Black Panther",
      "releaseYear": "2018",
      "chronologicalYear": "2016",
      "posterPath": "/uxzzxijgPIY7slzFvMotPv8wjKA.jpg",
      "rating": 7.4,
      "phase": "Phase 3",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-spiderman-1",
    "type": "mediaNode",
    "position": {
      "x": 3455,
      "y": 450
    },
    "data": {
      "id": "mcu-spiderman-1",
      "tmdbId": 315635,
      "mediaType": "movie",
      "title": "Spider-Man: Homecoming",
      "releaseYear": "2017",
      "chronologicalYear": "2016",
      "posterPath": "/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg",
      "rating": 7.4,
      "phase": "Phase 3",
      "canonType": "sacred",
      "universeId": "spider-man",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-doctor-strange-1",
    "type": "mediaNode",
    "position": {
      "x": 3590,
      "y": 450
    },
    "data": {
      "id": "mcu-doctor-strange-1",
      "tmdbId": 284052,
      "mediaType": "movie",
      "title": "Doctor Strange",
      "releaseYear": "2016",
      "chronologicalYear": "2016–2017",
      "posterPath": "/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg",
      "rating": 7.4,
      "phase": "Phase 3",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-thor-3",
    "type": "mediaNode",
    "position": {
      "x": 3725,
      "y": 450
    },
    "data": {
      "id": "mcu-thor-3",
      "tmdbId": 284053,
      "mediaType": "movie",
      "title": "Thor: Ragnarok",
      "releaseYear": "2017",
      "chronologicalYear": "2017",
      "posterPath": "/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg",
      "rating": 7.6,
      "phase": "Phase 3",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-antman-2",
    "type": "mediaNode",
    "position": {
      "x": 3860,
      "y": 450
    },
    "data": {
      "id": "mcu-antman-2",
      "tmdbId": 363088,
      "mediaType": "movie",
      "title": "Ant-Man and the Wasp",
      "releaseYear": "2018",
      "chronologicalYear": "2018",
      "posterPath": "/cFQEO687n1K6umXbInzocxcnAQz.jpg",
      "rating": 7,
      "phase": "Phase 3",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-avengers-3",
    "type": "mediaNode",
    "position": {
      "x": 3995,
      "y": 450
    },
    "data": {
      "id": "mcu-avengers-3",
      "tmdbId": 299536,
      "mediaType": "movie",
      "title": "Avengers: Infinity War",
      "releaseYear": "2018",
      "chronologicalYear": "2018",
      "posterPath": "/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
      "rating": 8.3,
      "phase": "Phase 3",
      "canonType": "sacred",
      "branchName": "Sacred Timeline",
      "isAnchor": true,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-avengers-4",
    "type": "mediaNode",
    "position": {
      "x": 4175,
      "y": 450
    },
    "data": {
      "id": "mcu-avengers-4",
      "tmdbId": 299534,
      "mediaType": "movie",
      "title": "Avengers: Endgame",
      "releaseYear": "2019",
      "chronologicalYear": "2018 and 2023",
      "posterPath": "/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",
      "rating": 8.3,
      "phase": "Phase 3",
      "canonType": "sacred",
      "branchName": "Sacred Timeline",
      "isAnchor": true,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-loki",
    "type": "mediaNode",
    "position": {
      "x": 2200,
      "y": 180
    },
    "data": {
      "id": "mcu-loki",
      "tmdbId": 84958,
      "mediaType": "tv",
      "title": "Loki",
      "releaseYear": "2021",
      "chronologicalYear": "Outside time",
      "posterPath": "/kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg",
      "rating": 8.2,
      "phase": "Phase 4",
      "canonType": "tva",
      "branchName": "TVA",
      "isAnchor": true,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-what-if",
    "type": "mediaNode",
    "position": {
      "x": 2600,
      "y": 720
    },
    "data": {
      "id": "mcu-what-if",
      "tmdbId": 91363,
      "mediaType": "tv",
      "title": "What If...?",
      "releaseYear": "2021–2024",
      "chronologicalYear": "Across the multiverse",
      "posterPath": "/lztz5XBMG1x6Y5ubz7CxfPFsAcW.jpg",
      "rating": 7.4,
      "phase": "Phase 4",
      "canonType": "multiverse",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-marvel-zombies",
    "type": "mediaNode",
    "position": {
      "x": 2735,
      "y": 720
    },
    "data": {
      "id": "mcu-marvel-zombies",
      "tmdbId": 138505,
      "mediaType": "tv",
      "title": "Marvel Zombies",
      "releaseYear": "2025",
      "chronologicalYear": "Multiverse",
      "posterPath": "/mwKj9ERGFXsWot0nXgQ5yMQf9I7.jpg",
      "rating": 7.2,
      "phase": "Phase 5",
      "canonType": "multiverse",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-spider-man-animation",
    "type": "mediaNode",
    "position": {
      "x": 4355,
      "y": 450
    },
    "data": {
      "id": "mcu-spider-man-animation",
      "tmdbId": 138503,
      "mediaType": "tv",
      "title": "Your Friendly Neighborhood Spider-Man",
      "releaseYear": "2025",
      "chronologicalYear": "Multiverse",
      "posterPath": "/kjcsNeqF52YUQ2rUBGLMHwLkxvR.jpg",
      "rating": 7,
      "phase": "Phase 5",
      "canonType": "alternate",
      "universeId": "spider-man",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-xmen-97",
    "type": "mediaNode",
    "position": {
      "x": 2870,
      "y": 720
    },
    "data": {
      "id": "mcu-xmen-97",
      "tmdbId": 138504,
      "mediaType": "tv",
      "title": "X-Men '97",
      "releaseYear": "2024",
      "chronologicalYear": "1997 / Multiverse",
      "posterPath": "/2HKBc5UiFw8JrruHq8S1Y7TnlW0.jpg",
      "rating": 8.5,
      "phase": "Phase 5",
      "canonType": "alternate",
      "universeId": "x-men",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-wandavision",
    "type": "mediaNode",
    "position": {
      "x": 4490,
      "y": 450
    },
    "data": {
      "id": "mcu-wandavision",
      "tmdbId": 85271,
      "mediaType": "tv",
      "title": "WandaVision",
      "releaseYear": "2021",
      "chronologicalYear": "2023",
      "posterPath": "/ijWWwINc8h71NQ8j1LTJMFSj5wr.jpg",
      "rating": 8.2,
      "phase": "Phase 4",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-shangchi",
    "type": "mediaNode",
    "position": {
      "x": 4625,
      "y": 450
    },
    "data": {
      "id": "mcu-shangchi",
      "tmdbId": 566525,
      "mediaType": "movie",
      "title": "Shang-Chi and the Legend of the Ten Rings",
      "releaseYear": "2021",
      "chronologicalYear": "2024",
      "posterPath": "/9f2Q0U3IOsLgrI2HkvldwSABZy5.jpg",
      "rating": 7.6,
      "phase": "Phase 4",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-falcon-winter-soldier",
    "type": "mediaNode",
    "position": {
      "x": 4760,
      "y": 450
    },
    "data": {
      "id": "mcu-falcon-winter-soldier",
      "tmdbId": 88396,
      "mediaType": "tv",
      "title": "The Falcon and the Winter Soldier",
      "releaseYear": "2021",
      "chronologicalYear": "2024",
      "posterPath": "/6kbAMLteGO8yyewYau6bJ683sw7.jpg",
      "rating": 7.5,
      "phase": "Phase 4",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-spiderman-2",
    "type": "mediaNode",
    "position": {
      "x": 4895,
      "y": 450
    },
    "data": {
      "id": "mcu-spiderman-2",
      "tmdbId": 429617,
      "mediaType": "movie",
      "title": "Spider-Man: Far From Home",
      "releaseYear": "2019",
      "chronologicalYear": "2024",
      "posterPath": "/4q2NNj4S5dG2RLF9CpXsej7yXl.jpg",
      "rating": 7.5,
      "phase": "Phase 3",
      "canonType": "sacred",
      "universeId": "spider-man",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-eternals",
    "type": "mediaNode",
    "position": {
      "x": 5030,
      "y": 450
    },
    "data": {
      "id": "mcu-eternals",
      "tmdbId": 524434,
      "mediaType": "movie",
      "title": "Eternals",
      "releaseYear": "2021",
      "chronologicalYear": "2024",
      "posterPath": "/lFByFSLV5WDJEv3KabbdAF959F2.jpg",
      "rating": 6.9,
      "phase": "Phase 4",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-spiderman-3",
    "type": "mediaNode",
    "position": {
      "x": 5165,
      "y": 450
    },
    "data": {
      "id": "mcu-spiderman-3",
      "tmdbId": 634649,
      "mediaType": "movie",
      "title": "Spider-Man: No Way Home",
      "releaseYear": "2021",
      "chronologicalYear": "Late 2024",
      "posterPath": "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
      "rating": 8,
      "phase": "Phase 4",
      "canonType": "sacred",
      "universeId": "spider-man",
      "branchName": "Sacred Timeline",
      "isAnchor": true,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-doctor-strange-2",
    "type": "mediaNode",
    "position": {
      "x": 5345,
      "y": 450
    },
    "data": {
      "id": "mcu-doctor-strange-2",
      "tmdbId": 453395,
      "mediaType": "movie",
      "title": "Doctor Strange in the Multiverse of Madness",
      "releaseYear": "2022",
      "chronologicalYear": "2024–2025",
      "posterPath": "/ddJcSKbcp4rKZTmuyWaMhuwcfMz.jpg",
      "rating": 7.3,
      "phase": "Phase 4",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-hawkeye",
    "type": "mediaNode",
    "position": {
      "x": 5480,
      "y": 450
    },
    "data": {
      "id": "mcu-hawkeye",
      "tmdbId": 88329,
      "mediaType": "tv",
      "title": "Hawkeye",
      "releaseYear": "2021",
      "chronologicalYear": "2024 (Christmas)",
      "posterPath": "/ct5pNE5dDHryHLDnxyZPYcqO1sz.jpg",
      "rating": 7.7,
      "phase": "Phase 4",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-moon-knight",
    "type": "mediaNode",
    "position": {
      "x": 5615,
      "y": 450
    },
    "data": {
      "id": "mcu-moon-knight",
      "tmdbId": 92749,
      "mediaType": "tv",
      "title": "Moon Knight",
      "releaseYear": "2022",
      "chronologicalYear": "2025",
      "posterPath": "/9K3lbMf8TKvL9xGEbzi7TggWCNQ.jpg",
      "rating": 7.8,
      "phase": "Phase 4",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-black-panther-2",
    "type": "mediaNode",
    "position": {
      "x": 5750,
      "y": 450
    },
    "data": {
      "id": "mcu-black-panther-2",
      "tmdbId": 505642,
      "mediaType": "movie",
      "title": "Black Panther: Wakanda Forever",
      "releaseYear": "2022",
      "chronologicalYear": "2025",
      "posterPath": "/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
      "rating": 7.1,
      "phase": "Phase 4",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-echo",
    "type": "mediaNode",
    "position": {
      "x": 5885,
      "y": 450
    },
    "data": {
      "id": "mcu-echo",
      "tmdbId": 138502,
      "mediaType": "tv",
      "title": "Echo",
      "releaseYear": "2024",
      "chronologicalYear": "2025",
      "posterPath": "/vFyJH630cF68LohVYjQW49074Sy.jpg",
      "rating": 6.3,
      "phase": "Phase 5",
      "canonType": "sacred",
      "universeId": "defenders",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-she-hulk",
    "type": "mediaNode",
    "position": {
      "x": 6020,
      "y": 450
    },
    "data": {
      "id": "mcu-she-hulk",
      "tmdbId": 92783,
      "mediaType": "tv",
      "title": "She-Hulk: Attorney at Law",
      "releaseYear": "2022",
      "chronologicalYear": "2025",
      "posterPath": "/5xz2orV8f0usyrfGNshcoXHmiaV.jpg",
      "rating": 6.5,
      "phase": "Phase 4",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-ms-marvel",
    "type": "mediaNode",
    "position": {
      "x": 6155,
      "y": 450
    },
    "data": {
      "id": "mcu-ms-marvel",
      "tmdbId": 92782,
      "mediaType": "tv",
      "title": "Ms. Marvel",
      "releaseYear": "2022",
      "chronologicalYear": "2025",
      "posterPath": "/3HWWh92kZbD7odwJX7nKmXNZsYo.jpg",
      "rating": 6.7,
      "phase": "Phase 4",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-thor-4",
    "type": "mediaNode",
    "position": {
      "x": 6290,
      "y": 450
    },
    "data": {
      "id": "mcu-thor-4",
      "tmdbId": 616037,
      "mediaType": "movie",
      "title": "Thor: Love and Thunder",
      "releaseYear": "2022",
      "chronologicalYear": "2025",
      "posterPath": "/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg",
      "rating": 6.4,
      "phase": "Phase 4",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-ironheart",
    "type": "mediaNode",
    "position": {
      "x": 6425,
      "y": 450
    },
    "data": {
      "id": "mcu-ironheart",
      "tmdbId": 114478,
      "mediaType": "tv",
      "title": "Ironheart",
      "releaseYear": "2025",
      "chronologicalYear": "2025",
      "posterPath": "/dOh6MJpdlQhYpLBhzhNQeYGKTZ5.jpg",
      "rating": 7.2,
      "phase": "Phase 5",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-werewolf-by-night",
    "type": "mediaNode",
    "position": {
      "x": 6560,
      "y": 450
    },
    "data": {
      "id": "mcu-werewolf-by-night",
      "tmdbId": 1024535,
      "mediaType": "movie",
      "title": "Werewolf by Night",
      "releaseYear": "2022",
      "chronologicalYear": "2025",
      "posterPath": "/mvIvNKRIJPPS7WSFarFhOAGIVnU.jpg",
      "rating": 7,
      "phase": "Phase 4",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-gotg-holiday",
    "type": "mediaNode",
    "position": {
      "x": 6695,
      "y": 450
    },
    "data": {
      "id": "mcu-gotg-holiday",
      "tmdbId": 774752,
      "mediaType": "movie",
      "title": "The Guardians of the Galaxy Holiday Special",
      "releaseYear": "2022",
      "chronologicalYear": "2025 (Holiday)",
      "posterPath": "/8dqXyslZ2hv49Oiob9UjlGSHSTR.jpg",
      "rating": 6.9,
      "phase": "Phase 4",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-antman-3",
    "type": "mediaNode",
    "position": {
      "x": 6830,
      "y": 450
    },
    "data": {
      "id": "mcu-antman-3",
      "tmdbId": 640146,
      "mediaType": "movie",
      "title": "Ant-Man and the Wasp: Quantumania",
      "releaseYear": "2023",
      "chronologicalYear": "2026",
      "posterPath": "/qnqGbB22YJ7dSs4o6M7exTpNxPz.jpg",
      "rating": 6.3,
      "phase": "Phase 5",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-gotg-3",
    "type": "mediaNode",
    "position": {
      "x": 6965,
      "y": 450
    },
    "data": {
      "id": "mcu-gotg-3",
      "tmdbId": 447365,
      "mediaType": "movie",
      "title": "Guardians of the Galaxy Vol. 3",
      "releaseYear": "2023",
      "chronologicalYear": "2026",
      "posterPath": "/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
      "rating": 7.9,
      "phase": "Phase 5",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-secret-invasion",
    "type": "mediaNode",
    "position": {
      "x": 7100,
      "y": 450
    },
    "data": {
      "id": "mcu-secret-invasion",
      "tmdbId": 114479,
      "mediaType": "tv",
      "title": "Secret Invasion",
      "releaseYear": "2023",
      "chronologicalYear": "2026",
      "posterPath": "/3rINdUPSy9AklJg74jWHOyUXuZd.jpg",
      "rating": 6,
      "phase": "Phase 5",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-marvels",
    "type": "mediaNode",
    "position": {
      "x": 7235,
      "y": 450
    },
    "data": {
      "id": "mcu-marvels",
      "tmdbId": 609681,
      "mediaType": "movie",
      "title": "The Marvels",
      "releaseYear": "2023",
      "chronologicalYear": "2026",
      "posterPath": "/9GBhzXMFjgcZ3FdR9w3bUMMTps5.jpg",
      "rating": 6.2,
      "phase": "Phase 5",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-deadpool-3",
    "type": "mediaNode",
    "position": {
      "x": 3005,
      "y": 720
    },
    "data": {
      "id": "mcu-deadpool-3",
      "tmdbId": 533535,
      "mediaType": "movie",
      "title": "Deadpool & Wolverine",
      "releaseYear": "2024",
      "chronologicalYear": "2024 / Void",
      "posterPath": "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
      "rating": 7.7,
      "phase": "Phase 5",
      "canonType": "multiverse",
      "universeId": "x-men",
      "branchName": "Multiverse / The Void",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-agatha",
    "type": "mediaNode",
    "position": {
      "x": 7370,
      "y": 450
    },
    "data": {
      "id": "mcu-agatha",
      "tmdbId": 138501,
      "mediaType": "tv",
      "title": "Agatha All Along",
      "releaseYear": "2024",
      "chronologicalYear": "2026",
      "posterPath": "/mGsxKwXUjojitRv2E9qMTbxbBRd.jpg",
      "rating": 7.6,
      "phase": "Phase 5",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-daredevil-born-again",
    "type": "mediaNode",
    "position": {
      "x": 7505,
      "y": 450
    },
    "data": {
      "id": "mcu-daredevil-born-again",
      "tmdbId": 202555,
      "mediaType": "tv",
      "title": "Daredevil: Born Again",
      "releaseYear": "2025",
      "chronologicalYear": "2026",
      "posterPath": "/xDUoAsU8lQHOOoRkFiBuarmACDN.jpg",
      "rating": 8.2,
      "phase": "Phase 5",
      "canonType": "sacred",
      "universeId": "defenders",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-captain-america-4",
    "type": "mediaNode",
    "position": {
      "x": 7640,
      "y": 450
    },
    "data": {
      "id": "mcu-captain-america-4",
      "tmdbId": 823464,
      "mediaType": "movie",
      "title": "Captain America: Brave New World",
      "releaseYear": "2025",
      "chronologicalYear": "2026",
      "posterPath": "/pzIddUEMWhWzfvLI3TwxUG2wGoi.jpg",
      "rating": 7.5,
      "phase": "Phase 5",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-thunderbolts",
    "type": "mediaNode",
    "position": {
      "x": 7775,
      "y": 450
    },
    "data": {
      "id": "mcu-thunderbolts",
      "tmdbId": 757827,
      "mediaType": "movie",
      "title": "Thunderbolts*",
      "releaseYear": "2025",
      "chronologicalYear": "2026",
      "posterPath": "/hqcexYHbiTBfDIdDWxrxPtVndBX.jpg",
      "rating": 7.7,
      "phase": "Phase 5",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-fantastic-four",
    "type": "mediaNode",
    "position": {
      "x": 2380,
      "y": 180
    },
    "data": {
      "id": "mcu-fantastic-four",
      "tmdbId": 533535,
      "mediaType": "movie",
      "title": "The Fantastic Four: First Steps",
      "releaseYear": "2025",
      "chronologicalYear": "1964 (Earth-828)",
      "posterPath": "/nf5qaSEvyYSNeFH0YhSs5EsBLX9.jpg",
      "rating": 8,
      "phase": "Phase 6",
      "canonType": "multiverse",
      "universeId": "fantastic-four",
      "branchName": "Earth-828",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-wonder-man",
    "type": "mediaNode",
    "position": {
      "x": 7910,
      "y": 450
    },
    "data": {
      "id": "mcu-wonder-man",
      "tmdbId": 204541,
      "mediaType": "tv",
      "title": "Wonder Man",
      "releaseYear": "2025",
      "chronologicalYear": "2026",
      "posterPath": "/6yy9nQlFt2l6UVWzrfhszFCaZ5C.jpg",
      "rating": 7.5,
      "phase": "Phase 6",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-punisher-one-last-kill",
    "type": "mediaNode",
    "position": {
      "x": 8045,
      "y": 450
    },
    "data": {
      "id": "mcu-punisher-one-last-kill",
      "tmdbId": 67178,
      "mediaType": "movie",
      "title": "The Punisher: One Last Kill",
      "releaseYear": "2026",
      "chronologicalYear": "2027",
      "posterPath": "/qQclTgLMDvGBuUBFGHRipxkEwWR.jpg",
      "rating": 8,
      "phase": "Phase 6",
      "canonType": "sacred",
      "universeId": "defenders",
      "isAnchor": false,
      "isDoomsdayCanon": false
    }
  },
  {
    "id": "mcu-spiderman-brand-new-day",
    "type": "mediaNode",
    "position": {
      "x": 8180,
      "y": 450
    },
    "data": {
      "id": "mcu-spiderman-brand-new-day",
      "tmdbId": 634649,
      "mediaType": "movie",
      "title": "Spider-Man: Brand New Day",
      "releaseYear": "2026",
      "chronologicalYear": "2027",
      "posterPath": "/bjiS5ipwxb9JFy3XRRN4OAilSeX.jpg",
      "rating": 8,
      "phase": "Phase 6",
      "canonType": "sacred",
      "universeId": "spider-man",
      "isAnchor": false,
      "isDoomsdayCanon": true
    }
  },
  {
    "id": "mcu-visionquest",
    "type": "mediaNode",
    "position": {
      "x": 8315,
      "y": 450
    },
    "data": {
      "id": "mcu-visionquest",
      "tmdbId": 213375,
      "mediaType": "tv",
      "title": "VisionQuest",
      "releaseYear": "2026",
      "chronologicalYear": "2026",
      "posterPath": "/WGyAyBPncfuu8MZhLY9RtfZPM0.jpg",
      "rating": 7.8,
      "phase": "Phase 6",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": true,
      "isUnreleased": true
    }
  },
  {
    "id": "mcu-avengers-doomsday",
    "type": "mediaNode",
    "position": {
      "x": 8450,
      "y": 450
    },
    "data": {
      "id": "mcu-avengers-doomsday",
      "tmdbId": 1003596,
      "mediaType": "movie",
      "title": "Avengers: Doomsday",
      "releaseYear": "Dec 18, 2026",
      "chronologicalYear": "Dec 18, 2026",
      "posterPath": "/jzPwsojjFStf5lR5Nm07w2hH56G.jpg",
      "rating": 8.8,
      "phase": "Phase 6",
      "canonType": "sacred",
      "branchName": "Multiverse Saga",
      "isAnchor": true,
      "isDoomsdayCanon": true,
      "isUnreleased": true
    }
  },
  {
    "id": "mcu-avengers-secret-wars",
    "type": "mediaNode",
    "position": {
      "x": 8630,
      "y": 450
    },
    "data": {
      "id": "mcu-avengers-secret-wars",
      "tmdbId": 1003598,
      "mediaType": "movie",
      "title": "Avengers: Secret Wars",
      "releaseYear": "Dec 17, 2027",
      "chronologicalYear": "Dec 17, 2027",
      "posterPath": "/f0YBuh4hyiAheXhh4JnJWoKi9g5.jpg",
      "rating": 9,
      "phase": "Phase 6",
      "canonType": "sacred",
      "branchName": "Multiverse Saga Finale",
      "isAnchor": true,
      "isDoomsdayCanon": true,
      "isUnreleased": true
    }
  },
  {
    "id": "mcu-xmen",
    "type": "mediaNode",
    "position": {
      "x": 3140,
      "y": 720
    },
    "data": {
      "id": "mcu-xmen",
      "tmdbId": 1293690,
      "mediaType": "movie",
      "title": "X-Men",
      "releaseYear": "TBA",
      "chronologicalYear": "TBA",
      "posterPath": "/jSn3jOzI91dOx4aVdfMrirWXH6R.jpg",
      "rating": 8.5,
      "phase": "Phase 7",
      "canonType": "multiverse",
      "universeId": "x-men",
      "branchName": "Mutant Saga",
      "isAnchor": false,
      "isDoomsdayCanon": false,
      "isUnreleased": true
    }
  },
  {
    "id": "mcu-ghost-rider",
    "type": "mediaNode",
    "position": {
      "x": 8810,
      "y": 450
    },
    "data": {
      "id": "mcu-ghost-rider",
      "tmdbId": 1738010,
      "mediaType": "movie",
      "title": "Ghost Rider",
      "releaseYear": "TBA",
      "chronologicalYear": "TBA",
      "posterPath": "/zgC1zo3lyujoEiIMnUrHltvPmZg.jpg",
      "rating": 7.5,
      "phase": "Phase 7",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": false,
      "isUnreleased": true
    }
  },
  {
    "id": "mcu-black-panther-3",
    "type": "mediaNode",
    "position": {
      "x": 8945,
      "y": 450
    },
    "data": {
      "id": "mcu-black-panther-3",
      "tmdbId": 1386618,
      "mediaType": "movie",
      "title": "Black Panther 3",
      "releaseYear": "TBA",
      "chronologicalYear": "TBA",
      "posterPath": "/zJc9fYZxgq4yzI0Oru2e1Cf3a3V.jpg",
      "rating": 7.7,
      "phase": "Phase 7",
      "canonType": "sacred",
      "isAnchor": false,
      "isDoomsdayCanon": false,
      "isUnreleased": true
    }
  }
],
  edges: [
  {
    "id": "edge-mcu-eyes-wakanda-mcu-cap-1",
    "source": "mcu-eyes-wakanda",
    "target": "mcu-cap-1"
  },
  {
    "id": "edge-mcu-cap-1-mcu-agent-carter-one-shot",
    "source": "mcu-cap-1",
    "target": "mcu-agent-carter-one-shot"
  },
  {
    "id": "edge-mcu-agent-carter-one-shot-mcu-cap-marvel",
    "source": "mcu-agent-carter-one-shot",
    "target": "mcu-cap-marvel"
  },
  {
    "id": "edge-mcu-cap-marvel-mcu-ironman-1",
    "source": "mcu-cap-marvel",
    "target": "mcu-ironman-1"
  },
  {
    "id": "edge-mcu-ironman-1-mcu-ironman-2",
    "source": "mcu-ironman-1",
    "target": "mcu-ironman-2"
  },
  {
    "id": "edge-mcu-ironman-2-mcu-hulk",
    "source": "mcu-ironman-2",
    "target": "mcu-hulk"
  },
  {
    "id": "edge-mcu-hulk-mcu-thor-one-shot",
    "source": "mcu-hulk",
    "target": "mcu-thor-one-shot"
  },
  {
    "id": "edge-mcu-thor-one-shot-mcu-thor-1",
    "source": "mcu-thor-one-shot",
    "target": "mcu-thor-1"
  },
  {
    "id": "edge-mcu-thor-1-mcu-consultant",
    "source": "mcu-thor-1",
    "target": "mcu-consultant"
  },
  {
    "id": "edge-mcu-consultant-mcu-avengers-1",
    "source": "mcu-consultant",
    "target": "mcu-avengers-1"
  },
  {
    "id": "edge-mcu-avengers-1-mcu-item-47",
    "source": "mcu-avengers-1",
    "target": "mcu-item-47"
  },
  {
    "id": "edge-mcu-item-47-mcu-thor-2",
    "source": "mcu-item-47",
    "target": "mcu-thor-2"
  },
  {
    "id": "edge-mcu-thor-2-mcu-ironman-3",
    "source": "mcu-thor-2",
    "target": "mcu-ironman-3"
  },
  {
    "id": "edge-mcu-ironman-3-mcu-all-hail-king",
    "source": "mcu-ironman-3",
    "target": "mcu-all-hail-king"
  },
  {
    "id": "edge-mcu-all-hail-king-mcu-cap-2",
    "source": "mcu-all-hail-king",
    "target": "mcu-cap-2"
  },
  {
    "id": "edge-mcu-cap-2-mcu-gotg-1",
    "source": "mcu-cap-2",
    "target": "mcu-gotg-1"
  },
  {
    "id": "edge-mcu-gotg-1-mcu-gotg-2",
    "source": "mcu-gotg-1",
    "target": "mcu-gotg-2"
  },
  {
    "id": "edge-mcu-gotg-2-mcu-i-am-groot",
    "source": "mcu-gotg-2",
    "target": "mcu-i-am-groot"
  },
  {
    "id": "edge-mcu-i-am-groot-mcu-avengers-2",
    "source": "mcu-i-am-groot",
    "target": "mcu-avengers-2"
  },
  {
    "id": "edge-mcu-avengers-2-mcu-antman-1",
    "source": "mcu-avengers-2",
    "target": "mcu-antman-1"
  },
  {
    "id": "edge-mcu-antman-1-mcu-cap-3",
    "source": "mcu-antman-1",
    "target": "mcu-cap-3"
  },
  {
    "id": "edge-mcu-cap-3-mcu-black-widow",
    "source": "mcu-cap-3",
    "target": "mcu-black-widow"
  },
  {
    "id": "edge-mcu-black-widow-mcu-black-panther-1",
    "source": "mcu-black-widow",
    "target": "mcu-black-panther-1"
  },
  {
    "id": "edge-mcu-black-panther-1-mcu-spiderman-1",
    "source": "mcu-black-panther-1",
    "target": "mcu-spiderman-1"
  },
  {
    "id": "edge-mcu-spiderman-1-mcu-doctor-strange-1",
    "source": "mcu-spiderman-1",
    "target": "mcu-doctor-strange-1"
  },
  {
    "id": "edge-mcu-doctor-strange-1-mcu-thor-3",
    "source": "mcu-doctor-strange-1",
    "target": "mcu-thor-3"
  },
  {
    "id": "edge-mcu-thor-3-mcu-antman-2",
    "source": "mcu-thor-3",
    "target": "mcu-antman-2"
  },
  {
    "id": "edge-mcu-antman-2-mcu-avengers-3",
    "source": "mcu-antman-2",
    "target": "mcu-avengers-3"
  },
  {
    "id": "edge-mcu-avengers-3-mcu-avengers-4",
    "source": "mcu-avengers-3",
    "target": "mcu-avengers-4"
  },
  {
    "id": "edge-mcu-avengers-4-mcu-loki",
    "source": "mcu-avengers-4",
    "target": "mcu-loki"
  },
  {
    "id": "edge-mcu-loki-mcu-what-if",
    "source": "mcu-loki",
    "target": "mcu-what-if"
  },
  {
    "id": "edge-mcu-what-if-mcu-marvel-zombies",
    "source": "mcu-what-if",
    "target": "mcu-marvel-zombies"
  },
  {
    "id": "edge-mcu-marvel-zombies-mcu-spider-man-animation",
    "source": "mcu-marvel-zombies",
    "target": "mcu-spider-man-animation"
  },
  {
    "id": "edge-mcu-spider-man-animation-mcu-xmen-97",
    "source": "mcu-spider-man-animation",
    "target": "mcu-xmen-97"
  },
  {
    "id": "edge-mcu-xmen-97-mcu-wandavision",
    "source": "mcu-xmen-97",
    "target": "mcu-wandavision"
  },
  {
    "id": "edge-mcu-wandavision-mcu-shangchi",
    "source": "mcu-wandavision",
    "target": "mcu-shangchi"
  },
  {
    "id": "edge-mcu-shangchi-mcu-falcon-winter-soldier",
    "source": "mcu-shangchi",
    "target": "mcu-falcon-winter-soldier"
  },
  {
    "id": "edge-mcu-falcon-winter-soldier-mcu-spiderman-2",
    "source": "mcu-falcon-winter-soldier",
    "target": "mcu-spiderman-2"
  },
  {
    "id": "edge-mcu-spiderman-2-mcu-eternals",
    "source": "mcu-spiderman-2",
    "target": "mcu-eternals"
  },
  {
    "id": "edge-mcu-eternals-mcu-spiderman-3",
    "source": "mcu-eternals",
    "target": "mcu-spiderman-3"
  },
  {
    "id": "edge-mcu-spiderman-3-mcu-doctor-strange-2",
    "source": "mcu-spiderman-3",
    "target": "mcu-doctor-strange-2"
  },
  {
    "id": "edge-mcu-doctor-strange-2-mcu-hawkeye",
    "source": "mcu-doctor-strange-2",
    "target": "mcu-hawkeye"
  },
  {
    "id": "edge-mcu-hawkeye-mcu-moon-knight",
    "source": "mcu-hawkeye",
    "target": "mcu-moon-knight"
  },
  {
    "id": "edge-mcu-moon-knight-mcu-black-panther-2",
    "source": "mcu-moon-knight",
    "target": "mcu-black-panther-2"
  },
  {
    "id": "edge-mcu-black-panther-2-mcu-echo",
    "source": "mcu-black-panther-2",
    "target": "mcu-echo"
  },
  {
    "id": "edge-mcu-echo-mcu-she-hulk",
    "source": "mcu-echo",
    "target": "mcu-she-hulk"
  },
  {
    "id": "edge-mcu-she-hulk-mcu-ms-marvel",
    "source": "mcu-she-hulk",
    "target": "mcu-ms-marvel"
  },
  {
    "id": "edge-mcu-ms-marvel-mcu-thor-4",
    "source": "mcu-ms-marvel",
    "target": "mcu-thor-4"
  },
  {
    "id": "edge-mcu-thor-4-mcu-ironheart",
    "source": "mcu-thor-4",
    "target": "mcu-ironheart"
  },
  {
    "id": "edge-mcu-ironheart-mcu-werewolf-by-night",
    "source": "mcu-ironheart",
    "target": "mcu-werewolf-by-night"
  },
  {
    "id": "edge-mcu-werewolf-by-night-mcu-gotg-holiday",
    "source": "mcu-werewolf-by-night",
    "target": "mcu-gotg-holiday"
  },
  {
    "id": "edge-mcu-gotg-holiday-mcu-antman-3",
    "source": "mcu-gotg-holiday",
    "target": "mcu-antman-3"
  },
  {
    "id": "edge-mcu-antman-3-mcu-gotg-3",
    "source": "mcu-antman-3",
    "target": "mcu-gotg-3"
  },
  {
    "id": "edge-mcu-gotg-3-mcu-secret-invasion",
    "source": "mcu-gotg-3",
    "target": "mcu-secret-invasion"
  },
  {
    "id": "edge-mcu-secret-invasion-mcu-marvels",
    "source": "mcu-secret-invasion",
    "target": "mcu-marvels"
  },
  {
    "id": "edge-mcu-marvels-mcu-deadpool-3",
    "source": "mcu-marvels",
    "target": "mcu-deadpool-3"
  },
  {
    "id": "edge-mcu-deadpool-3-mcu-agatha",
    "source": "mcu-deadpool-3",
    "target": "mcu-agatha"
  },
  {
    "id": "edge-mcu-agatha-mcu-daredevil-born-again",
    "source": "mcu-agatha",
    "target": "mcu-daredevil-born-again"
  },
  {
    "id": "edge-mcu-daredevil-born-again-mcu-captain-america-4",
    "source": "mcu-daredevil-born-again",
    "target": "mcu-captain-america-4"
  },
  {
    "id": "edge-mcu-captain-america-4-mcu-thunderbolts",
    "source": "mcu-captain-america-4",
    "target": "mcu-thunderbolts"
  },
  {
    "id": "edge-mcu-thunderbolts-mcu-fantastic-four",
    "source": "mcu-thunderbolts",
    "target": "mcu-fantastic-four"
  },
  {
    "id": "edge-mcu-fantastic-four-mcu-wonder-man",
    "source": "mcu-fantastic-four",
    "target": "mcu-wonder-man"
  },
  {
    "id": "edge-mcu-wonder-man-mcu-punisher-one-last-kill",
    "source": "mcu-wonder-man",
    "target": "mcu-punisher-one-last-kill"
  },
  {
    "id": "edge-mcu-punisher-one-last-kill-mcu-spiderman-brand-new-day",
    "source": "mcu-punisher-one-last-kill",
    "target": "mcu-spiderman-brand-new-day"
  },
  {
    "id": "edge-mcu-spiderman-brand-new-day-mcu-visionquest",
    "source": "mcu-spiderman-brand-new-day",
    "target": "mcu-visionquest"
  },
  {
    "id": "edge-mcu-visionquest-mcu-avengers-doomsday",
    "source": "mcu-visionquest",
    "target": "mcu-avengers-doomsday"
  },
  {
    "id": "edge-mcu-avengers-doomsday-mcu-avengers-secret-wars",
    "source": "mcu-avengers-doomsday",
    "target": "mcu-avengers-secret-wars"
  },
  {
    "id": "edge-mcu-avengers-secret-wars-mcu-xmen",
    "source": "mcu-avengers-secret-wars",
    "target": "mcu-xmen"
  },
  {
    "id": "edge-mcu-xmen-mcu-ghost-rider",
    "source": "mcu-xmen",
    "target": "mcu-ghost-rider"
  },
  {
    "id": "edge-mcu-ghost-rider-mcu-black-panther-3",
    "source": "mcu-ghost-rider",
    "target": "mcu-black-panther-3"
  }
],
};
