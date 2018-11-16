"use strict"

var OIOJS = OIOJS || {};

OIOJS.voteengine = {

    init: function() {
        this.dataInit();
        this.bindVote();
    },

    renderPools: function(pools) {
        $.each(pools, function(i, e) {

            var poolElement = $('<li/>', {
                class: "question"
            });
            var poolContainer = $('<div/>', {
                class: "question-container"
            });
            var poolPhrase = $('<div/>', {
                class: "question-label"
            });
            var poolPhraseP = $('<p/>', {
                text: e.phrase
            })
            var poolPhraseA = $('<a/>', {
                class: "btn btn-outline-info btn-sm",
                href: "#",
                text: "Follow"
            });
            var poolShare = $('<div/>', {
                class: "share",
                html: ""
            });
            var poolInfo = $('<div/>', {
                class: "info"
            });

            poolPhrase.append(poolPhraseP);
            poolPhrase.append(poolPhraseA);
            poolContainer.append(poolPhrase);

            $.each(e.pool.values, function(j, v) {

                var poolChoice = $('<div/>', {
                    class: "choice",
                    "data-score": v.value
                });

                var poolChoiceVoteIcon = $('<img/>', {
                    src: "../../resources/open-iconic-master/svg/thumb-up.svg",
                    class: "icon"
                });

                var poolChoiceVoteLabel = $('<span/>', {
                    class: "label",
                    text: v.label
                });

                var poolChoiceVoteScore = $('<div/>', {
                    class: "score",
                    html: $('<span/>', {
                        class: "badge badge-pill badge-info"
                    })
                });

                poolChoice.append(poolChoiceVoteIcon);
                poolChoice.append(poolChoiceVoteLabel);
                poolChoice.append(poolChoiceVoteScore);

                poolContainer.append(poolChoice);

            });


            poolContainer.append(poolShare);
            poolContainer.append(poolInfo);

            poolElement.append(poolContainer);

            $('ul.questions').prepend(poolElement);

        });
    },

    extractTags: function(pools) {
        var res = [];
        $.each(pools, function(i, e) {
            if (e.tags === 'undefined') {
                throw new Error("Tags not found");
            }
            var tags = e.tags.split(",");
            for (var i = 0; i >= tags.length; i++) {
                if (!res.includes(tags[i])) {
                    res.push(tags[i]);
                }
            }

        });

        return res;
    },

    dataInit: function() {


        var sampledata = OIOJS.voteengine.loadPools();

        OIOJS.voteengine.renderPools(sampledata.result);
        var tags = OIOJS.voteengine.extractTags(sampledata.result);
        alert(tags);

        var totalValuesUpdated = false;
        var questionCount = $('.question-container').length;

        //Update total values
        $('.question-container').each(function(i, e) {
            var scoreTotal = 0;
            $(e).children('.choice').each(function(i, e) {
                scoreTotal += $(e).data('score');
            });
            $(e).data('total', scoreTotal);
            totalValuesUpdated = questionCount === i + 1;
        });

        //Update score values on after total values have been updated
        if (totalValuesUpdated) {
            $('.choice').each(function(i, e) {
                OIOJS.voteengine.calculateScore(e);
            });
        }
    },

    calculateScore: function(q) {
        if (q !== 'undefined') {
            var parent = $(q).parent('.question-container');
            var scoreTotalVal = $(parent).data('total');
            var scoreVal = $(q).data('score');
            var scorePercentageVal = (scoreVal * 100) / scoreTotalVal;
            $(q).find('.score .badge-info').text(scoreVal + '(' + scorePercentageVal.toFixed(2) + '%)');
        }
    },

    bindVote: function() {
        $('.choice').on('click', function() {
            //Update score and tolal
            var _that = this;
            var parent = $(_that).parent('.question-container');

            $.each([
                _that,
                parent
            ], function(i, e) {

                var target = i == 0 ? 'score' : 'total';
                var oldVal = $(e).data(target);
                $(e).data(target, oldVal + 1); //update
            })

            $(parent).children('.choice').each(function(i, e) {
                OIOJS.voteengine.calculateScore(e);
            })
        });
    },

    loadPools: function() {
        //TODO: Replace with Ajax call later on
        return {
            "info": {},
            "error": {},
            "result": [{
                    "id": "0123456",
                    "tags": "People",
                    "lastUpdate": "17-11-2018",
                    "phrase": "Do you like Rihanna ?",
                    "pool": {
                        "type": "CBOX",
                        "values": [{
                            label: "Yes",
                            value: 50
                        }, {
                            label: "No",
                            value: 36
                        }, {
                            label: "Not sure",
                            value: 23
                        }]
                    }
                },

                {
                    "id": "0123457",
                    "tags": "People",
                    "lastUpdate": "17-11-2018",
                    "phrase": "Do you like Beyoncée ?",
                    "pool": {
                        "type": "CBOX",
                        "values": [{
                            label: "Yes",
                            value: 89
                        }, {
                            label: "No",
                            value: 10
                        }, {
                            label: "Not sure",
                            value: 0
                        }]
                    }
                }, {
                    "id": "0123457",
                    "tags": "People",
                    "lastUpdate": "17-11-2018",
                    "phrase": "Do you like Beyoncée ?",
                    "pool": {
                        "type": "CBOX",
                        "values": [{
                            label: "Yes",
                            value: 89
                        }, {
                            label: "No",
                            value: 10
                        }, {
                            label: "Not sure",
                            value: 0
                        }]
                    }
                }, {
                    "id": "0123457",
                    "tags": "People",
                    "lastUpdate": "17-11-2018",
                    "phrase": "Do you like Beyoncée ?",
                    "pool": {
                        "type": "CBOX",
                        "values": [{
                            label: "Yes",
                            value: 89
                        }, {
                            label: "No",
                            value: 10
                        }, {
                            label: "Not sure",
                            value: 0
                        }]
                    }
                }, {
                    "id": "0123457",
                    "tags": "Cinema",
                    "lastUpdate": "17-11-2018",
                    "phrase": "Do you like Beyoncée ?",
                    "pool": {
                        "type": "CBOX",
                        "values": [{
                            label: "Yes",
                            value: 89
                        }, {
                            label: "No",
                            value: 10
                        }, {
                            label: "Not sure",
                            value: 0
                        }]
                    }
                }, {
                    "id": "0123457",
                    "tags": "cinema",
                    "phrase": "Do you like Beyoncée ?",
                    "pool": {
                        "type": "CBOX",
                        "values": [{
                            label: "Yes",
                            value: 89
                        }, {
                            label: "No",
                            value: 10
                        }, {
                            label: "Not sure",
                            value: 0
                        }]
                    }
                },
            ]
        };

    }
}

$(function() {

    //Load data
    // $.ajax({
    //     url: './opinion-test-data.json',
    //     method: 'GET',
    //     dataType: 'jsonp'

    // }).done(function(resp) {
    //     alert(resp);
    // }).fail(function(xhr, err) {
    //     console.log(xhr.status + " : " + xhr.responseText + " : " + err);
    // });


    OIOJS.voteengine.init();
})