"use strict"

var OIOJS = OIOJS || {};

OIOJS.mocks = {

    doLogin: function() {
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

    getPolls: function() {
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
                "poll": {
                    "type": "CBOX",
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
                }
            }, {
                "id": "0123457",
                "publisher": {
                    "code": "00001",
                    "name": "BBC Business"
                },
                "tags": "Environment",
                "lastUpdate": "17-11-2018",
                "description": "Do you think 2019 will be a good year for global finance?",
                "poll": {
                    "type": "CBOX",
                    "propositions": [{
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
                }
            }, {
                "id": "01234578",
                "publisher": {
                    "code": "00002",
                    "name": "01Net TV"
                },
                "tags": "PeOple",
                "lastUpdate": "17-11-2018",
                "description": "What do you think of the new Freebox V7?",
                "poll": {
                    "type": "CBOX",
                    "propositions": [{
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
                }
            }, {
                "id": "0123459",
                "publisher": {
                    "code": "00004",
                    "name": "Morpheus"
                },
                "tags": "Politic",
                "lastUpdate": "17-11-2018",
                "description": "Do you like Beyoncée ?",
                "poll": {
                    "type": "CBOX",
                    "propositions": [{
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
                }
            }, {
                "id": "0123450",
                "publisher": {
                    "code": "00001",
                    "name": "BBC B"
                },
                "tags": "Cinema",
                "lastUpdate": "17-11-2018",
                "description": "Do you like Beyoncée ?",
                "poll": {
                    "type": "CBOX",
                    "propositions": [{
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
                }
            }, {
                "id": "012345",
                "publisher": {
                    "code": "000012",
                    "name": "Julien L."
                },
                "tags": "cinema,People",
                "description": "Is Idriss Elba the sexiest man on Earth?",
                "poll": {
                    "type": "CBOX",
                    "propositions": [{
                        "label": "Yes, he is",
                        "score": 50,
                        "color": "#28a745"
                    }, {
                        "label": "No, I think many other men are more sexy",
                        "score": 45,
                        "color": "#dc3545"
                    }]
                }
            },
            {
                "id": "012345",
                "publisher": {
                    "code": "00011",
                    "name": "Rama Nahme"
                },
                "tags": "cinema,People",
                "description": "Is Idriss Elba the sexiest man on Earth?",
                "poll": {
                    "type": "CBOX",
                    "propositions": [{
                        "label": "Yes, he is",
                        "score": 50,
                        "color": "#28a745"
                    }, {
                        "label": "No, I think many other men are more sexy",
                        "score": 45,
                        "color": "#dc3545"
                    }]
                }
            },
            {
                "id": "012345",
                "publisher": {
                    "code": "00010",
                    "name": "Henry Gibbs"
                },
                "tags": "cinema,People",
                "description": "Is Idriss Elba the sexiest man on Earth?",
                "poll": {
                    "type": "CBOX",
                    "propositions": [{
                        "label": "Yes, he is",
                        "score": 50,
                        "color": "#28a745"
                    }, {
                        "label": "No, I think many other men are more sexy",
                        "score": 45,
                        "color": "#dc3545"
                    }]
                }
            },
            {
                "id": "012345",
                "publisher": {
                    "code": "00009",
                    "name": "Cécile C."
                },
                "tags": "cinema,People",
                "description": "Is Idriss Elba the sexiest man on Earth?",
                "poll": {
                    "type": "CBOX",
                    "propositions": [{
                        "label": "Yes, he is",
                        "score": 50,
                        "color": "#28a745"
                    }, {
                        "label": "No, I think many other men are more sexy",
                        "score": 45,
                        "color": "#dc3545"
                    }]
                }
            },
            {
                "id": "012345",
                "publisher": {
                    "code": "00008",
                    "name": "Eric M."
                },
                "tags": "cinema,People",
                "description": "Is Idriss Elba the sexiest man on Earth?",
                "poll": {
                    "type": "CBOX",
                    "propositions": [{
                        "label": "Yes, he is",
                        "score": 50,
                        "color": "#28a745"
                    }, {
                        "label": "No, I think many other men are more sexy",
                        "score": 45,
                        "color": "#dc3545"
                    }]
                }
            },
            {
                "id": "012345",
                "publisher": {
                    "code": "00007",
                    "name": "Vladimir"
                },
                "tags": "cinema,People",
                "description": "Is Idriss Elba the sexiest man on Earth?",
                "poll": {
                    "type": "CBOX",
                    "propositions": [{
                        "label": "Yes, he is",
                        "score": 50,
                        "color": "#28a745"
                    }, {
                        "label": "No, I think many other men are more sexy",
                        "score": 45,
                        "color": "#dc3545"
                    }]
                }
            }]
        };
    }

};