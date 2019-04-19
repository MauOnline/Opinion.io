"use strict"

var OIOJS = OIOJS || {};

OIOJS.mocks = {

  "doLogin": function () {
    return {
      "metadata": {
        "location": null,
      },
      "account": {
        "id": "0004",
        "firstname": "Azouwa",
        "surname": "Ogowé",
        "username": "Jonnhi 007",
        "email": "01nettv@mail.com"
      },
      "preferences": {
        "defaultPollType": null,
        "defaultPollTimer": null,
        "thumbnail": "https://someling.com/images.jpeg"
      },
      "favorites": {
        "tags": ["cinema", "politic"],
        "publishers": ["0003", "00001"],
        "polls": ["0123450", "0123456"]
      },
      "polls": ["0123459", "0123456"],
      "votes": []
    };
  },

  "getPolls": function () {
    return {
        "info": {},
        "error": {},
        "result": [{
            "id": "0123456",
            "publisher": {
                "code": "0003",
                "name": "GabonMP"
            },
            "tags": "PeoplE,Music,Entertainment",
            "lastUpdate": "17-11-2018",
            "description": "Who is the best person to replace Ali Bongo?",
            "type": "PROP",
            "propositions": [{
                    "label": "Yes",
                    "score": 50,
                    "color": "#28a745"
                }, {
                    "label": "No",
                    "score": 36,
                    "color": "#dc3545"
                }, {
                    "label": "Not sure",
                    "score": 23,
                    "color": "#ffc107"
                }]
        }, {
            "id": "0123457",
            "publisher": {
                "code": "00001",
                "name": "BBC Business"
            },
            "tags": "Environment",
            "lastUpdate": "17-11-2018",
            "description": "Do you think 2019 will be a good year for global finance?",
            "type": "PROP",
            "propositions":  [{
                    "label": "Yes",
                    "score": 89,
                    "color": "#28a745"
                }, {
                    "label": "No",
                    "score": 10,
                    "color": "#dc3545"
                }, {
                    "label": "Not sure",
                    "score": 0,
                    "color": "#ffc107"
                }]
        }, {
            "id": "01234578",
            "publisher": {
                "code": "00002",
                "name": "01Net TV"
            },
            "tags": "PeOple",
            "lastUpdate": "17-11-2018",
            "description": "What do you think of the new Freebox V7?",
            "type": "PROP",
            "propositions":  [{
                    "label": "Yes",
                    "score": 89,
                    "color": "#28a745"
                }, {
                    "label": "No",
                    "score": 10,
                    "color": "#dc3545"
                }, {
                    "label": "Not sure",
                    "score": 0,
                    "color": "#ffc107"
                }]
        }, {
            "id": "0123459",
            "publisher": {
                "code": "00004",
                "name": "Morpheus"
            },
            "tags": "Politic",
            "lastUpdate": "17-11-2018",
            "description": "Do you like Beyoncée ?",
            "type": "PROP",
            "propositions":  [{
                    "label": "Yes",
                    "score": 89,
                    "color": "#28a745"

                }, {
                    "label": "No",
                    "score": 10,
                    "color": "#dc3545"
                }, {
                    "label": "Not sure",
                    "score": 0,
                    "color": "#ffc107"
                }]
        }, {
            "id": "0123450",
            "publisher": {
                "code": "00001",
                "name": "BBC B"
            },
            "tags": "Cinema",
            "lastUpdate": "17-11-2018",
            "description": "Do you like Beyoncée ?",
            "type": "PROP",
            "propositions":  [{
                    "label": "Yes",
                    "score": 89,
                    "color": "#28a745"
                }, {
                    "label": "No",
                    "score": 10,
                    "color": "#dc3545"
                }, {
                    "label": "Not sure",
                    "score": 5,
                    "color": "#ffc107"
                }, {
                    "label": "I like her before",
                    "score": 10,
                    "color": "#2196f3"
                }, {
                    "label": "Only if she change her style",
                    "score": 30,
                    "color": "#673ab7"
                }]
        }, {
            "id": "012345",
            "publisher": {
                "code": "000012",
                "name": "Julien L."
            },
            "tags": "cinema,People",
            "description": "Is Idriss Elba the sexiest man on Earth?",
            "type": "PROP",
            "propositions": [{
                    "label": "Yes, he is",
                    "score": 50,
                    "color": "#28a745"
                }, {
                    "label": "No, I think many other men are more sexy",
                    "score": 45,
                    "color": "#dc3545"
                }]
        },
        {
            "id": "012345",
            "publisher": {
                "code": "00011",
                "name": "Rama Nahme"
            },
            "tags": "cinema,People",
            "description": "Is Idriss Elba the sexiest man on Earth?",
            "type": "PROP",
            "propositions":[{
                    "label": "Yes, he is",
                    "score": 50,
                    "color": "#28a745"
                }, {
                    "label": "No, I think many other men are more sexy",
                    "score": 45,
                    "color": "#dc3545"
                }]
        },
        {
            "id": "012345",
            "publisher": {
                "code": "00010",
                "name": "Henry Gibbs"
            },
            "tags": "cinema,People",
            "description": "Is Idriss Elba the sexiest man on Earth?",
            "type": "PROP",
            "propositions":  [{
                    "label": "Yes, he is",
                    "score": 50,
                    "color": "#28a745"
                }, {
                    "label": "No, I think many other men are more sexy",
                    "score": 45,
                    "color": "#dc3545"
                }]
        },
        {
            "id": "012345",
            "publisher": {
                "code": "00009",
                "name": "Cécile C."
            },
            "tags": "cinema,People",
            "description": "Is Idriss Elba the sexiest man on Earth?",
            "type": "PROP",
            "propositions": [{
                    "label": "Yes, he is",
                    "score": 50,
                    "color": "#28a745"
                }, {
                    "label": "No, I think many other men are more sexy",
                    "score": 45,
                    "color": "#dc3545"
                }]
        },
        {
            "id": "012345",
            "publisher": {
                "code": "00008",
                "name": "Eric M."
            },
            "tags": "cinema,People",
            "description": "Is Idriss Elba the sexiest man on Earth?",
            "type": "PROP",
            "propositions": [{
                    "label": "Yes, he is",
                    "score": 50,
                    "color": "#28a745"
                }, {
                    "label": "No, I think many other men are more sexy",
                    "score": 45,
                    "color": "#dc3545"
                }]
        },
        {
            "id": "012345",
            "publisher": {
                "code": "00007",
                "name": "Vladimir"
            },
            "tags": "cinema,People",
            "description": "Is Idriss Elba the sexiest man on Earth?",
            "type": "PROP",
            "propositions":  [{
                    "label": "Yes, he is",
                    "score": 50,
                    "color": "#28a745"
                }, {
                    "label": "No, I think many other men are more sexy",
                    "score": 45,
                    "color": "#dc3545"
                }]
        }]
    };


    return {
      "info": "",
      "error": "",
      "result": [
        {
          "id": 1,
          "publisher": {
            "code": 351,
            "name": "Giles Roberts"
          },
          "tags": "est",
          "updated_at": "25-12-2018 00:52",
          "description": "Alias aut enim illo aspernatur ut quia. Reiciendis totam omnis blanditiis dolores.",
          "type": "PROP",
          "propositions": [
            {
              "label": "Sit soluta dolorem maiores accusamus.",
              "score": 50,
              "color": "#3a6f4a",
              "code": 0
            },
            {
              "label": "Architecto ipsam neque neque asperiores ut vel sunt.",
              "score": 50,
              "color": "#351e9e",
              "code": 1
            },
            {
              "label": "Aut magni neque tempore nemo.",
              "score": 50,
              "color": "#bd603e",
              "code": 2
            }
          ]
        },
        {
          "id": 2,
          "publisher": {
            "code": 352,
            "name": "Kara Rath"
          },
          "tags": "aut",
          "updated_at": "25-12-2018 00:52",
          "description": "Labore nihil aspernatur qui cupiditate. Ut et aliquam nemo id iure quos at.",
          "type": "PROP",
          "propositions": [
            {
              "label": "Aut accusantium porro et corporis ab qui.",
              "score": 50,
              "color": "#65ebb9",
              "code": 0
            },
            {
              "label": "Molestiae totam voluptatem doloribus.",
              "score": 50,
              "color": "#495293",
              "code": 1
            },
            {
              "label": "Et omnis nobis deserunt eveniet iusto.",
              "score": 50,
              "color": "#6aec1d",
              "code": 2
            }
          ]
        },
        {
          "id": 3,
          "publisher": {
            "code": 353,
            "name": "Jarrell Witting"
          },
          "tags": "consequuntur",
          "updated_at": "25-12-2018 00:52",
          "description": "Consequatur officia culpa eos odit qui sed. Quia consequatur consequatur sunt quia recusandae rerum sed.",
          "type": "PROP",
          "propositions": [
            {
              "label": "Est soluta ut eos illum.",
              "score": 50,
              "color": "#e323f8",
              "code": 0
            },
            {
              "label": "Sapiente tempora dolor nesciunt quo nihil quod.",
              "score": 50,
              "color": "#c77f0f",
              "code": 1
            }
          ]
        },
        {
          "id": 4,
          "publisher": {
            "code": 354,
            "name": "Frances Hickle"
          },
          "tags": "voluptas",
          "updated_at": "25-12-2018 00:52",
          "description": "Optio hic eveniet esse porro possimus libero voluptates odit. Magnam et consectetur sit dolor.",
          "type": "PROP",
          "propositions": [
            {
              "label": "Laborum et atque voluptate cupiditate harum.",
              "score": 50,
              "color": "#f6cfbb",
              "code": 0
            },
            {
              "label": "Id perspiciatis illo aut est perferendis et rem.",
              "score": 50,
              "color": "#6ed674",
              "code": 1
            },
            {
              "label": "At quia adipisci asperiores harum animi distinctio.",
              "score": 50,
              "color": "#b12887",
              "code": 2
            },
            {
              "label": "Aut ipsam at possimus soluta corrupti.",
              "score": 50,
              "color": "#ddb549",
              "code": 3
            }
          ]
        },
        {
          "id": 5,
          "publisher": {
            "code": 355,
            "name": "Dr. Abraham Deckow"
          },
          "tags": "saepe",
          "updated_at": "25-12-2018 00:52",
          "description": "At quisquam modi dolorem ipsam error. Eius ad architecto iure dolor cum voluptatum.",
          "type": "PROP",
          "propositions": [
            {
              "label": "Est voluptas ut dolor sapiente.",
              "score": 50,
              "color": "#6888a0",
              "code": 0
            },
            {
              "label": "Repellendus velit nesciunt et sit laudantium.",
              "score": 50,
              "color": "#7ed8ea",
              "code": 1
            }
          ]
        },
        {
          "id": 6,
          "publisher": {
            "code": 356,
            "name": "Lacey Cassin"
          },
          "tags": "aut",
          "updated_at": "25-12-2018 00:52",
          "description": "Suscipit dolore quaerat non et et voluptas. Voluptate id quae maxime illum consequatur modi.",
          "type": "PROP",
          "propositions": [
            {
              "label": "Voluptates consectetur saepe aut sequi porro at ut provident.",
              "score": 50,
              "color": "#6dd727",
              "code": 0
            },
            {
              "label": "Expedita voluptatibus libero culpa.",
              "score": 50,
              "color": "#8e1a92",
              "code": 1
            },
            {
              "label": "Repellendus perspiciatis provident ea.",
              "score": 50,
              "color": "#9f23a6",
              "code": 2
            },
            {
              "label": "Voluptatem non nulla est ab nisi tempore a.",
              "score": 50,
              "color": "#96fe1f",
              "code": 3
            },
            {
              "label": "Necessitatibus vel blanditiis dolore nesciunt eligendi veritatis.",
              "score": 50,
              "color": "#aa0e90",
              "code": 4
            }
          ]
        },
        {
          "id": 7,
          "publisher": {
            "code": 357,
            "name": "Mrs. Alexandrine Gutkowski DVM"
          },
          "tags": "quidem",
          "updated_at": "25-12-2018 00:52",
          "description": "Enim quaerat architecto perspiciatis eligendi doloribus hic quidem. Commodi facilis recusandae quo.",
          "type": "PROP",
          "propositions": [
            {
              "label": "Exercitationem maxime fugiat eveniet voluptas voluptas vero eius.",
              "score": 50,
              "color": "#c63864",
              "code": 0
            },
            {
              "label": "Ex eos doloremque in vitae porro placeat.",
              "score": 50,
              "color": "#87e85c",
              "code": 1
            }
          ]
        },
        {
          "id": 8,
          "publisher": {
            "code": 358,
            "name": "Mrs. Jessica Strosin DDS"
          },
          "tags": "maxime",
          "updated_at": "25-12-2018 00:52",
          "description": "Ex et qui et et inventore. Sed aut sed expedita vero.",
          "type": "PROP",
          "propositions": [
            {
              "label": "Et aut sapiente culpa officia qui.",
              "score": 50,
              "color": "#bc0b35",
              "code": 0
            },
            {
              "label": "Nemo quisquam delectus et.",
              "score": 50,
              "color": "#0e7a19",
              "code": 1
            }
          ]
        },
        {
          "id": 9,
          "publisher": {
            "code": 359,
            "name": "Antonetta Senger"
          },
          "tags": "quia",
          "updated_at": "25-12-2018 00:52",
          "description": "Perspiciatis reprehenderit qui et aut officia minus asperiores. Aspernatur impedit accusantium voluptas excepturi eum accusantium laboriosam.",
          "type": "PROP",
          "propositions": [
            {
              "label": "Non magnam velit amet autem sapiente.",
              "score": 50,
              "color": "#a373a2",
              "code": 0
            },
            {
              "label": "Dolorem pariatur et impedit nulla et tempore.",
              "score": 50,
              "color": "#6c21e3",
              "code": 1
            }
          ]
        },
        {
          "id": 10,
          "publisher": {
            "code": 360,
            "name": "Abby Gibson"
          },
          "tags": "vel",
          "updated_at": "25-12-2018 00:52",
          "description": "Consequuntur eligendi ea quam magnam rerum corrupti corporis. Necessitatibus dicta et iusto voluptas non.",
          "type": "PROP",
          "propositions": [
            {
              "label": "Ipsum ducimus inventore modi ut animi.",
              "score": 50,
              "color": "#4ac682",
              "code": 0
            },
            {
              "label": "Dolor est velit ipsum in et.",
              "score": 50,
              "color": "#e726fd",
              "code": 1
            }
          ]
        },
        {
          "id": 11,
          "publisher": {
            "code": 361,
            "name": "Keshawn Vandervort"
          },
          "tags": "quidem",
          "updated_at": "25-12-2018 00:52",
          "description": "Aliquid ut dolor et vero eaque. Possimus quae repellat sint repellendus ut est.",
          "type": "PROP",
          "propositions": [
            {
              "label": "Voluptatem inventore a similique molestiae.",
              "score": 50,
              "color": "#0f595e",
              "code": 0
            },
            {
              "label": "Placeat ipsum nisi illo voluptatem doloribus placeat eius sit.",
              "score": 50,
              "color": "#67c244",
              "code": 1
            }
          ]
        },
        {
          "id": 12,
          "publisher": {
            "code": 362,
            "name": "Ericka O'Kon"
          },
          "tags": "voluptas",
          "updated_at": "25-12-2018 00:52",
          "description": "Eveniet ab officiis explicabo temporibus. Reiciendis consequatur necessitatibus quidem odit.",
          "type": "PROP",
          "propositions": [
            {
              "label": "Molestias dolor et dolorem vitae sed suscipit.",
              "score": 50,
              "color": "#02e692",
              "code": 0
            },
            {
              "label": "Consequatur laudantium velit beatae perferendis sed corporis voluptatum possimus.",
              "score": 50,
              "color": "#83aa4c",
              "code": 1
            },
            {
              "label": "Temporibus quia eum necessitatibus dignissimos.",
              "score": 50,
              "color": "#cf7b7a",
              "code": 2
            }
          ]
        },
        {
          "id": 13,
          "publisher": {
            "code": 363,
            "name": "Verona Muller"
          },
          "tags": "assumenda",
          "updated_at": "25-12-2018 00:52",
          "description": "Voluptas voluptatem animi iste ipsum quidem ab beatae. Deserunt non qui culpa omnis repudiandae consectetur.",
          "type": "PROP",
          "propositions": [
            {
              "label": "Veniam quae dolor aut minima.",
              "score": 50,
              "color": "#fe434e",
              "code": 0
            },
            {
              "label": "Adipisci ea fugiat harum autem delectus et.",
              "score": 50,
              "color": "#bf4a7f",
              "code": 1
            },
            {
              "label": "Hic repellendus totam suscipit.",
              "score": 50,
              "color": "#6cb6bf",
              "code": 2
            },
            {
              "label": "Necessitatibus necessitatibus in consequatur aspernatur provident quidem consequatur.",
              "score": 50,
              "color": "#a87bd1",
              "code": 3
            }
          ]
        },
        {
          "id": 14,
          "publisher": {
            "code": 364,
            "name": "Miss Sierra Okuneva DVM"
          },
          "tags": "deleniti",
          "updated_at": "25-12-2018 00:52",
          "description": "Molestiae error est voluptas in voluptas nihil voluptas. Illum dolorem alias ipsa nostrum.",
          "type": "PROP",
          "propositions": [
            {
              "label": "Laudantium qui non rerum sit laudantium ea.",
              "score": 50,
              "color": "#f8bca5",
              "code": 0
            },
            {
              "label": "Autem temporibus tempora eos ut.",
              "score": 50,
              "color": "#96432f",
              "code": 1
            },
            {
              "label": "Aperiam quos quaerat nihil officia esse velit.",
              "score": 50,
              "color": "#23b133",
              "code": 2
            }
          ]
        },
        {
          "id": 15,
          "publisher": {
            "code": 365,
            "name": "Tyrell Schulist"
          },
          "tags": "laborum",
          "updated_at": "25-12-2018 00:52",
          "description": "Aut impedit minus accusamus doloremque incidunt id. Dolor consequatur neque autem iusto aut.",
          "type": "PROP",
          "propositions": [
            {
              "label": "Fuga animi iste quia voluptatem.",
              "score": 50,
              "color": "#69bccf",
              "code": 0
            },
            {
              "label": "Est qui occaecati esse dicta.",
              "score": 50,
              "color": "#b5d269",
              "code": 1
            }
          ]
        },
        {
          "id": 16,
          "publisher": {
            "code": 366,
            "name": "Fanny Schaefer"
          },
          "tags": "quo",
          "updated_at": "25-12-2018 00:52",
          "description": "Asperiores inventore nihil magni. Autem eum tempora quia deserunt sed quis qui.",
          "type": "PROP",
          "propositions": [
            {
              "label": "Doloremque repellendus hic eos perferendis modi corporis.",
              "score": 50,
              "color": "#ff148f",
              "code": 0
            },
            {
              "label": "Veritatis consequuntur sequi quia laudantium perferendis rerum praesentium.",
              "score": 50,
              "color": "#7d348e",
              "code": 1
            }
          ]
        },
        {
          "id": 17,
          "publisher": {
            "code": 367,
            "name": "Bernard Ryan"
          },
          "tags": "aut",
          "updated_at": "25-12-2018 00:52",
          "description": "Repellendus consequuntur quaerat quia et dolores. Consequatur laboriosam odio asperiores velit vero dignissimos.",
          "type": "PROP",
          "propositions": [
            {
              "label": "Aut ut et quis omnis.",
              "score": 50,
              "color": "#4d2d37",
              "code": 0
            },
            {
              "label": "Vero ducimus officiis earum dignissimos consequuntur aliquam.",
              "score": 50,
              "color": "#915053",
              "code": 1
            }
          ]
        },
        {
          "id": 18,
          "publisher": {
            "code": 368,
            "name": "Addison Pacocha"
          },
          "tags": "consectetur",
          "updated_at": "25-12-2018 00:52",
          "description": "Et quae voluptatem saepe recusandae dolorem. Et quia repellat velit rem quas.",
          "type": "PROP",
          "propositions": []
        },
        {
          "id": 19,
          "publisher": {
            "code": 369,
            "name": "Paige Zulauf"
          },
          "tags": "consequatur",
          "updated_at": "25-12-2018 00:52",
          "description": "Delectus adipisci dolorem expedita. Omnis nisi nesciunt autem sed rem.",
          "type": "PROP",
          "propositions": []
        },
        {
          "id": 20,
          "publisher": {
            "code": 370,
            "name": "Ayden Gusikowski"
          },
          "tags": "quidem",
          "updated_at": "25-12-2018 00:52",
          "description": "Reiciendis eum velit voluptatem. Ipsam dolores est laboriosam vel eos aut cum.",
          "type": "PROP",
          "propositions": []
        }
      ]
    };
  }

};