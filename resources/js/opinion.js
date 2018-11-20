"use strict"

var OIOJS = OIOJS || {};

OIOJS.voteengine = {

    poolsPayload: null,
    searchTerm: null,
    tagFacets: null,
    publisherFacets: null,
    init: function() {
        this.doDataInit();
        this.bindVote();
        this.bindSearch();
    },

    doValidateSearchTerm: function() {
        return OIOJS.voteengine.searchTerm != null &&
            OIOJS.voteengine.searchTerm !== 'undefined' &&
            OIOJS.voteengine.searchTerm.length > 1;
    },

    doFilterPolls: function() {
        var filteredPools = [];
        if (OIOJS.voteengine.poolsPayload != null && OIOJS.voteengine.poolsPayload !== "undefined") {
            $.each(OIOJS.voteengine.poolsPayload.result, function(i, e) {
                if (e.phrase.match(new RegExp(OIOJS.voteengine.searchTerm, "gi"))) {
                    filteredPools.push(e);
                }
            });
        };

        filteredPools.length > 0 ?
            OIOJS.voteengine.doRenderPolls(filteredPools) :
            OIOJS.voteengine.doHandleNoResult();
        // return filteredPools;
    },

    doHandleNoResult: function() {
        $('#result .questions').hide();
        $('.noResult').show();
        OIOJS.voteengine.searchTerm = null;
    },

    doRenderPolls: function(pools) {
        if (pools.length > 0) {
            OIOJS.voteengine.doCleanupView();
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
                        return OIOJS.voteengine.doValidateSearchTerm() ?
                            e.phrase.replace(new RegExp(OIOJS.voteengine.searchTerm, "gi"), '<i class="search">' + OIOJS.voteengine.searchTerm + '</i>') :
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

                    if (v.value > 0) {
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

                $('ul.questions').append(poolElement);
            });

            //update pool values
            var totalValuesUpdated = false;
            $('.question-container').each(function(i, e) {
                var scoreTotal = function() {
                    var temp = 0;
                    $(e).children('.choice').each(function(i, c) {
                        temp += $(c).data('score')
                    });
                    return temp;
                }

                $(e).data('total', scoreTotal());
                totalValuesUpdated = $('.question-container').length === i + 1;
            });

            if (totalValuesUpdated) {
                $('.choice').each(function(i, e) {
                    OIOJS.voteengine.doCalculateScore(e);
                });
            }

            $('ul.questions').show();
        }
    },

    doRenderFacets: function() {
        var generateColumnItems = function(itemList, domTarget) {
            domTarget.empty();
            var col_lg_4 = null;

            $.each(itemList, function(i, e) {
                if (col_lg_4 === null) {
                    col_lg_4 = $('<div/>', {
                        class: 'col'
                    });
                };

                if ((itemList.length - 1 === i) || (i % 8 === 0)) {
                    //If length value is reached or it has pass 8 items, the column is appended and 
                    // a new column is created
                    if (col_lg_4.children('a').length > 0) {
                        domTarget.append(col_lg_4);
                    }

                    col_lg_4 = $('<div/>', {
                        class: 'col',
                    });
                    if (i > 8) {
                        col_lg_4.append($('<div/>', {
                            class: 'dropdown-divider',
                            role: 'separator'
                        }));
                    }
                };

                var item = $('<a/>', {
                    class: 'dropdown-item',
                    href: '#',
                    html: e
                });
                col_lg_4.append(item);
            });
        };

        //Tags
        if (OIOJS.voteengine.doExtractTags()) {
            generateColumnItems(OIOJS.voteengine.tagFacets, $('#tagfacets .row'));
        };

        //Publishers
        if (OIOJS.voteengine.doExtractPublishers()) {
            generateColumnItems(OIOJS.voteengine.publisherFacets, $('#publisherfacets .row'));
        };
    },

    doExtractPublishers: function(pools) {
        OIOJS.voteengine.publisherFacets = [];
        OIOJS.voteengine.publisherFacets.push("publisher 1", "publisher 1", "publisher 1", "publisher 1", "publisher 1", "publisher 1", "sample 1", "sample 1", "sample 1", "sample 1", "sample 1", "sample 1", "sample 1");
        OIOJS.voteengine.publisherFacets.push("publis", "publis", "publisher 1", "publis", "publis", "sample", "sample", "sample", "sampl", "sample", "sample", "sample");
        OIOJS.voteengine.publisherFacets.push("publis", "publis", "publisher 1", "publis", "publis", "sample", "sample", "sample", "sampl", "sample", "sample", "sample");
        return OIOJS.voteengine.publisherFacets.length > 0;
    },

    doExtractTags: function() {
        var temp = [];
        $.each(OIOJS.voteengine.poolsPayload.result, function(i, e) {
            if (e.tags === 'undefined') {
                throw new Error("Tags not found");
            }

            var tags = e.tags.split(",");
            for (var j = 0; j < tags.length; j++) {
                //Tags are being formatted to avoid duplicates base on case
                var val = OIOJS.utils.formatTag(tags[j]);
                if (!temp.includes(val)) {
                    temp.push(val);
                };
            }
        });
        temp.sort();
        OIOJS.voteengine.tagFacets = temp;
        OIOJS.voteengine.tagFacets.push("sample 1", "sample 1", "sample 1", "sample 1", "sample 1", "sample 1", "sample 1", "sample 1", "sample 1", "sample 1", "sample 1", "sample 1", "sample 1");
        // OIOJS.voteengine.tagFacets.push(temp);
        return OIOJS.voteengine.tagFacets.length > 0;
    },

    doCleanupView: function() {
        $('.noResult').hide();
        $('#result ul.questions').empty();
    },

    doDataInit: function() {
        //Executed when the view is loaded

        //Init pools
        OIOJS.voteengine.loadPools();

        var pools = OIOJS.voteengine.poolsPayload.result;

        OIOJS.voteengine.searchTerm = $('#searchbar input').val();
        // console.log(OIOJS.voteengine.searchTerm);
        OIOJS.voteengine.doValidateSearchTerm() === true ?
            OIOJS.voteengine.doFilterPolls() :
            OIOJS.voteengine.doRenderPolls(pools);

        //update facets
        OIOJS.voteengine.doRenderFacets();
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
        $('.searchEngine input').on('keyup click', function(e) {
            var _that = this;
            if ((OIOJS.voteengine.searchTerm = $(_that).val().trim()).length > 1) {
                OIOJS.voteengine.doFilterPolls();
            } else {
                OIOJS.voteengine.searchTerm = null;
                OIOJS.voteengine.doDataInit();
            }
        });
    },

    bindVote: function() {
        $(document).on('click', '.choice', function() {
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
            }, {
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
            }, ]
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