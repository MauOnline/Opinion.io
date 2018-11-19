"use strict"

var OIOJS = OIOJS || {};

OIOJS.voteengine = {

    poolsPayload: null,
    searchTerm: null,
    init: function() {
        this.doDataInit();
        this.bindVote();
        this.bindSearch();
    },

    doFilterPolls: function(inputString) {

        var filteredPools = [];
        if (OIOJS.voteengine.poolsPayload != null && OIOJS.voteengine.poolsPayload !== "undefined") {
            $.each(OIOJS.voteengine.poolsPayload.result, function(i, e) {
                var searchRegEx = new RegExp(inputString, "gi");
                if (e.phrase.match(searchRegEx)) {
                    // e.phrase = e.phrase.replace(searchRegEx, '<i class="search">' + inputString + '</i>');
                    filteredPools.push(e);
                }
            });
        };

        filteredPools.length > 0 ? OIOJS.voteengine.doRenderPolls(filteredPools) : OIOJS.voteengine.doHandleNoResult();
        // return filteredPools;
    },

    doHandleNoResult: function() {
        $('#result .questions').html("");
        OIOJS.voteengine.searchTerm = null;
        $('.noResult').show();
    },

    doRenderPolls: function(pools) {
        if (pools.length > 0) {
            $('.noResult').hide();
            $('#result .questions').html("");
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
                    html: function() {
                        return OIOJS.voteengine.searchTerm != null ? e.phrase.replace(new RegExp(OIOJS.voteengine.searchTerm, "gi"), '<i class=search>' + OIOJS.voteengine.searchTerm + '</i>') :
                            e.phrase;
                    }
                });
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

                poolPhrase.append(poolPhraseA);
                poolPhrase.append(poolPhraseP);
                poolContainer.append(poolPhrase);

                var progressBar = $('<div/>', {
                    class: "progress"
                });
                var choices = [];
                var progressBarItems = [];
                var progressBarColors = ["success", "danger", "warning", "info", "primary", "secondary"];

                var totalScore = 0.0;
                e.pool.values.forEach(e => totalScore += e.value);
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
                            class: "badge badge-pill badge-" + progressBarColors[j]
                        })
                    });

                    poolChoice.append(poolChoiceVoteIcon);
                    poolChoice.append(poolChoiceVoteLabel);
                    poolChoice.append(poolChoiceVoteScore);
                    choices.push(poolChoice);

                    if (v.value > 0) { //TODO: Review. Trying to fix the blank in the progress bar
                        var widthVal = ((v.value * 100) / totalScore).toFixed(2);
                        var progressBarItem = $('<div/>', {
                            class: "progress-bar bg-" + progressBarColors[j],
                            role: "progressbar",
                            "aria-valuenow": "15",
                            "aria-valuemin": "0",
                            "aria-valuemax": "100",
                            style: "width:" + widthVal + "%",
                            html: $('<span/>', {
                                class: "sr-only"
                            })
                        });
                        progressBarItems.push(progressBarItem);
                    }
                });

                progressBar.append(progressBarItems);
                poolContainer.append(progressBar);

                poolContainer.append(choices);
                poolContainer.append(poolShare);
                poolContainer.append(poolInfo);

                poolElement.append(poolContainer);

                $('ul.questions').prepend(poolElement);
            });
        }
    },

    doExtractTags: function(pools) {
        var res = [];
        $.each(pools, function(i, e) {
            if (e.tags === 'undefined') {
                throw new Error("Tags not found");
            }

            var tags = e.tags.split(",");
            for (var j = 0; j < tags.length; j++) {
                //Tags are being formatted to avoid duplicates base on case
                var val = OIOJS.utils.formatTag(tags[j]);
                if (!res.includes(val)) {
                    res.push(val);
                }
            }
        });

        res.sort();
        return res;
    },

    doDataInit: function() {
        OIOJS.voteengine.loadPools();
        var pools = OIOJS.voteengine.poolsPayload.result;
        pools.length > 0 ? OIOJS.voteengine.doRenderPolls(pools) : $('.noResult').show();

        var tags = OIOJS.voteengine.doExtractTags(pools);
        $.each(tags, function(i, e) {
            $('#category').append(
                $('<option/>', {
                    text: e,
                    value: e
                }));
        });

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
                OIOJS.voteengine.doCalculateScore(e);
            });
        }
    },

    doCalculateScore: function(q) {
        if (q !== 'undefined') {
            var parent = $(q).parent('.question-container');
            var scoreTotalVal = $(parent).data('total');
            var scoreVal = $(q).data('score');
            var scorePercentageVal = (scoreVal * 100) / scoreTotalVal;
            $(q).find('.score .badge').text(scoreVal + '(' + scorePercentageVal.toFixed(2) + '%)');
        }
    },

    bindSearch: function() {
        $('#searchbar input').on('keyup click', function(e) {
            var val = $(this).val().trim();
            if (val.length > 1) {
                // console.log(val);
                OIOJS.voteengine.searchTerm = val;
                OIOJS.voteengine.doFilterPolls(val);
            } else if (val.length == 0) {
                OIOJS.voteengine.searchTerm = null;
                OIOJS.voteengine.doDataInit();
            }
        });
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
                OIOJS.voteengine.doCalculateScore(e);
            })
        });
    },

    loadPools: function() {
        //TODO: Replace with Ajax call later on
        this.poolsPayload = {
            "info": {},
            "error": {},
            "result": [{
                    "id": "0123456",
                    "owner": "Gabon Media Press",
                    "tags": "PeoplE,Music,Entertainment",
                    "lastUpdate": "17-11-2018",
                    "phrase": "Who is the best person to replace Ali Bongo?",
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
                    "owner": "BBC Business",
                    "tags": "Environment",
                    "lastUpdate": "17-11-2018",
                    "phrase": "Do you think 2019 will be a good year for global finance?",
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
                    "id": "01234578",
                    "owner": "01Net TV",
                    "tags": "PeOple",
                    "lastUpdate": "17-11-2018",
                    "phrase": "What do you think of the new Freebox V7?",
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
                    "id": "0123459",
                    "tags": "Politic",
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
                    "id": "0123450",
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
                            value: 5
                        }, {
                            label: "I like her before",
                            value: 10
                        }, {
                            label: "Only if she change her style",
                            value: 30
                        }]
                    }
                }, {
                    "id": "012345",
                    "tags": "cinema,People",
                    "phrase": "Is Idriss Elba the sexiest man on Earth?",
                    "pool": {
                        "type": "CBOX",
                        "values": [{
                            label: "Yes, he is",
                            value: 50
                        }, {
                            label: "No, I think many other men are more sexy",
                            value: 45
                        }]
                    }
                },
            ]
        };

    }
};

OIOJS.utils = {

    capitalizeFirstLetter: function(inputString) {
        return inputString.charAt(0).toUpperCase() + inputString.slice(1);
    },

    formatTag: function(inputString) {
        return this.capitalizeFirstLetter(inputString.toLowerCase());
    }
};

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
});