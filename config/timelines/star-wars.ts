import { TimelineUniverse } from "@/types/timeline";

export const starWarsTimeline: TimelineUniverse = {
  id: "star-wars",
  name: "Star Wars Saga",
  shortName: "Star Wars",
  description: "Follow the Skywalker Saga, the rise of the Galactic Empire, the Age of Rebellion, and the Mandoverse in chronological galactic timeline (BBY/ABY).",
  accentColor: "#3B82F6",
  defaultFilterId: "all",
  filters: [
    { id: "all", label: "All Canon", description: "Skywalker Saga, Spin-offs, and Mandoverse" },
    { id: "skywalker", label: "Skywalker Saga Only", description: "Episodes I through IX" },
    { id: "mandoverse", label: "New Republic & Mandoverse", description: "The Mandalorian, Ahsoka, and The Book of Boba Fett" },
  ],
  nodes: [
  {
    "id": "sw-acolyte",
    "type": "mediaNode",
    "position": {
      "x": 80,
      "y": 450
    },
    "data": {
      "id": "sw-acolyte",
      "tmdbId": 114461,
      "mediaType": "tv",
      "title": "The Acolyte",
      "releaseYear": "2024",
      "chronologicalYear": "132 BBY",
      "posterPath": "/mztdtZqDmm57Fz5VG7ZrZqNocAi.jpg",
      "rating": 6.8,
      "phase": "The High Republic",
      "canonType": "canon",
      "isAnchor": false
    }
  },
  {
    "id": "sw-young-jedi",
    "type": "mediaNode",
    "position": {
      "x": 215,
      "y": 450
    },
    "data": {
      "id": "sw-young-jedi",
      "tmdbId": 202534,
      "mediaType": "tv",
      "title": "Young Jedi Adventures",
      "releaseYear": "2023",
      "chronologicalYear": "200 BBY",
      "posterPath": "/mztdtZqDmm57Fz5VG7ZrZqNocAi.jpg",
      "rating": 7,
      "phase": "The High Republic",
      "canonType": "canon",
      "isAnchor": false
    }
  },
  {
    "id": "sw-ep1",
    "type": "mediaNode",
    "position": {
      "x": 350,
      "y": 450
    },
    "data": {
      "id": "sw-ep1",
      "tmdbId": 1893,
      "mediaType": "movie",
      "title": "Episode I: The Phantom Menace",
      "releaseYear": "1999",
      "chronologicalYear": "32 BBY",
      "posterPath": "/6wkfovpn7Eq8dYNKaG5PY3q2oq6.jpg",
      "rating": 6.5,
      "phase": "Fall of the Jedi",
      "canonType": "canon",
      "branchName": "Skywalker Saga",
      "isAnchor": true
    }
  },
  {
    "id": "sw-tales-jedi",
    "type": "mediaNode",
    "position": {
      "x": 1400,
      "y": 180
    },
    "data": {
      "id": "sw-tales-jedi",
      "tmdbId": 202879,
      "mediaType": "tv",
      "title": "Tales of the Jedi",
      "releaseYear": "2022",
      "chronologicalYear": "36–19 BBY",
      "posterPath": "/mztdtZqDmm57Fz5VG7ZrZqNocAi.jpg",
      "rating": 8.2,
      "phase": "Anthology",
      "canonType": "spinoff",
      "branchName": "Star Wars Tales",
      "isAnchor": false
    }
  },
  {
    "id": "sw-ep2",
    "type": "mediaNode",
    "position": {
      "x": 530,
      "y": 450
    },
    "data": {
      "id": "sw-ep2",
      "tmdbId": 1894,
      "mediaType": "movie",
      "title": "Episode II: Attack of the Clones",
      "releaseYear": "2002",
      "chronologicalYear": "22 BBY",
      "posterPath": "/oZNPzxqok5ObmAoaEUVgvuFu42P.jpg",
      "rating": 6.6,
      "phase": "Fall of the Jedi",
      "canonType": "canon",
      "branchName": "Skywalker Saga",
      "isAnchor": true
    }
  },
  {
    "id": "sw-clone-wars-movie",
    "type": "mediaNode",
    "position": {
      "x": 710,
      "y": 450
    },
    "data": {
      "id": "sw-clone-wars-movie",
      "tmdbId": 12180,
      "mediaType": "movie",
      "title": "Star Wars: The Clone Wars",
      "releaseYear": "2008",
      "chronologicalYear": "22 BBY",
      "posterPath": "/eob9w5w92kzbD7odwJX7nKmXNZs.jpg",
      "rating": 6.1,
      "phase": "Reign of the Empire",
      "canonType": "canon",
      "isAnchor": true
    }
  },
  {
    "id": "sw-clone-wars-tv",
    "type": "mediaNode",
    "position": {
      "x": 890,
      "y": 450
    },
    "data": {
      "id": "sw-clone-wars-tv",
      "tmdbId": 4174,
      "mediaType": "tv",
      "title": "The Clone Wars (Series)",
      "releaseYear": "2008–2020",
      "chronologicalYear": "22–19 BBY",
      "posterPath": "/pA088h72kZbD7odwJX7nKmXNZs.jpg",
      "rating": 8.5,
      "phase": "Reign of the Empire",
      "canonType": "canon",
      "isAnchor": false
    }
  },
  {
    "id": "sw-ep3",
    "type": "mediaNode",
    "position": {
      "x": 1025,
      "y": 450
    },
    "data": {
      "id": "sw-ep3",
      "tmdbId": 1895,
      "mediaType": "movie",
      "title": "Episode III: Revenge of the Sith",
      "releaseYear": "2005",
      "chronologicalYear": "19 BBY",
      "posterPath": "/xfSAoBVPf5vuvW0m53xGOC211io.jpg",
      "rating": 7.4,
      "phase": "Fall of the Jedi",
      "canonType": "canon",
      "branchName": "Skywalker Saga",
      "isAnchor": true
    }
  },
  {
    "id": "sw-tales-empire",
    "type": "mediaNode",
    "position": {
      "x": 1535,
      "y": 180
    },
    "data": {
      "id": "sw-tales-empire",
      "tmdbId": 251785,
      "mediaType": "tv",
      "title": "Tales of the Empire",
      "releaseYear": "2024",
      "chronologicalYear": "20 BBY–0 ABY",
      "posterPath": "/mztdtZqDmm57Fz5VG7ZrZqNocAi.jpg",
      "rating": 7.6,
      "phase": "Anthology",
      "canonType": "spinoff",
      "branchName": "Star Wars Tales",
      "isAnchor": false
    }
  },
  {
    "id": "sw-bad-batch",
    "type": "mediaNode",
    "position": {
      "x": 1205,
      "y": 450
    },
    "data": {
      "id": "sw-bad-batch",
      "tmdbId": 105971,
      "mediaType": "tv",
      "title": "The Bad Batch",
      "releaseYear": "2021–2024",
      "chronologicalYear": "19–18 BBY",
      "posterPath": "/WGyAyBPncfuu8MZhLY9RtfZPM0.jpg",
      "rating": 8.2,
      "phase": "Reign of the Empire",
      "canonType": "canon",
      "isAnchor": false
    }
  },
  {
    "id": "sw-solo",
    "type": "mediaNode",
    "position": {
      "x": 1340,
      "y": 450
    },
    "data": {
      "id": "sw-solo",
      "tmdbId": 348350,
      "mediaType": "movie",
      "title": "Solo: A Star Wars Story",
      "releaseYear": "2018",
      "chronologicalYear": "14–10 BBY",
      "posterPath": "/3IGbjc5U635IgIvgwpEvHGxNxUL.jpg",
      "rating": 6.6,
      "phase": "Age of Rebellion",
      "canonType": "canon",
      "isAnchor": false
    }
  },
  {
    "id": "sw-obi-wan",
    "type": "mediaNode",
    "position": {
      "x": 1475,
      "y": 450
    },
    "data": {
      "id": "sw-obi-wan",
      "tmdbId": 92783,
      "mediaType": "tv",
      "title": "Obi-Wan Kenobi",
      "releaseYear": "2022",
      "chronologicalYear": "9 BBY",
      "posterPath": "/qJXZjAjSDqpqSrNaMP7qTg4ZHA8.jpg",
      "rating": 7.1,
      "phase": "Reign of the Empire",
      "canonType": "canon",
      "isAnchor": false
    }
  },
  {
    "id": "sw-rebels",
    "type": "mediaNode",
    "position": {
      "x": 1610,
      "y": 450
    },
    "data": {
      "id": "sw-rebels",
      "tmdbId": 60554,
      "mediaType": "tv",
      "title": "Star Wars Rebels",
      "releaseYear": "2014–2018",
      "chronologicalYear": "5–1 BBY",
      "posterPath": "/WGyAyBPncfuu8MZhLY9RtfZPM0.jpg",
      "rating": 8,
      "phase": "Age of Rebellion",
      "canonType": "canon",
      "branchName": "The Early Rebellion",
      "isAnchor": false
    }
  },
  {
    "id": "sw-andor",
    "type": "mediaNode",
    "position": {
      "x": 1745,
      "y": 450
    },
    "data": {
      "id": "sw-andor",
      "tmdbId": 83867,
      "mediaType": "tv",
      "title": "Andor",
      "releaseYear": "2022–2025",
      "chronologicalYear": "5–0 BBY",
      "posterPath": "/59SVNw1P7mIqA3Njc0tON89fgBp.jpg",
      "rating": 8.4,
      "phase": "Age of Rebellion",
      "canonType": "canon",
      "isAnchor": false
    }
  },
  {
    "id": "sw-rogue-one",
    "type": "mediaNode",
    "position": {
      "x": 1880,
      "y": 450
    },
    "data": {
      "id": "sw-rogue-one",
      "tmdbId": 330459,
      "mediaType": "movie",
      "title": "Rogue One: A Star Wars Story",
      "releaseYear": "2016",
      "chronologicalYear": "0 BBY",
      "posterPath": "/qjiskwlV1qQz2VPjpPOTqLAbNT1.jpg",
      "rating": 7.5,
      "phase": "Age of Rebellion",
      "canonType": "canon",
      "branchName": "Age of Rebellion",
      "isAnchor": true
    }
  },
  {
    "id": "sw-ep4",
    "type": "mediaNode",
    "position": {
      "x": 2060,
      "y": 450
    },
    "data": {
      "id": "sw-ep4",
      "tmdbId": 11,
      "mediaType": "movie",
      "title": "Episode IV: A New Hope",
      "releaseYear": "1977",
      "chronologicalYear": "0 BBY",
      "posterPath": "/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
      "rating": 8.2,
      "phase": "Age of Rebellion",
      "canonType": "canon",
      "branchName": "Skywalker Saga",
      "isAnchor": true
    }
  },
  {
    "id": "sw-ep5",
    "type": "mediaNode",
    "position": {
      "x": 2240,
      "y": 450
    },
    "data": {
      "id": "sw-ep5",
      "tmdbId": 1891,
      "mediaType": "movie",
      "title": "Episode V: The Empire Strikes Back",
      "releaseYear": "1980",
      "chronologicalYear": "3 ABY",
      "posterPath": "/nNAeTmF4CtdSgMDplXTDPOpYzsX.jpg",
      "rating": 8.4,
      "phase": "Age of Rebellion",
      "canonType": "canon",
      "branchName": "Skywalker Saga",
      "isAnchor": true
    }
  },
  {
    "id": "sw-ep6",
    "type": "mediaNode",
    "position": {
      "x": 2420,
      "y": 450
    },
    "data": {
      "id": "sw-ep6",
      "tmdbId": 1892,
      "mediaType": "movie",
      "title": "Episode VI: Return of the Jedi",
      "releaseYear": "1983",
      "chronologicalYear": "4 ABY",
      "posterPath": "/xxX5f1xP85t89f3x7nKmXNZsYo.jpg",
      "rating": 8,
      "phase": "Age of Rebellion",
      "canonType": "canon",
      "branchName": "Skywalker Saga",
      "isAnchor": true
    }
  },
  {
    "id": "sw-mando-s1-2",
    "type": "mediaNode",
    "position": {
      "x": 2600,
      "y": 720
    },
    "data": {
      "id": "sw-mando-s1-2",
      "tmdbId": 82856,
      "mediaType": "tv",
      "title": "The Mandalorian (Seasons 1-2)",
      "releaseYear": "2019–2020",
      "chronologicalYear": "9 ABY",
      "posterPath": "/eU1i6eHXlzMOlEq0ku1R07Y87Nu.jpg",
      "rating": 8.4,
      "phase": "The New Republic",
      "canonType": "spinoff",
      "branchName": "The New Republic",
      "isAnchor": false
    }
  },
  {
    "id": "sw-boba-fett",
    "type": "mediaNode",
    "position": {
      "x": 2735,
      "y": 720
    },
    "data": {
      "id": "sw-boba-fett",
      "tmdbId": 115036,
      "mediaType": "tv",
      "title": "The Book of Boba Fett",
      "releaseYear": "2021",
      "chronologicalYear": "9 ABY",
      "posterPath": "/gNbdjDi1HamTCZa1jypEox89Fd6.jpg",
      "rating": 7.1,
      "phase": "The New Republic",
      "canonType": "spinoff",
      "branchName": "The New Republic",
      "isAnchor": false
    }
  },
  {
    "id": "sw-mando-s3",
    "type": "mediaNode",
    "position": {
      "x": 2870,
      "y": 720
    },
    "data": {
      "id": "sw-mando-s3",
      "tmdbId": 82856,
      "mediaType": "tv",
      "title": "The Mandalorian (Season 3)",
      "releaseYear": "2023",
      "chronologicalYear": "9 ABY",
      "posterPath": "/eU1i6eHXlzMOlEq0ku1R07Y87Nu.jpg",
      "rating": 8,
      "phase": "The New Republic",
      "canonType": "spinoff",
      "branchName": "The New Republic",
      "isAnchor": false
    }
  },
  {
    "id": "sw-ahsoka",
    "type": "mediaNode",
    "position": {
      "x": 3005,
      "y": 720
    },
    "data": {
      "id": "sw-ahsoka",
      "tmdbId": 114463,
      "mediaType": "tv",
      "title": "Ahsoka",
      "releaseYear": "2023",
      "chronologicalYear": "9–10 ABY",
      "posterPath": "/x7NsLNxnnX2ZslWJtF9d3qX3w9.jpg",
      "rating": 7.6,
      "phase": "The New Republic",
      "canonType": "spinoff",
      "branchName": "The New Republic",
      "isAnchor": false
    }
  },
  {
    "id": "sw-skeleton-crew",
    "type": "mediaNode",
    "position": {
      "x": 3140,
      "y": 720
    },
    "data": {
      "id": "sw-skeleton-crew",
      "tmdbId": 202878,
      "mediaType": "tv",
      "title": "Star Wars: Skeleton Crew",
      "releaseYear": "2024",
      "chronologicalYear": "9 ABY",
      "posterPath": "/mztdtZqDmm57Fz5VG7ZrZqNocAi.jpg",
      "rating": 7.4,
      "phase": "The New Republic",
      "canonType": "spinoff",
      "branchName": "The New Republic",
      "isAnchor": false
    }
  },
  {
    "id": "sw-resistance",
    "type": "mediaNode",
    "position": {
      "x": 2600,
      "y": 450
    },
    "data": {
      "id": "sw-resistance",
      "tmdbId": 79240,
      "mediaType": "tv",
      "title": "Star Wars: Resistance",
      "releaseYear": "2018–2020",
      "chronologicalYear": "34–35 ABY",
      "posterPath": "/WGyAyBPncfuu8MZhLY9RtfZPM0.jpg",
      "rating": 6.2,
      "phase": "First Order Rising",
      "canonType": "canon",
      "isAnchor": false
    }
  },
  {
    "id": "sw-ep7",
    "type": "mediaNode",
    "position": {
      "x": 2735,
      "y": 450
    },
    "data": {
      "id": "sw-ep7",
      "tmdbId": 140607,
      "mediaType": "movie",
      "title": "Episode VII: The Force Awakens",
      "releaseYear": "2015",
      "chronologicalYear": "34 ABY",
      "posterPath": "/wqnLenjxBT5nAU30q9qumVvxTYx.jpg",
      "rating": 7.3,
      "phase": "First Order Rising",
      "canonType": "canon",
      "branchName": "Skywalker Saga",
      "isAnchor": true
    }
  },
  {
    "id": "sw-ep8",
    "type": "mediaNode",
    "position": {
      "x": 2915,
      "y": 450
    },
    "data": {
      "id": "sw-ep8",
      "tmdbId": 181808,
      "mediaType": "movie",
      "title": "Episode VIII: The Last Jedi",
      "releaseYear": "2017",
      "chronologicalYear": "34 ABY",
      "posterPath": "/kOVEVeg59E0wsnXmY9n5i2830f.jpg",
      "rating": 6.8,
      "phase": "First Order Rising",
      "canonType": "canon",
      "branchName": "Skywalker Saga",
      "isAnchor": true
    }
  },
  {
    "id": "sw-ep9",
    "type": "mediaNode",
    "position": {
      "x": 3095,
      "y": 450
    },
    "data": {
      "id": "sw-ep9",
      "tmdbId": 181812,
      "mediaType": "movie",
      "title": "Episode IX: The Rise of Skywalker",
      "releaseYear": "2019",
      "chronologicalYear": "35 ABY",
      "posterPath": "/db32LaOibwEliAmSL2jjqkoo5EL.jpg",
      "rating": 6.4,
      "phase": "First Order Rising",
      "canonType": "canon",
      "branchName": "Skywalker Saga",
      "isAnchor": true
    }
  }
],
  edges: [
  {
    "id": "edge-sw-acolyte-sw-young-jedi",
    "source": "sw-acolyte",
    "target": "sw-young-jedi"
  },
  {
    "id": "edge-sw-young-jedi-sw-ep1",
    "source": "sw-young-jedi",
    "target": "sw-ep1"
  },
  {
    "id": "edge-sw-ep1-sw-tales-jedi",
    "source": "sw-ep1",
    "target": "sw-tales-jedi"
  },
  {
    "id": "edge-sw-tales-jedi-sw-ep2",
    "source": "sw-tales-jedi",
    "target": "sw-ep2"
  },
  {
    "id": "edge-sw-ep2-sw-clone-wars-movie",
    "source": "sw-ep2",
    "target": "sw-clone-wars-movie"
  },
  {
    "id": "edge-sw-clone-wars-movie-sw-clone-wars-tv",
    "source": "sw-clone-wars-movie",
    "target": "sw-clone-wars-tv"
  },
  {
    "id": "edge-sw-clone-wars-tv-sw-ep3",
    "source": "sw-clone-wars-tv",
    "target": "sw-ep3"
  },
  {
    "id": "edge-sw-ep3-sw-tales-empire",
    "source": "sw-ep3",
    "target": "sw-tales-empire"
  },
  {
    "id": "edge-sw-tales-empire-sw-bad-batch",
    "source": "sw-tales-empire",
    "target": "sw-bad-batch"
  },
  {
    "id": "edge-sw-bad-batch-sw-solo",
    "source": "sw-bad-batch",
    "target": "sw-solo"
  },
  {
    "id": "edge-sw-solo-sw-obi-wan",
    "source": "sw-solo",
    "target": "sw-obi-wan"
  },
  {
    "id": "edge-sw-obi-wan-sw-rebels",
    "source": "sw-obi-wan",
    "target": "sw-rebels"
  },
  {
    "id": "edge-sw-rebels-sw-andor",
    "source": "sw-rebels",
    "target": "sw-andor"
  },
  {
    "id": "edge-sw-andor-sw-rogue-one",
    "source": "sw-andor",
    "target": "sw-rogue-one"
  },
  {
    "id": "edge-sw-rogue-one-sw-ep4",
    "source": "sw-rogue-one",
    "target": "sw-ep4"
  },
  {
    "id": "edge-sw-ep4-sw-ep5",
    "source": "sw-ep4",
    "target": "sw-ep5"
  },
  {
    "id": "edge-sw-ep5-sw-ep6",
    "source": "sw-ep5",
    "target": "sw-ep6"
  },
  {
    "id": "edge-sw-ep6-sw-mando-s1-2",
    "source": "sw-ep6",
    "target": "sw-mando-s1-2"
  },
  {
    "id": "edge-sw-mando-s1-2-sw-boba-fett",
    "source": "sw-mando-s1-2",
    "target": "sw-boba-fett"
  },
  {
    "id": "edge-sw-boba-fett-sw-mando-s3",
    "source": "sw-boba-fett",
    "target": "sw-mando-s3"
  },
  {
    "id": "edge-sw-mando-s3-sw-ahsoka",
    "source": "sw-mando-s3",
    "target": "sw-ahsoka"
  },
  {
    "id": "edge-sw-ahsoka-sw-skeleton-crew",
    "source": "sw-ahsoka",
    "target": "sw-skeleton-crew"
  },
  {
    "id": "edge-sw-skeleton-crew-sw-resistance",
    "source": "sw-skeleton-crew",
    "target": "sw-resistance"
  },
  {
    "id": "edge-sw-resistance-sw-ep7",
    "source": "sw-resistance",
    "target": "sw-ep7"
  },
  {
    "id": "edge-sw-ep7-sw-ep8",
    "source": "sw-ep7",
    "target": "sw-ep8"
  },
  {
    "id": "edge-sw-ep8-sw-ep9",
    "source": "sw-ep8",
    "target": "sw-ep9"
  }
],
};
