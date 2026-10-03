import { TimelineUniverse } from "@/types/timeline";

export const starWarsTimeline: TimelineUniverse = {
  id: "star-wars",
  name: "Star Wars Saga",
  shortName: "Star Wars",
  description:
    "Follow the Skywalker Saga, the rise of the Galactic Empire, the Age of Rebellion, and the Mandoverse in chronological galactic timeline (BBY/ABY).",
  accentColor: "#3B82F6",
  defaultFilterId: "all",
  filters: [
    {
      id: "all",
      label: "All Canon",
      description: "Skywalker Saga, Spin-offs, and Mandoverse",
    },
    {
      id: "skywalker",
      label: "Skywalker Saga Only",
      description: "Episodes I through IX",
    },
    {
      id: "mandoverse",
      label: "New Republic & Mandoverse",
      description: "The Mandalorian, Ahsoka, and The Book of Boba Fett",
    },
  ],
  nodes: [
    {
        "id": "sw-acolyte",
        "type": "mediaNode",
        "position": {
            "x": 100,
            "y": 300
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
            "x": 170,
            "y": 300
        },
        "data": {
            "id": "sw-young-jedi",
            "tmdbId": 202534,
            "mediaType": "tv",
            "title": "Young Jedi Adventures",
            "releaseYear": "2023",
            "chronologicalYear": "200 BBY",
            "posterPath": "/1jO6nqy1b764iV6G9Z0O4rM5V.jpg",
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
            "x": 320,
            "y": 300
        },
        "data": {
            "id": "sw-ep1",
            "tmdbId": 1893,
            "mediaType": "movie",
            "title": "Star Wars: Episode I - The Phantom Menace",
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
            "x": 950,
            "y": 80
        },
        "data": {
            "id": "sw-tales-jedi",
            "tmdbId": 202879,
            "mediaType": "tv",
            "title": "Tales of the Jedi",
            "releaseYear": "2022",
            "chronologicalYear": "36–19 BBY",
            "posterPath": "/lJ432uYw4wZ38oFq4u938wZ.jpg",
            "rating": 8.2,
            "phase": "Anthology",
            "canonType": "spinoff",
            "branchName": "Star Wars Tales",
            "isAnchor": false
        }
    },
    {
        "id": "sw-tales-empire",
        "type": "mediaNode",
        "position": {
            "x": 1250,
            "y": 80
        },
        "data": {
            "id": "sw-tales-empire",
            "tmdbId": 251785,
            "mediaType": "tv",
            "title": "Tales of the Empire",
            "releaseYear": "2024",
            "chronologicalYear": "20 BBY–0 ABY",
            "posterPath": "/4Xg3h6iO95jM4qAZ0whVh0P9GBh.jpg",
            "rating": 7.6,
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
            "x": 580,
            "y": 300
        },
        "data": {
            "id": "sw-ep2",
            "tmdbId": 1894,
            "mediaType": "movie",
            "title": "Star Wars: Episode II - Attack of the Clones",
            "releaseYear": "2002",
            "chronologicalYear": "22 BBY",
            "posterPath": "/oZNPzxqM2s5DyVWab09NTQScDQt.jpg",
            "rating": 6.6,
            "phase": "Fall of the Jedi",
            "canonType": "canon",
            "branchName": "Skywalker Saga",
            "isAnchor": true
        }
    },
    {
        "id": "sw-clonewars-movie",
        "type": "mediaNode",
        "position": {
            "x": 770,
            "y": 300
        },
        "data": {
            "id": "sw-clonewars-movie",
            "tmdbId": 12180,
            "mediaType": "movie",
            "title": "Star Wars: The Clone Wars",
            "releaseYear": "2008",
            "chronologicalYear": "22 BBY",
            "posterPath": "/hcvdeH9152O8wZ4rLg3K78T4d6.jpg",
            "rating": 6.2,
            "phase": "Reign of the Empire",
            "canonType": "canon",
            "isAnchor": false
        }
    },
    {
        "id": "sw-clonewars",
        "type": "mediaNode",
        "position": {
            "x": 880,
            "y": 300
        },
        "data": {
            "id": "sw-clonewars",
            "tmdbId": 4194,
            "mediaType": "tv",
            "title": "Star Wars: The Clone Wars",
            "releaseYear": "2008–2020",
            "chronologicalYear": "22 to 19 BBY",
            "posterPath": "/e1nWfnnCVqxS2LeTO3dwGyAsG2V.jpg",
            "rating": 8.5,
            "phase": "Reign of the Empire",
            "canonType": "canon",
            "branchName": "Clone Wars Era",
            "isAnchor": true
        }
    },
    {
        "id": "sw-ep3",
        "type": "mediaNode",
        "position": {
            "x": 1140,
            "y": 300
        },
        "data": {
            "id": "sw-ep3",
            "tmdbId": 1895,
            "mediaType": "movie",
            "title": "Star Wars: Episode III - Revenge of the Sith",
            "releaseYear": "2005",
            "chronologicalYear": "19 BBY",
            "posterPath": "/xfSAoBWiCdB6A0f9wZ4rLg3K.jpg",
            "rating": 7.4,
            "phase": "Fall of the Jedi",
            "canonType": "canon",
            "branchName": "Skywalker Saga",
            "isAnchor": true
        }
    },
    {
        "id": "sw-badbatch",
        "type": "mediaNode",
        "position": {
            "x": 1380,
            "y": 300
        },
        "data": {
            "id": "sw-badbatch",
            "tmdbId": 105971,
            "mediaType": "tv",
            "title": "Star Wars: The Bad Batch",
            "releaseYear": "2021–2024",
            "chronologicalYear": "19–18 BBY",
            "posterPath": "/WjPTSLpvGg9zYg639j2Pj3X8.jpg",
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
            "x": 1450,
            "y": 300
        },
        "data": {
            "id": "sw-solo",
            "tmdbId": 348350,
            "mediaType": "movie",
            "title": "Solo: A Star Wars Story",
            "releaseYear": "2018",
            "chronologicalYear": "13–10 BBY",
            "posterPath": "/4O9Xg3h6iO95jM4qAZ0whVh.jpg",
            "rating": 6.6,
            "phase": "Reign of the Empire",
            "canonType": "canon",
            "isAnchor": false
        }
    },
    {
        "id": "sw-obiwan",
        "type": "mediaNode",
        "position": {
            "x": 1520,
            "y": 300
        },
        "data": {
            "id": "sw-obiwan",
            "tmdbId": 92783,
            "mediaType": "tv",
            "title": "Obi-Wan Kenobi",
            "releaseYear": "2022",
            "chronologicalYear": "9 BBY",
            "posterPath": "/qJXZjAjSDxcvGBvj9wMgrghcyx.jpg",
            "rating": 7.2,
            "phase": "Reign of the Empire",
            "canonType": "canon",
            "isAnchor": false
        }
    },
    {
        "id": "sw-andor",
        "type": "mediaNode",
        "position": {
            "x": 1590,
            "y": 300
        },
        "data": {
            "id": "sw-andor",
            "tmdbId": 83867,
            "mediaType": "tv",
            "title": "Andor",
            "releaseYear": "2022–2025",
            "chronologicalYear": "5–0 BBY",
            "posterPath": "/59SVNw1P7mFu2xox0wN2BBY.jpg",
            "rating": 8.4,
            "phase": "Age of Rebellion",
            "canonType": "canon",
            "isAnchor": false
        }
    },
    {
        "id": "sw-rebels",
        "type": "mediaNode",
        "position": {
            "x": 1720,
            "y": 540
        },
        "data": {
            "id": "sw-rebels",
            "tmdbId": 60554,
            "mediaType": "tv",
            "title": "Star Wars Rebels",
            "releaseYear": "2014–2018",
            "chronologicalYear": "5–0 BBY",
            "posterPath": "/59SVNw1P7mFu2xox0wN2q9GBh.jpg",
            "rating": 7.9,
            "phase": "Age of Rebellion",
            "canonType": "canon",
            "branchName": "The Early Rebellion",
            "isAnchor": false
        }
    },
    {
        "id": "sw-rogue-one",
        "type": "mediaNode",
        "position": {
            "x": 1820,
            "y": 300
        },
        "data": {
            "id": "sw-rogue-one",
            "tmdbId": 330459,
            "mediaType": "movie",
            "title": "Rogue One: A Star Wars Story",
            "releaseYear": "2016",
            "chronologicalYear": "0 BBY, the days before ANH",
            "posterPath": "/qjiskwlV1oqQ05j9w0bUMMTg5.jpg",
            "rating": 7.5,
            "phase": "Age of Rebellion",
            "canonType": "canon",
            "isAnchor": true
        }
    },
    {
        "id": "sw-ep4",
        "type": "mediaNode",
        "position": {
            "x": 2060,
            "y": 300
        },
        "data": {
            "id": "sw-ep4",
            "tmdbId": 11,
            "mediaType": "movie",
            "title": "Star Wars: Episode IV - A New Hope",
            "releaseYear": "1977",
            "chronologicalYear": "0 BBY, the Battle of Yavin",
            "posterPath": "/6FfCtAuVAW8XJjZ7euf1293690.jpg",
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
            "x": 2300,
            "y": 300
        },
        "data": {
            "id": "sw-ep5",
            "tmdbId": 1891,
            "mediaType": "movie",
            "title": "Star Wars: Episode V - The Empire Strikes Back",
            "releaseYear": "1980",
            "chronologicalYear": "3 ABY",
            "posterPath": "/nNAeTmF4CtdSgIOru2e1Cf3a3V.jpg",
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
            "x": 2540,
            "y": 300
        },
        "data": {
            "id": "sw-ep6",
            "tmdbId": 1892,
            "mediaType": "movie",
            "title": "Star Wars: Episode VI - Return of the Jedi",
            "releaseYear": "1983",
            "chronologicalYear": "4 ABY",
            "posterPath": "/xx2xG0Oclh2e1jB3hA0T0Q1Xg5.jpg",
            "rating": 8,
            "phase": "Age of Rebellion",
            "canonType": "canon",
            "branchName": "Skywalker Saga",
            "isAnchor": true
        }
    },
    {
        "id": "sw-mando",
        "type": "mediaNode",
        "position": {
            "x": 2800,
            "y": 600
        },
        "data": {
            "id": "sw-mando",
            "tmdbId": 82856,
            "mediaType": "tv",
            "title": "The Mandalorian",
            "releaseYear": "2019–",
            "chronologicalYear": "9–11 ABY",
            "posterPath": "/eU1i6eHXlzMOlEq0ku1R07Y901.jpg",
            "rating": 8.4,
            "phase": "The New Republic",
            "canonType": "canon",
            "branchName": "The New Republic",
            "isAnchor": true
        }
    },
    {
        "id": "sw-bobafett",
        "type": "mediaNode",
        "position": {
            "x": 3020,
            "y": 600
        },
        "data": {
            "id": "sw-bobafett",
            "tmdbId": 115036,
            "mediaType": "tv",
            "title": "The Book of Boba Fett",
            "releaseYear": "2021",
            "chronologicalYear": "9 ABY",
            "posterPath": "/gNmnHbRz5g4eWkLcxr8wT4eQx0.jpg",
            "rating": 7.2,
            "phase": "The New Republic",
            "canonType": "canon",
            "branchName": "The New Republic",
            "isAnchor": false
        }
    },
    {
        "id": "sw-ahsoka",
        "type": "mediaNode",
        "position": {
            "x": 3090,
            "y": 600
        },
        "data": {
            "id": "sw-ahsoka",
            "tmdbId": 114463,
            "mediaType": "tv",
            "title": "Ahsoka",
            "releaseYear": "2023",
            "chronologicalYear": "9–11 ABY",
            "posterPath": "/laCJxWRO4293690whVh0P9GBh.jpg",
            "rating": 7.5,
            "phase": "The New Republic",
            "canonType": "canon",
            "branchName": "The New Republic",
            "isAnchor": false
        }
    },
    {
        "id": "sw-skeletoncrew",
        "type": "mediaNode",
        "position": {
            "x": 3160,
            "y": 600
        },
        "data": {
            "id": "sw-skeletoncrew",
            "tmdbId": 202879,
            "mediaType": "tv",
            "title": "Skeleton Crew",
            "releaseYear": "2024",
            "chronologicalYear": "9 ABY",
            "posterPath": "/v8Z6fWkLcxr8wT4eQx0y6i7U7r.jpg",
            "rating": 7.3,
            "phase": "The New Republic",
            "canonType": "canon",
            "branchName": "The New Republic",
            "isAnchor": false
        }
    },
    {
        "id": "sw-resistance",
        "type": "mediaNode",
        "position": {
            "x": 2780,
            "y": 300
        },
        "data": {
            "id": "sw-resistance",
            "tmdbId": 79240,
            "mediaType": "tv",
            "title": "Star Wars Resistance",
            "releaseYear": "2018–2020",
            "chronologicalYear": "34 ABY",
            "posterPath": "/9K3lbMf8TKvL9xGEbzi7TggWCN.jpg",
            "rating": 6.2,
            "phase": "Rise of the First Order",
            "canonType": "canon",
            "isAnchor": false
        }
    },
    {
        "id": "sw-ep7",
        "type": "mediaNode",
        "position": {
            "x": 2900,
            "y": 300
        },
        "data": {
            "id": "sw-ep7",
            "tmdbId": 140607,
            "mediaType": "movie",
            "title": "Star Wars: Episode VII - The Force Awakens",
            "releaseYear": "2015",
            "chronologicalYear": "34 ABY",
            "posterPath": "/wqnLdwVXo5QoOkr9w0bUMMTg5.jpg",
            "rating": 7.3,
            "phase": "Rise of the First Order",
            "canonType": "canon",
            "branchName": "Skywalker Saga",
            "isAnchor": true
        }
    },
    {
        "id": "sw-ep8",
        "type": "mediaNode",
        "position": {
            "x": 3140,
            "y": 300
        },
        "data": {
            "id": "sw-ep8",
            "tmdbId": 181808,
            "mediaType": "movie",
            "title": "Star Wars: Episode VIII - The Last Jedi",
            "releaseYear": "2017",
            "chronologicalYear": "34 ABY",
            "posterPath": "/kOVEVeg59E0yW2b1q7x473qP.jpg",
            "rating": 6.8,
            "phase": "Rise of the First Order",
            "canonType": "canon",
            "branchName": "Skywalker Saga",
            "isAnchor": true
        }
    },
    {
        "id": "sw-ep9",
        "type": "mediaNode",
        "position": {
            "x": 3380,
            "y": 300
        },
        "data": {
            "id": "sw-ep9",
            "tmdbId": 181812,
            "mediaType": "movie",
            "title": "Star Wars: Episode IX - The Rise of Skywalker",
            "releaseYear": "2019",
            "chronologicalYear": "35 ABY",
            "posterPath": "/db32laOsbw2e1jB3hA0T0Q1Xg.jpg",
            "rating": 6.4,
            "phase": "Rise of the First Order",
            "canonType": "canon",
            "branchName": "Skywalker Saga",
            "isAnchor": true
        }
    }
],
  edges: [
    {
        "id": "e-sw-acolyte-youngjedi",
        "source": "sw-acolyte",
        "target": "sw-young-jedi",
        "branchVariant": "sacred"
    },
    {
        "id": "e-sw-youngjedi-ep1",
        "source": "sw-young-jedi",
        "target": "sw-ep1",
        "branchVariant": "sacred"
    },
    {
        "id": "e-sw-ep1-ep2",
        "source": "sw-ep1",
        "target": "sw-ep2",
        "branchVariant": "sacred"
    },
    {
        "id": "e-sw-tales-fork",
        "source": "sw-ep1",
        "target": "sw-tales-jedi",
        "sourceHandle": "top",
        "label": "STAR WARS TALES",
        "description": "Anthology shorts exploring pivotal formative moments of Jedi masters and imperial inquisitors.",
        "branchVariant": "secondary",
        "isDashed": true,
        "strokeColor": "#71717a"
    },
    {
        "id": "e-sw-tales-track",
        "source": "sw-tales-jedi",
        "target": "sw-tales-empire",
        "branchVariant": "secondary",
        "isDashed": true,
        "strokeColor": "#71717a"
    },
    {
        "id": "e-sw-ep2-cwmovie",
        "source": "sw-ep2",
        "target": "sw-clonewars-movie",
        "branchVariant": "sacred"
    },
    {
        "id": "e-sw-cwmovie-clonewars",
        "source": "sw-clonewars-movie",
        "target": "sw-clonewars",
        "branchVariant": "sacred"
    },
    {
        "id": "e-sw-clonewars-ep3",
        "source": "sw-clonewars",
        "target": "sw-ep3",
        "branchVariant": "sacred"
    },
    {
        "id": "e-sw-ep3-badbatch",
        "source": "sw-ep3",
        "target": "sw-badbatch",
        "branchVariant": "sacred"
    },
    {
        "id": "e-sw-badbatch-solo",
        "source": "sw-badbatch",
        "target": "sw-solo",
        "branchVariant": "sacred"
    },
    {
        "id": "e-sw-solo-obiwan",
        "source": "sw-solo",
        "target": "sw-obiwan",
        "branchVariant": "sacred"
    },
    {
        "id": "e-sw-obiwan-andor",
        "source": "sw-obiwan",
        "target": "sw-andor",
        "branchVariant": "sacred"
    },
    {
        "id": "e-sw-andor-rogueone",
        "source": "sw-andor",
        "target": "sw-rogue-one",
        "branchVariant": "sacred"
    },
    {
        "id": "e-sw-rebellion-fork",
        "source": "sw-ep3",
        "target": "sw-rebels",
        "sourceHandle": "bottom",
        "label": "THE EARLY REBELLION",
        "description": "The secret spark of rebellion ignites across the galaxy among disparate cells standing against the Empire.",
        "branchVariant": "secondary",
        "strokeColor": "#52525b"
    },
    {
        "id": "e-sw-rebellion-merge",
        "source": "sw-rebels",
        "target": "sw-rogue-one",
        "targetHandle": "target-bottom",
        "branchVariant": "secondary",
        "strokeColor": "#52525b"
    },
    {
        "id": "e-sw-rogueone-ep4",
        "source": "sw-rogue-one",
        "target": "sw-ep4",
        "branchVariant": "sacred"
    },
    {
        "id": "e-sw-ep4-ep5",
        "source": "sw-ep4",
        "target": "sw-ep5",
        "branchVariant": "sacred"
    },
    {
        "id": "e-sw-ep5-ep6",
        "source": "sw-ep5",
        "target": "sw-ep6",
        "branchVariant": "sacred"
    },
    {
        "id": "e-sw-newrepublic-fork",
        "source": "sw-ep6",
        "target": "sw-mando",
        "sourceHandle": "bottom",
        "label": "THE NEW REPUBLIC",
        "description": "In the lawless outer reaches after the fall of the Empire, a lone Mandalorian gunfighter navigates the emerging New Republic.",
        "branchVariant": "secondary",
        "strokeColor": "#52525b"
    },
    {
        "id": "e-sw-mando-bobafett",
        "source": "sw-mando",
        "target": "sw-bobafett",
        "branchVariant": "secondary",
        "strokeColor": "#52525b"
    },
    {
        "id": "e-sw-bobafett-ahsoka",
        "source": "sw-bobafett",
        "target": "sw-ahsoka",
        "branchVariant": "secondary",
        "strokeColor": "#52525b"
    },
    {
        "id": "e-sw-ahsoka-skeletoncrew",
        "source": "sw-ahsoka",
        "target": "sw-skeletoncrew",
        "branchVariant": "secondary",
        "strokeColor": "#52525b"
    },
    {
        "id": "e-sw-ep6-resistance",
        "source": "sw-ep6",
        "target": "sw-resistance",
        "branchVariant": "sacred"
    },
    {
        "id": "e-sw-resistance-ep7",
        "source": "sw-resistance",
        "target": "sw-ep7",
        "branchVariant": "sacred"
    },
    {
        "id": "e-sw-ep7-ep8",
        "source": "sw-ep7",
        "target": "sw-ep8",
        "branchVariant": "sacred"
    },
    {
        "id": "e-sw-ep8-ep9",
        "source": "sw-ep8",
        "target": "sw-ep9",
        "branchVariant": "sacred"
    }
],
};
