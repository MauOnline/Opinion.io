"use strict"

var OIOJS = OIOJS || {};

OIOJS.voteengine = {

    poolsPayload: null,
    searchTerm: null,
    searchFacets: null,
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

    doFilterPolls: function(isFacet) {
        var filteredPools = []
        if (OIOJS.voteengine.poolsPayload != null && OIOJS.voteengine.poolsPayload !== "undefined") {
            if (isFacet) {

                //Facets search
                if (OIOJS.voteengine.searchFacets != null && OIOJS.voteengine.searchFacets.length > 0) {

                    filteredPools = OIOJS.voteengine.poolsPayload.result.filter(function(e) {
                        return OIOJS.utils.arrayIntersection(e.tags.split(","), OIOJS.voteengine.searchFacets).length > 0 ||
                            (e.publisher !== null && typeof e.publisher !== 'undefined' && OIOJS.utils.includesCaseInsensitive(OIOJS.voteengine.searchFacets, e.publisher));
                    });
                    //flush selection
                    OIOJS.voteengine.searchFacets = null;
                };
            } else {

                //Searchterm
                $.each(OIOJS.voteengine.poolsPayload.result, function(i, e) {
                    if (e.description.match(new RegExp(OIOJS.voteengine.searchTerm, "gi"))) {
                        filteredPools.push(e);
                    }
                });

                //flush search term
                OIOJS.voteengine.searchTerm = null;
            };
        };

        console.log(filteredPools);
        //Rendering
        filteredPools.length > 0 ?
            OIOJS.voteengine.doRenderPolls(filteredPools) : OIOJS.voteengine.doHandleNoResult();
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
                            e.description.replace(new RegExp(OIOJS.voteengine.searchTerm, "gi"), '<i class="search">' + OIOJS.voteengine.searchTerm + '</i>') :
                            e.description;
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

                var totalScore = e.pool.values.reduce(((acc, v) => acc + v.value), 0);
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
                    html: e,
                    "data-value": e
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
        //Init pools
        this.poolsPayload = OIOJS.mocks.getPolls();

        var pools = OIOJS.voteengine.poolsPayload.result;

        OIOJS.voteengine.searchTerm = $('#searchbar input').val();
        // console.log(OIOJS.voteengine.searchTerm);
        OIOJS.voteengine.doValidateSearchTerm() === true ?
            OIOJS.voteengine.doFilterPolls(false) :
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
        //Facets search
        $('.searchEngine .dropdown-menu, .dropdown-item ').on('keyup click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            var _that = this;

            if (OIOJS.voteengine.searchFacets == null) {
                //facets search init
                OIOJS.voteengine.searchFacets = [];
            };

            var facetVal = $(_that).data("value");
            if (facetVal != null && facetVal.length > 0 && !OIOJS.utils.includesCaseInsensitive(OIOJS.voteengine.searchFacets, facetVal)) {
                OIOJS.voteengine.searchFacets.push(facetVal);
            }
            console.log(OIOJS.voteengine.searchFacets);
            // return false;
        });


        $('.search-action').on('click', function(e) {
            //Init
            if ((OIOJS.voteengine.searchTerm == null ||
                    OIOJS.voteengine.searchTerm.length == 0) && (OIOJS.voteengine.searchFacets == null ||
                    OIOJS.voteengine.searchFacets.length == 0) && $('.searchEngine input').val().trim().length == 0) {

                OIOJS.voteengine.doDataInit();
            } else {

                OIOJS.voteengine.doFilterPolls(true);
            }
        });

        //Search term
        $('.searchEngine input').on('keyup click', function(e) {
            var _that = this;
            if ((OIOJS.voteengine.searchTerm = $(_that).val().trim()).length > 1) {
                //not facet search
                OIOJS.voteengine.doFilterPolls(false);
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
};

OIOJS.utils = {

    capitalizeFirstLetter: function(inputString) {
        return inputString.charAt(0).toUpperCase() + inputString.slice(1);
    },

    formatTag: function(inputString) {
        return this.capitalizeFirstLetter(inputString.toLowerCase());
    },

    arrayIntersection: function(arrA, arrB) {
        return arrA.map(e => e.toLowerCase()).filter(e => arrB.map(e => e.toLowerCase()).includes(e));
    },

    includesCaseInsensitive: function(myArray, myString) {
        return myArray.map(e => e.toLowerCase()).includes(myString.toLowerCase());
    }
};

$(function() {
    OIOJS.voteengine.init();

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


});