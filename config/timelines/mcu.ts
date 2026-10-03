import { TimelineUniverse } from "@/types/timeline";

export const mcuTimeline: TimelineUniverse = {
  id: "mcu",
  name: "Marvel Cinematic Universe",
  shortName: "MCU",
  description:
    "The complete Marvel Cinematic Universe arranged by in-universe chronology, including the Sacred Timeline, TVA, alternate universes, and multiverse branches.",
  accentColor: "#E50914",
  defaultFilterId: "all",
  filters: [
    {
      id: "all",
      label: "Complete Timeline",
      description: "Movies, series, specials, TVA stories, and alternate universes",
    },
    {
      id: "sacred",
      label: "Sacred Timeline",
      description: "Stories primarily occurring on the MCU main timeline",
    },
    {
      id: "tva",
      label: "TVA",
      description: "Stories taking place outside conventional time",
    },
    {
      id: "multiverse",
      label: "Multiverse",
      description: "Alternate timelines, realities, and universes",
    },
    {
      id: "anchors",
      label: "Key Events",
      description: "Major crossover events and timeline-defining moments",
    },
  ],
  nodes: [
    {
        "id": "mcu-eyes-wakanda",
        "type": "mediaNode",
        "position": {
            "x": 100,
            "y": 300
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
            "branchName": "Sacred Timeline",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-cap-1",
        "type": "mediaNode",
        "position": {
            "x": 340,
            "y": 300
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
            "branchName": "Sacred Timeline",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-agent-carter-one-shot",
        "type": "mediaNode",
        "position": {
            "x": 580,
            "y": 300
        },
        "data": {
            "id": "mcu-agent-carter-one-shot",
            "tmdbId": 231362,
            "mediaType": "movie",
            "title": "Agent Carter (One-Shot)",
            "releaseYear": "2013",
            "chronologicalYear": "1946",
            "posterPath": "/fc9eH0hGg6wBw54rLg3K78T4d6.jpg",
            "rating": 7.2,
            "phase": "Phase 2",
            "canonType": "sacred",
            "isAnchor": false,
            "isDoomsdayCanon": false
        }
    },
    {
        "id": "mcu-agent-carter-s1",
        "type": "mediaNode",
        "position": {
            "x": 655,
            "y": 300
        },
        "data": {
            "id": "mcu-agent-carter-s1",
            "tmdbId": 61550,
            "mediaType": "tv",
            "title": "Agent Carter (Season 1)",
            "releaseYear": "2015",
            "chronologicalYear": "1946",
            "posterPath": "/lsnMlcw4N57Gv9zYg639j2Pj3X8.jpg",
            "rating": 7.6,
            "phase": "Phase 2",
            "canonType": "sacred",
            "isAnchor": false,
            "isDoomsdayCanon": false
        }
    },
    {
        "id": "mcu-agent-carter-s2",
        "type": "mediaNode",
        "position": {
            "x": 730,
            "y": 300
        },
        "data": {
            "id": "mcu-agent-carter-s2",
            "tmdbId": 61550,
            "mediaType": "tv",
            "title": "Agent Carter (Season 2)",
            "releaseYear": "2016",
            "chronologicalYear": "1947",
            "posterPath": "/lsnMlcw4N57Gv9zYg639j2Pj3X8.jpg",
            "rating": 7.5,
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
            "x": 805,
            "y": 300
        },
        "data": {
            "id": "mcu-cap-marvel",
            "tmdbId": 299537,
            "mediaType": "movie",
            "title": "Captain Marvel",
            "releaseYear": "2019",
            "chronologicalYear": "1995",
            "posterPath": "/AtsgWhDnHTq68L0lLsUrCnM7Tgp.jpg",
            "rating": 6.9,
            "phase": "Phase 3",
            "canonType": "sacred",
            "branchName": "Sacred Timeline",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-ironman-1",
        "type": "mediaNode",
        "position": {
            "x": 1045,
            "y": 300
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
            "x": 1285,
            "y": 300
        },
        "data": {
            "id": "mcu-ironman-2",
            "tmdbId": 10138,
            "mediaType": "movie",
            "title": "Iron Man 2",
            "releaseYear": "2010",
            "chronologicalYear": "2010",
            "posterPath": "/6WBeq4jjq0esGQGQ56521rYgG1R.jpg",
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
            "x": 1360,
            "y": 300
        },
        "data": {
            "id": "mcu-hulk",
            "tmdbId": 1724,
            "mediaType": "movie",
            "title": "The Incredible Hulk",
            "releaseYear": "2008",
            "chronologicalYear": "2010",
            "posterPath": "/gKzYx79y0AQTL4UAi70Sl479vxJ.jpg",
            "rating": 6.2,
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
            "x": 1435,
            "y": 300
        },
        "data": {
            "id": "mcu-thor-1",
            "tmdbId": 10195,
            "mediaType": "movie",
            "title": "Thor",
            "releaseYear": "2011",
            "chronologicalYear": "2011",
            "posterPath": "/prSfAi1xGrhLQNxVSUFh61xQ4Qx.jpg",
            "rating": 6.8,
            "phase": "Phase 1",
            "canonType": "sacred",
            "isAnchor": false,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-avengers-1",
        "type": "mediaNode",
        "position": {
            "x": 1510,
            "y": 300
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
        "id": "mcu-ironman-3",
        "type": "mediaNode",
        "position": {
            "x": 1750,
            "y": 300
        },
        "data": {
            "id": "mcu-ironman-3",
            "tmdbId": 68721,
            "mediaType": "movie",
            "title": "Iron Man 3",
            "releaseYear": "2013",
            "chronologicalYear": "2012–2013",
            "posterPath": "/qhPtAc1TKbMPqNvcdXSXV9su9ws.jpg",
            "rating": 6.9,
            "phase": "Phase 2",
            "canonType": "sacred",
            "isAnchor": false,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-thor-2",
        "type": "mediaNode",
        "position": {
            "x": 1825,
            "y": 300
        },
        "data": {
            "id": "mcu-thor-2",
            "tmdbId": 76338,
            "mediaType": "movie",
            "title": "Thor: The Dark World",
            "releaseYear": "2013",
            "chronologicalYear": "2013",
            "posterPath": "/wp6Ox9OFJijlSNq9wzV94iM2u1Z.jpg",
            "rating": 6.5,
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
            "x": 1900,
            "y": 300
        },
        "data": {
            "id": "mcu-cap-2",
            "tmdbId": 100402,
            "mediaType": "movie",
            "title": "Captain America: The Winter Soldier",
            "releaseYear": "2014",
            "chronologicalYear": "2014",
            "posterPath": "/tVFRpFw3xTed5nGQqWLyFEvAhDX.jpg",
            "rating": 7.7,
            "phase": "Phase 2",
            "canonType": "sacred",
            "branchName": "Sacred Timeline",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-gotg-1",
        "type": "mediaNode",
        "position": {
            "x": 2140,
            "y": 300
        },
        "data": {
            "id": "mcu-gotg-1",
            "tmdbId": 118340,
            "mediaType": "movie",
            "title": "Guardians of the Galaxy",
            "releaseYear": "2014",
            "chronologicalYear": "2014",
            "posterPath": "/r2J02Z2OpNTctfOSN2Ydg395Yv3.jpg",
            "rating": 7.9,
            "phase": "Phase 2",
            "canonType": "sacred",
            "branchName": "Sacred Timeline",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-gotg-2",
        "type": "mediaNode",
        "position": {
            "x": 2380,
            "y": 300
        },
        "data": {
            "id": "mcu-gotg-2",
            "tmdbId": 283995,
            "mediaType": "movie",
            "title": "Guardians of the Galaxy Vol. 2",
            "releaseYear": "2017",
            "chronologicalYear": "2014",
            "posterPath": "/y4MBh0EjBlMuOzv9MFZazIuk0z5.jpg",
            "rating": 7.6,
            "phase": "Phase 3",
            "canonType": "sacred",
            "isAnchor": false,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-daredevil-s1",
        "type": "mediaNode",
        "position": {
            "x": 2455,
            "y": 300
        },
        "data": {
            "id": "mcu-daredevil-s1",
            "tmdbId": 61889,
            "mediaType": "tv",
            "title": "Daredevil (Season 1)",
            "releaseYear": "2015",
            "chronologicalYear": "2014–2015",
            "posterPath": "/QWbPaMw1XknON187Gq24zgUQXA.jpg",
            "rating": 8.1,
            "phase": "Defenders Saga",
            "canonType": "sacred",
            "universeId": "defenders",
            "isAnchor": false,
            "isDoomsdayCanon": false
        }
    },
    {
        "id": "mcu-avengers-2",
        "type": "mediaNode",
        "position": {
            "x": 2530,
            "y": 300
        },
        "data": {
            "id": "mcu-avengers-2",
            "tmdbId": 99861,
            "mediaType": "movie",
            "title": "Avengers: Age of Ultron",
            "releaseYear": "2015",
            "chronologicalYear": "2015",
            "posterPath": "/4ssDuvEDkS9N58hs1nUVIMWph2T.jpg",
            "rating": 7.3,
            "phase": "Phase 2",
            "canonType": "sacred",
            "branchName": "Sacred Timeline",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-antman-1",
        "type": "mediaNode",
        "position": {
            "x": 2770,
            "y": 300
        },
        "data": {
            "id": "mcu-antman-1",
            "tmdbId": 102899,
            "mediaType": "movie",
            "title": "Ant-Man",
            "releaseYear": "2015",
            "chronologicalYear": "2015",
            "posterPath": "/8qlGQEIfomslTByzgGfNqv8sEw8.jpg",
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
            "x": 2845,
            "y": 300
        },
        "data": {
            "id": "mcu-cap-3",
            "tmdbId": 271110,
            "mediaType": "movie",
            "title": "Captain America: Civil War",
            "releaseYear": "2016",
            "chronologicalYear": "2016",
            "posterPath": "/rAGvd5820WSviYm47lZtEBPjZ1t.jpg",
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
            "x": 3085,
            "y": 300
        },
        "data": {
            "id": "mcu-black-widow",
            "tmdbId": 497698,
            "mediaType": "movie",
            "title": "Black Widow",
            "releaseYear": "2021",
            "chronologicalYear": "2016",
            "posterPath": "/qAZ0whVh0PpPhurU0u145qKx8uq.jpg",
            "rating": 7.2,
            "phase": "Phase 4",
            "canonType": "sacred",
            "isAnchor": false,
            "isDoomsdayCanon": false
        }
    },
    {
        "id": "mcu-black-panther",
        "type": "mediaNode",
        "position": {
            "x": 3160,
            "y": 300
        },
        "data": {
            "id": "mcu-black-panther",
            "tmdbId": 284054,
            "mediaType": "movie",
            "title": "Black Panther",
            "releaseYear": "2018",
            "chronologicalYear": "2016",
            "posterPath": "/uxzzxijgPIY7slzFvMotPv8wjKA.jpg",
            "rating": 7.4,
            "phase": "Phase 3",
            "canonType": "sacred",
            "branchName": "Sacred Timeline",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-spiderman-1",
        "type": "mediaNode",
        "position": {
            "x": 3400,
            "y": 300
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
            "branchName": "Sacred Timeline",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-strange-1",
        "type": "mediaNode",
        "position": {
            "x": 3640,
            "y": 300
        },
        "data": {
            "id": "mcu-strange-1",
            "tmdbId": 284052,
            "mediaType": "movie",
            "title": "Doctor Strange",
            "releaseYear": "2016",
            "chronologicalYear": "2016–2017",
            "posterPath": "/uGBVj3bEbCoZbDjjl9wMgrghcyx.jpg",
            "rating": 7.4,
            "phase": "Phase 3",
            "canonType": "sacred",
            "branchName": "Sacred Timeline",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-thor-3",
        "type": "mediaNode",
        "position": {
            "x": 3880,
            "y": 300
        },
        "data": {
            "id": "mcu-thor-3",
            "tmdbId": 284053,
            "mediaType": "movie",
            "title": "Thor: Ragnarok",
            "releaseYear": "2017",
            "chronologicalYear": "2017",
            "posterPath": "/rzRwTcFvttcN1ZpX2xv4jCYtSd8.jpg",
            "rating": 7.6,
            "phase": "Phase 3",
            "canonType": "sacred",
            "branchName": "Sacred Timeline",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-antman-2",
        "type": "mediaNode",
        "position": {
            "x": 4120,
            "y": 300
        },
        "data": {
            "id": "mcu-antman-2",
            "tmdbId": 363088,
            "mediaType": "movie",
            "title": "Ant-Man and the Wasp",
            "releaseYear": "2018",
            "chronologicalYear": "2018",
            "posterPath": "/eivQmS3wqz9Q1vvtQ0k18k7L3U9.jpg",
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
            "x": 4195,
            "y": 300
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
            "x": 4435,
            "y": 300
        },
        "data": {
            "id": "mcu-avengers-4",
            "tmdbId": 299534,
            "mediaType": "movie",
            "title": "Avengers: Endgame",
            "releaseYear": "2019",
            "chronologicalYear": "2018–2023",
            "posterPath": "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
            "rating": 8.3,
            "phase": "Phase 3",
            "canonType": "sacred",
            "branchName": "Sacred Timeline",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-wandavision",
        "type": "mediaNode",
        "position": {
            "x": 4675,
            "y": 300
        },
        "data": {
            "id": "mcu-wandavision",
            "tmdbId": 85271,
            "mediaType": "tv",
            "title": "WandaVision",
            "releaseYear": "2021",
            "chronologicalYear": "2023",
            "posterPath": "/frobuzvA54fce0yW2b1q7x473qP.jpg",
            "rating": 8.2,
            "phase": "Phase 4",
            "canonType": "sacred",
            "branchName": "Sacred Timeline",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-falcon-winter-soldier",
        "type": "mediaNode",
        "position": {
            "x": 4915,
            "y": 300
        },
        "data": {
            "id": "mcu-falcon-winter-soldier",
            "tmdbId": 88396,
            "mediaType": "tv",
            "title": "The Falcon and the Winter Soldier",
            "releaseYear": "2021",
            "chronologicalYear": "2024",
            "posterPath": "/6kbAMLCfGlPYPtmiSfWbaVq5J5m.jpg",
            "rating": 7.5,
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
            "x": 4990,
            "y": 300
        },
        "data": {
            "id": "mcu-shangchi",
            "tmdbId": 566525,
            "mediaType": "movie",
            "title": "Shang-Chi and the Legend of the Ten Rings",
            "releaseYear": "2021",
            "chronologicalYear": "2024",
            "posterPath": "/1BIoJGKbXjdFDAvzyiBFsHNv6n5.jpg",
            "rating": 7.6,
            "phase": "Phase 4",
            "canonType": "sacred",
            "branchName": "Sacred Timeline",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-eternals",
        "type": "mediaNode",
        "position": {
            "x": 5230,
            "y": 300
        },
        "data": {
            "id": "mcu-eternals",
            "tmdbId": 524434,
            "mediaType": "movie",
            "title": "Eternals",
            "releaseYear": "2021",
            "chronologicalYear": "2024",
            "posterPath": "/bcCBq9N1EMo3daNIjWJ8kYRU6O7.jpg",
            "rating": 6.9,
            "phase": "Phase 4",
            "canonType": "sacred",
            "isAnchor": false,
            "isDoomsdayCanon": false
        }
    },
    {
        "id": "mcu-spiderman-2",
        "type": "mediaNode",
        "position": {
            "x": 5305,
            "y": 300
        },
        "data": {
            "id": "mcu-spiderman-2",
            "tmdbId": 429617,
            "mediaType": "movie",
            "title": "Spider-Man: Far From Home",
            "releaseYear": "2019",
            "chronologicalYear": "2024",
            "posterPath": "/4q2NNZ4hxHeRpRm7NEhuYqund0U.jpg",
            "rating": 7.5,
            "phase": "Phase 3",
            "canonType": "sacred",
            "universeId": "spider-man",
            "isAnchor": false,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-spiderman-3",
        "type": "mediaNode",
        "position": {
            "x": 5380,
            "y": 300
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
        "id": "mcu-hawkeye",
        "type": "mediaNode",
        "position": {
            "x": 5620,
            "y": 300
        },
        "data": {
            "id": "mcu-hawkeye",
            "tmdbId": 88329,
            "mediaType": "tv",
            "title": "Hawkeye",
            "releaseYear": "2021",
            "chronologicalYear": "2024 (Christmas)",
            "posterPath": "/pqzjCxPVc9vVg78k73Y9015cT2m.jpg",
            "rating": 7.7,
            "phase": "Phase 4",
            "canonType": "sacred",
            "isAnchor": false,
            "isDoomsdayCanon": false
        }
    },
    {
        "id": "mcu-doctor-strange-2",
        "type": "mediaNode",
        "position": {
            "x": 5695,
            "y": 300
        },
        "data": {
            "id": "mcu-doctor-strange-2",
            "tmdbId": 453395,
            "mediaType": "movie",
            "title": "Doctor Strange in the Multiverse of Madness",
            "releaseYear": "2022",
            "chronologicalYear": "2024–2025",
            "posterPath": "/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
            "rating": 7.3,
            "phase": "Phase 4",
            "canonType": "sacred",
            "branchName": "Sacred Timeline",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-moon-knight",
        "type": "mediaNode",
        "position": {
            "x": 5935,
            "y": 300
        },
        "data": {
            "id": "mcu-moon-knight",
            "tmdbId": 92749,
            "mediaType": "tv",
            "title": "Moon Knight",
            "releaseYear": "2022",
            "chronologicalYear": "2025",
            "posterPath": "/YksR65as1pp52gkK78OzCW9w7w.jpg",
            "rating": 7.8,
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
            "x": 6010,
            "y": 300
        },
        "data": {
            "id": "mcu-ms-marvel",
            "tmdbId": 92782,
            "mediaType": "tv",
            "title": "Ms. Marvel",
            "releaseYear": "2022",
            "chronologicalYear": "2025",
            "posterPath": "/4r83z1v83K5Kk8f9g45f4T5X8.jpg",
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
            "x": 6085,
            "y": 300
        },
        "data": {
            "id": "mcu-thor-4",
            "tmdbId": 616037,
            "mediaType": "movie",
            "title": "Thor: Love and Thunder",
            "releaseYear": "2022",
            "chronologicalYear": "2025",
            "posterPath": "/pIkRyD18kl4F0b6NXmHt7q9Fk.jpg",
            "rating": 6.4,
            "phase": "Phase 4",
            "canonType": "sacred",
            "isAnchor": false,
            "isDoomsdayCanon": false
        }
    },
    {
        "id": "mcu-werewolf-by-night",
        "type": "mediaNode",
        "position": {
            "x": 6160,
            "y": 300
        },
        "data": {
            "id": "mcu-werewolf-by-night",
            "tmdbId": 1024535,
            "mediaType": "movie",
            "title": "Werewolf by Night",
            "releaseYear": "2022",
            "chronologicalYear": "2025",
            "posterPath": "/mvIvNKQIaqFH0kZ9oO4f56f1.jpg",
            "rating": 7,
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
            "x": 6235,
            "y": 300
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
            "branchName": "Sacred Timeline",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-gotg-holiday",
        "type": "mediaNode",
        "position": {
            "x": 6475,
            "y": 300
        },
        "data": {
            "id": "mcu-gotg-holiday",
            "tmdbId": 774752,
            "mediaType": "movie",
            "title": "The Guardians of the Galaxy Holiday Special",
            "releaseYear": "2022",
            "chronologicalYear": "2025 (Holiday)",
            "posterPath": "/8dqX2KKMzpnggyYAW7JyodUXgl7.jpg",
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
            "x": 6550,
            "y": 300
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
            "branchName": "Sacred Timeline",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-gotg-3",
        "type": "mediaNode",
        "position": {
            "x": 6790,
            "y": 300
        },
        "data": {
            "id": "mcu-gotg-3",
            "tmdbId": 447365,
            "mediaType": "movie",
            "title": "Guardians of the Galaxy Vol. 3",
            "releaseYear": "2023",
            "chronologicalYear": "2026",
            "posterPath": "/r2J02Z2OpNTctfOSN2Ydg395Yv3.jpg",
            "rating": 7.9,
            "phase": "Phase 5",
            "canonType": "sacred",
            "branchName": "Sacred Timeline",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-secret-invasion",
        "type": "mediaNode",
        "position": {
            "x": 7030,
            "y": 300
        },
        "data": {
            "id": "mcu-secret-invasion",
            "tmdbId": 114479,
            "mediaType": "tv",
            "title": "Secret Invasion",
            "releaseYear": "2023",
            "chronologicalYear": "2026",
            "posterPath": "/f5f3TEXdRLAoPpww90cregp8qlP.jpg",
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
            "x": 7105,
            "y": 300
        },
        "data": {
            "id": "mcu-marvels",
            "tmdbId": 609681,
            "mediaType": "movie",
            "title": "The Marvels",
            "releaseYear": "2023",
            "chronologicalYear": "2026",
            "posterPath": "/9GBhzXMFjgcZ3FdR9w0bUMMTg5.jpg",
            "rating": 6.2,
            "phase": "Phase 5",
            "canonType": "sacred",
            "branchName": "Sacred Timeline",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-echo",
        "type": "mediaNode",
        "position": {
            "x": 7345,
            "y": 300
        },
        "data": {
            "id": "mcu-echo",
            "tmdbId": 138502,
            "mediaType": "tv",
            "title": "Echo",
            "releaseYear": "2024",
            "chronologicalYear": "2026",
            "posterPath": "/5n9ogv6P86Jj92T9Hl6r83K.jpg",
            "rating": 6.3,
            "phase": "Phase 5",
            "canonType": "sacred",
            "universeId": "defenders",
            "isAnchor": false,
            "isDoomsdayCanon": false
        }
    },
    {
        "id": "mcu-agatha",
        "type": "mediaNode",
        "position": {
            "x": 7420,
            "y": 300
        },
        "data": {
            "id": "mcu-agatha",
            "tmdbId": 138501,
            "mediaType": "tv",
            "title": "Agatha All Along",
            "releaseYear": "2024",
            "chronologicalYear": "2026",
            "posterPath": "/8vW5mE5j9w0bUMMTg5qAZ0whVh.jpg",
            "rating": 7.6,
            "phase": "Phase 5",
            "canonType": "sacred",
            "branchName": "Sacred Timeline",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-visionquest",
        "type": "mediaNode",
        "position": {
            "x": 7660,
            "y": 300
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
            "branchName": "Sacred Timeline",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-captain-america-4",
        "type": "mediaNode",
        "position": {
            "x": 7900,
            "y": 300
        },
        "data": {
            "id": "mcu-captain-america-4",
            "tmdbId": 823464,
            "mediaType": "movie",
            "title": "Captain America: Brave New World",
            "releaseYear": "2025",
            "chronologicalYear": "2026",
            "posterPath": "/pzId5v02Z8qY95jM4qAZ0whVh0P.jpg",
            "rating": 7.5,
            "phase": "Phase 5",
            "canonType": "sacred",
            "branchName": "Sacred Timeline",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-thunderbolts",
        "type": "mediaNode",
        "position": {
            "x": 8140,
            "y": 300
        },
        "data": {
            "id": "mcu-thunderbolts",
            "tmdbId": 757827,
            "mediaType": "movie",
            "title": "Thunderbolts*",
            "releaseYear": "2025",
            "chronologicalYear": "2026",
            "posterPath": "/ns6iK4fM95jM4qAZ0whVh0P9GBh.jpg",
            "rating": 7.7,
            "phase": "Phase 5",
            "canonType": "sacred",
            "branchName": "Sacred Timeline",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-ironheart",
        "type": "mediaNode",
        "position": {
            "x": 8380,
            "y": 300
        },
        "data": {
            "id": "mcu-ironheart",
            "tmdbId": 114478,
            "mediaType": "tv",
            "title": "Ironheart",
            "releaseYear": "2025",
            "chronologicalYear": "2026",
            "posterPath": "/78lPtwv72eTNqFW9COBYI0dWDJa.jpg",
            "rating": 7.2,
            "phase": "Phase 5",
            "canonType": "sacred",
            "isAnchor": false,
            "isDoomsdayCanon": false
        }
    },
    {
        "id": "mcu-wonder-man",
        "type": "mediaNode",
        "position": {
            "x": 8455,
            "y": 300
        },
        "data": {
            "id": "mcu-wonder-man",
            "tmdbId": 204541,
            "mediaType": "tv",
            "title": "Wonder Man",
            "releaseYear": "2025",
            "chronologicalYear": "2026",
            "posterPath": "/xDUoAsU8lQHOOoRkFiBuarmACDN.jpg",
            "rating": 7.5,
            "phase": "Phase 6",
            "canonType": "sacred",
            "isAnchor": false,
            "isDoomsdayCanon": false
        }
    },
    {
        "id": "mcu-daredevil-born-again-s1",
        "type": "mediaNode",
        "position": {
            "x": 8530,
            "y": 300
        },
        "data": {
            "id": "mcu-daredevil-born-again-s1",
            "tmdbId": 202555,
            "mediaType": "tv",
            "title": "Daredevil: Born Again (Season 1)",
            "releaseYear": "2025",
            "chronologicalYear": "2026",
            "posterPath": "/xDUoAsU8lQHOOoRkFiBuarmACDN.jpg",
            "rating": 8.2,
            "phase": "Phase 5",
            "canonType": "sacred",
            "universeId": "defenders",
            "isAnchor": true,
            "isDoomsdayCanon": false
        }
    },
    {
        "id": "mcu-punisher-one-last-kill",
        "type": "mediaNode",
        "position": {
            "x": 8770,
            "y": 300
        },
        "data": {
            "id": "mcu-punisher-one-last-kill",
            "tmdbId": 67178,
            "mediaType": "movie",
            "title": "The Punisher: One Last Kill",
            "releaseYear": "2026",
            "chronologicalYear": "2027",
            "posterPath": "/bjiS5ipwxb9JFy3XRRN4OAilSeX.jpg",
            "rating": 8,
            "phase": "Phase 6",
            "canonType": "sacred",
            "universeId": "defenders",
            "isAnchor": false,
            "isDoomsdayCanon": false
        }
    },
    {
        "id": "mcu-daredevil-born-again-s2",
        "type": "mediaNode",
        "position": {
            "x": 8845,
            "y": 300
        },
        "data": {
            "id": "mcu-daredevil-born-again-s2",
            "tmdbId": 202555,
            "mediaType": "tv",
            "title": "Daredevil: Born Again (Season 2)",
            "releaseYear": "2026",
            "chronologicalYear": "2027",
            "posterPath": "/xDUoAsU8lQHOOoRkFiBuarmACDN.jpg",
            "rating": 8.3,
            "phase": "Phase 6",
            "canonType": "sacred",
            "universeId": "defenders",
            "isAnchor": false,
            "isDoomsdayCanon": false
        }
    },
    {
        "id": "mcu-daredevil-born-again-s3",
        "type": "mediaNode",
        "position": {
            "x": 8920,
            "y": 300
        },
        "data": {
            "id": "mcu-daredevil-born-again-s3",
            "tmdbId": 202555,
            "mediaType": "tv",
            "title": "Daredevil: Born Again (Season 3)",
            "releaseYear": "2027",
            "chronologicalYear": "2027",
            "posterPath": "/xDUoAsU8lQHOOoRkFiBuarmACDN.jpg",
            "rating": 8.4,
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
            "x": 8995,
            "y": 300
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
            "branchName": "Sacred Timeline",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-avengers-doomsday",
        "type": "mediaNode",
        "position": {
            "x": 9235,
            "y": 300
        },
        "data": {
            "id": "mcu-avengers-doomsday",
            "tmdbId": 1003596,
            "mediaType": "movie",
            "title": "Avengers: Doomsday",
            "releaseYear": "2026",
            "chronologicalYear": "2027",
            "posterPath": "/jzPwsojjFStf5lR5Nm07w2hH56G.jpg",
            "rating": 8.8,
            "phase": "Phase 6",
            "canonType": "sacred",
            "branchName": "Multiverse Saga",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-avengers-secret-wars",
        "type": "mediaNode",
        "position": {
            "x": 9475,
            "y": 300
        },
        "data": {
            "id": "mcu-avengers-secret-wars",
            "tmdbId": 1003598,
            "mediaType": "movie",
            "title": "Avengers: Secret Wars",
            "releaseYear": "2027",
            "chronologicalYear": "2028",
            "posterPath": "/f0YBuh4hyiAheXhh4JnJWoKi9g5.jpg",
            "rating": 9,
            "phase": "Phase 6",
            "canonType": "sacred",
            "branchName": "Multiverse Saga Finale",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-ghost-rider",
        "type": "mediaNode",
        "position": {
            "x": 9715,
            "y": 300
        },
        "data": {
            "id": "mcu-ghost-rider",
            "tmdbId": 1738010,
            "mediaType": "movie",
            "title": "Ghost Rider",
            "releaseYear": "2028",
            "chronologicalYear": "2028 / TBD",
            "posterPath": "/zgC1zo3lyujoEiIMnUrHltvPmZg.jpg",
            "rating": 7.5,
            "phase": "Phase 7",
            "canonType": "sacred",
            "isAnchor": false,
            "isDoomsdayCanon": false
        }
    },
    {
        "id": "mcu-black-panther-3",
        "type": "mediaNode",
        "position": {
            "x": 9790,
            "y": 300
        },
        "data": {
            "id": "mcu-black-panther-3",
            "tmdbId": 1386618,
            "mediaType": "movie",
            "title": "Black Panther 3",
            "releaseYear": "2028",
            "chronologicalYear": "2028 / TBD",
            "posterPath": "/zJc9fYZxgq4yzI0Oru2e1Cf3a3V.jpg",
            "rating": 7.7,
            "phase": "Phase 7",
            "canonType": "sacred",
            "branchName": "Sacred Timeline",
            "isAnchor": true,
            "isDoomsdayCanon": false
        }
    },
    {
        "id": "mcu-xmen",
        "type": "mediaNode",
        "position": {
            "x": 10030,
            "y": 300
        },
        "data": {
            "id": "mcu-xmen",
            "tmdbId": 1293690,
            "mediaType": "movie",
            "title": "X-Men",
            "releaseYear": "TBA",
            "chronologicalYear": "Multiverse / TBD",
            "posterPath": "/jSn3jOzI91dOx4aVdfMrirWXH6R.jpg",
            "rating": 8.5,
            "phase": "Phase 7",
            "canonType": "multiverse",
            "universeId": "x-men",
            "branchName": "Mutant Saga",
            "isAnchor": true,
            "isDoomsdayCanon": false
        }
    },
    {
        "id": "mcu-fantastic-four",
        "type": "mediaNode",
        "position": {
            "x": 730,
            "y": 940
        },
        "data": {
            "id": "mcu-fantastic-four",
            "tmdbId": 533535,
            "mediaType": "movie",
            "title": "The Fantastic Four: First Steps",
            "releaseYear": "2025",
            "chronologicalYear": "1964 (Earth-828)",
            "posterPath": "/v8Z6fWkLcxr8wT4eQx0y6i7U7r.jpg",
            "rating": 8,
            "phase": "Phase 6",
            "canonType": "multiverse",
            "universeId": "fantastic-four",
            "branchName": "Earth-828",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-loki-s1",
        "type": "mediaNode",
        "position": {
            "x": 4675,
            "y": -120
        },
        "data": {
            "id": "mcu-loki-s1",
            "tmdbId": 84958,
            "mediaType": "tv",
            "title": "Loki",
            "releaseYear": "2021",
            "chronologicalYear": "Outside time",
            "posterPath": "/voHUmluYmKyleFk9a3xgHyKvIgH.jpg",
            "rating": 8.2,
            "phase": "Phase 4",
            "canonType": "tva",
            "branchName": "TVA",
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    },
    {
        "id": "mcu-loki-s2",
        "type": "mediaNode",
        "position": {
            "x": 7030,
            "y": -120
        },
        "data": {
            "id": "mcu-loki-s2",
            "tmdbId": 84958,
            "mediaType": "tv",
            "title": "Loki (Season 2)",
            "releaseYear": "2023",
            "chronologicalYear": "Outside time",
            "posterPath": "/voHUmluYmKyleFk9a3xgHyKvIgH.jpg",
            "rating": 8.3,
            "phase": "Phase 5",
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
            "x": 4990,
            "y": 680
        },
        "data": {
            "id": "mcu-what-if",
            "tmdbId": 91363,
            "mediaType": "tv",
            "title": "What If...?",
            "releaseYear": "2021–2024",
            "chronologicalYear": "Across the multiverse",
            "posterPath": "/g61eOclh2e1jB3hA0T0Q1Xg5m5p.jpg",
            "rating": 7.4,
            "phase": "Phase 4",
            "canonType": "multiverse",
            "branchName": "Multiverse",
            "isAnchor": true,
            "isDoomsdayCanon": false
        }
    },
    {
        "id": "mcu-deadpool-3",
        "type": "mediaNode",
        "position": {
            "x": 7105,
            "y": 680
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
            "isAnchor": true,
            "isDoomsdayCanon": true
        }
    }
],
  edges: [
    {
        "id": "e-main-mcu-eyes-wakanda-mcu-cap-1",
        "source": "mcu-eyes-wakanda",
        "target": "mcu-cap-1",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-cap-1-mcu-agent-carter-one-shot",
        "source": "mcu-cap-1",
        "target": "mcu-agent-carter-one-shot",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-agent-carter-one-shot-mcu-agent-carter-s1",
        "source": "mcu-agent-carter-one-shot",
        "target": "mcu-agent-carter-s1",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-agent-carter-s1-mcu-agent-carter-s2",
        "source": "mcu-agent-carter-s1",
        "target": "mcu-agent-carter-s2",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-agent-carter-s2-mcu-cap-marvel",
        "source": "mcu-agent-carter-s2",
        "target": "mcu-cap-marvel",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-cap-marvel-mcu-ironman-1",
        "source": "mcu-cap-marvel",
        "target": "mcu-ironman-1",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-ironman-1-mcu-ironman-2",
        "source": "mcu-ironman-1",
        "target": "mcu-ironman-2",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-ironman-2-mcu-hulk",
        "source": "mcu-ironman-2",
        "target": "mcu-hulk",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-hulk-mcu-thor-1",
        "source": "mcu-hulk",
        "target": "mcu-thor-1",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-thor-1-mcu-avengers-1",
        "source": "mcu-thor-1",
        "target": "mcu-avengers-1",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-avengers-1-mcu-ironman-3",
        "source": "mcu-avengers-1",
        "target": "mcu-ironman-3",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-ironman-3-mcu-thor-2",
        "source": "mcu-ironman-3",
        "target": "mcu-thor-2",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-thor-2-mcu-cap-2",
        "source": "mcu-thor-2",
        "target": "mcu-cap-2",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-cap-2-mcu-gotg-1",
        "source": "mcu-cap-2",
        "target": "mcu-gotg-1",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-gotg-1-mcu-gotg-2",
        "source": "mcu-gotg-1",
        "target": "mcu-gotg-2",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-gotg-2-mcu-daredevil-s1",
        "source": "mcu-gotg-2",
        "target": "mcu-daredevil-s1",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-daredevil-s1-mcu-avengers-2",
        "source": "mcu-daredevil-s1",
        "target": "mcu-avengers-2",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-avengers-2-mcu-antman-1",
        "source": "mcu-avengers-2",
        "target": "mcu-antman-1",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-antman-1-mcu-cap-3",
        "source": "mcu-antman-1",
        "target": "mcu-cap-3",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-cap-3-mcu-black-widow",
        "source": "mcu-cap-3",
        "target": "mcu-black-widow",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-black-widow-mcu-black-panther",
        "source": "mcu-black-widow",
        "target": "mcu-black-panther",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-black-panther-mcu-spiderman-1",
        "source": "mcu-black-panther",
        "target": "mcu-spiderman-1",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-spiderman-1-mcu-strange-1",
        "source": "mcu-spiderman-1",
        "target": "mcu-strange-1",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-strange-1-mcu-thor-3",
        "source": "mcu-strange-1",
        "target": "mcu-thor-3",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-thor-3-mcu-antman-2",
        "source": "mcu-thor-3",
        "target": "mcu-antman-2",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-antman-2-mcu-avengers-3",
        "source": "mcu-antman-2",
        "target": "mcu-avengers-3",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-avengers-3-mcu-avengers-4",
        "source": "mcu-avengers-3",
        "target": "mcu-avengers-4",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-avengers-4-mcu-wandavision",
        "source": "mcu-avengers-4",
        "target": "mcu-wandavision",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-wandavision-mcu-falcon-winter-soldier",
        "source": "mcu-wandavision",
        "target": "mcu-falcon-winter-soldier",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-falcon-winter-soldier-mcu-shangchi",
        "source": "mcu-falcon-winter-soldier",
        "target": "mcu-shangchi",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-shangchi-mcu-eternals",
        "source": "mcu-shangchi",
        "target": "mcu-eternals",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-eternals-mcu-spiderman-2",
        "source": "mcu-eternals",
        "target": "mcu-spiderman-2",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-spiderman-2-mcu-spiderman-3",
        "source": "mcu-spiderman-2",
        "target": "mcu-spiderman-3",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-spiderman-3-mcu-hawkeye",
        "source": "mcu-spiderman-3",
        "target": "mcu-hawkeye",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-hawkeye-mcu-doctor-strange-2",
        "source": "mcu-hawkeye",
        "target": "mcu-doctor-strange-2",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-doctor-strange-2-mcu-moon-knight",
        "source": "mcu-doctor-strange-2",
        "target": "mcu-moon-knight",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-moon-knight-mcu-ms-marvel",
        "source": "mcu-moon-knight",
        "target": "mcu-ms-marvel",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-ms-marvel-mcu-thor-4",
        "source": "mcu-ms-marvel",
        "target": "mcu-thor-4",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-thor-4-mcu-werewolf-by-night",
        "source": "mcu-thor-4",
        "target": "mcu-werewolf-by-night",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-werewolf-by-night-mcu-black-panther-2",
        "source": "mcu-werewolf-by-night",
        "target": "mcu-black-panther-2",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-black-panther-2-mcu-gotg-holiday",
        "source": "mcu-black-panther-2",
        "target": "mcu-gotg-holiday",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-gotg-holiday-mcu-antman-3",
        "source": "mcu-gotg-holiday",
        "target": "mcu-antman-3",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-antman-3-mcu-gotg-3",
        "source": "mcu-antman-3",
        "target": "mcu-gotg-3",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-gotg-3-mcu-secret-invasion",
        "source": "mcu-gotg-3",
        "target": "mcu-secret-invasion",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-secret-invasion-mcu-marvels",
        "source": "mcu-secret-invasion",
        "target": "mcu-marvels",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-marvels-mcu-echo",
        "source": "mcu-marvels",
        "target": "mcu-echo",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-echo-mcu-agatha",
        "source": "mcu-echo",
        "target": "mcu-agatha",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-agatha-mcu-visionquest",
        "source": "mcu-agatha",
        "target": "mcu-visionquest",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-visionquest-mcu-captain-america-4",
        "source": "mcu-visionquest",
        "target": "mcu-captain-america-4",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-captain-america-4-mcu-thunderbolts",
        "source": "mcu-captain-america-4",
        "target": "mcu-thunderbolts",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-thunderbolts-mcu-ironheart",
        "source": "mcu-thunderbolts",
        "target": "mcu-ironheart",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-ironheart-mcu-wonder-man",
        "source": "mcu-ironheart",
        "target": "mcu-wonder-man",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-wonder-man-mcu-daredevil-born-again-s1",
        "source": "mcu-wonder-man",
        "target": "mcu-daredevil-born-again-s1",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-daredevil-born-again-s1-mcu-punisher-one-last-kill",
        "source": "mcu-daredevil-born-again-s1",
        "target": "mcu-punisher-one-last-kill",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-punisher-one-last-kill-mcu-daredevil-born-again-s2",
        "source": "mcu-punisher-one-last-kill",
        "target": "mcu-daredevil-born-again-s2",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-daredevil-born-again-s2-mcu-daredevil-born-again-s3",
        "source": "mcu-daredevil-born-again-s2",
        "target": "mcu-daredevil-born-again-s3",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-daredevil-born-again-s3-mcu-spiderman-brand-new-day",
        "source": "mcu-daredevil-born-again-s3",
        "target": "mcu-spiderman-brand-new-day",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-spiderman-brand-new-day-mcu-avengers-doomsday",
        "source": "mcu-spiderman-brand-new-day",
        "target": "mcu-avengers-doomsday",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-avengers-doomsday-mcu-avengers-secret-wars",
        "source": "mcu-avengers-doomsday",
        "target": "mcu-avengers-secret-wars",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-avengers-secret-wars-mcu-ghost-rider",
        "source": "mcu-avengers-secret-wars",
        "target": "mcu-ghost-rider",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-ghost-rider-mcu-black-panther-3",
        "source": "mcu-ghost-rider",
        "target": "mcu-black-panther-3",
        "branchVariant": "sacred"
    },
    {
        "id": "e-main-mcu-black-panther-3-mcu-xmen",
        "source": "mcu-black-panther-3",
        "target": "mcu-xmen",
        "branchVariant": "sacred"
    },
    {
        "id": "e-agent-carter-fantastic-four",
        "source": "mcu-agent-carter-s2",
        "target": "mcu-fantastic-four",
        "sourceHandle": "bottom",
        "targetHandle": "target-top",
        "label": "EARTH-828 (1964)",
        "description": "A retro-futuristic alternate 1960s Earth where Marvel's First Family originates before crossing into the Sacred MCU.",
        "branchVariant": "multiverse",
        "strokeColor": "#38BDF8",
        "isDashed": true
    },
    {
        "id": "e-endgame-loki",
        "source": "mcu-avengers-1",
        "target": "mcu-loki-s1",
        "label": "TVA · OUTSIDE TIME",
        "description": "The Time Variance Authority lives outside time. This lane branches off the 2012 Battle of New York, by way of Endgame's time heist, and its thread runs on through Deadpool & Wolverine.",
        "branchVariant": "tva",
        "strokeColor": "#EAB308"
    },
    {
        "id": "e-loki1-loki2",
        "source": "mcu-loki-s1",
        "target": "mcu-loki-s2",
        "branchVariant": "tva",
        "strokeColor": "#EAB308"
    },
    {
        "id": "e-loki-whatif",
        "source": "mcu-loki-s1",
        "target": "mcu-what-if",
        "sourceHandle": "bottom",
        "targetHandle": "target-top",
        "label": "THE MULTIVERSE",
        "description": "Branching into infinite possibilities where critical Nexus events alter the destinies of heroes across alternate MCU realities.",
        "branchVariant": "multiverse",
        "strokeColor": "#A855F7",
        "isDashed": true
    },
    {
        "id": "e-loki2-deadpool",
        "source": "mcu-loki-s2",
        "target": "mcu-deadpool-3",
        "sourceHandle": "bottom",
        "targetHandle": "target-top",
        "label": "EARTH-10005 / THE VOID",
        "description": "The Fox X-Men Universe anchor-being dies, leading Wade Wilson through the TVA into The Void at the end of time.",
        "branchVariant": "multiverse",
        "strokeColor": "#EF4444",
        "isDashed": true
    },
    {
        "id": "e-deadpool-doomsday",
        "source": "mcu-deadpool-3",
        "target": "mcu-avengers-doomsday",
        "sourceHandle": "right",
        "targetHandle": "target-bottom",
        "label": "INCURSION CONVERGENCE",
        "description": "Multiverse realities collapse together as heroes and variants unite against Doctor Doom's cosmic conquest.",
        "branchVariant": "multiverse",
        "strokeColor": "#EC4899",
        "isDashed": true
    },
    {
        "id": "e-fantasticfour-doomsday",
        "source": "mcu-fantastic-four",
        "target": "mcu-avengers-doomsday",
        "sourceHandle": "right",
        "targetHandle": "target-bottom",
        "label": "EARTH-828 INVASION",
        "description": "The Fantastic Four cross dimensions into the primary timeline to confront the rising threat of Doom.",
        "branchVariant": "multiverse",
        "strokeColor": "#38BDF8",
        "isDashed": true
    }
],
};
