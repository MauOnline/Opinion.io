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
                "pool": {
                    "type": "CBOX",
                    "values": [{
                        "label": "Yes",
                        "value": 50
                    }, {
                        "label": "No",
                        "value": 36
                    }, {
                        "label": "Not sure",
                        "value": 23
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
                "pool": {
                    "type": "CBOX",
                    "values": [{
                        "label": "Yes",
                        "value": 89
                    }, {
                        "label": "No",
                        "value": 10
                    }, {
                        "label": "Not sure",
                        "value": 0
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
                "pool": {
                    "type": "CBOX",
                    "values": [{
                        "label": "Yes",
                        "value": 89
                    }, {
                        "label": "No",
                        "value": 10
                    }, {
                        "label": "Not sure",
                        "value": 0
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
                "pool": {
                    "type": "CBOX",
                    "values": [{
                        "label": "Yes",
                        "value": 89
                    }, {
                        "label": "No",
                        "value": 10
                    }, {
                        "label": "Not sure",
                        "value": 0
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
                "pool": {
                    "type": "CBOX",
                    "values": [{
                        "label": "Yes",
                        "value": 89
                    }, {
                        "label": "No",
                        "value": 10
                    }, {
                        "label": "Not sure",
                        "value": 5
                    }, {
                        "label": "I like her before",
                        "value": 10
                    }, {
                        "label": "Only if she change her style",
                        "value": 30
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
                "pool": {
                    "type": "CBOX",
                    "values": [{
                        "label": "Yes, he is",
                        "value": 50
                    }, {
                        "label": "No, I think many other men are more sexy",
                        "value": 45
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
                "pool": {
                    "type": "CBOX",
                    "values": [{
                        "label": "Yes, he is",
                        "value": 50
                    }, {
                        "label": "No, I think many other men are more sexy",
                        "value": 45
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
                "pool": {
                    "type": "CBOX",
                    "values": [{
                        "label": "Yes, he is",
                        "value": 50
                    }, {
                        "label": "No, I think many other men are more sexy",
                        "value": 45
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
                "pool": {
                    "type": "CBOX",
                    "values": [{
                        "label": "Yes, he is",
                        "value": 50
                    }, {
                        "label": "No, I think many other men are more sexy",
                        "value": 45
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
                "pool": {
                    "type": "CBOX",
                    "values": [{
                        "label": "Yes, he is",
                        "value": 50
                    }, {
                        "label": "No, I think many other men are more sexy",
                        "value": 45
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
                "pool": {
                    "type": "CBOX",
                    "values": [{
                        "label": "Yes, he is",
                        "value": 50
                    }, {
                        "label": "No, I think many other men are more sexy",
                        "value": 45
                    }]
                }
            }]
        };
    }

};