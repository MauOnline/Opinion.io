"use strict"

var OIOJS = OIOJS || {};

const FILTER_COLS_TRESHOLD = 7;
OIOJS.voteengine = {
    //Manage the vote engine and search engine

    pollsPayload: null,
    searchTerm: null,
    searchFacets: null,
    tagFacets: null,
    publisherFacets: null,
    init: function() {
        this.doDataInit();
        this.bindVote();
        this.bindSearch();
    },

    isFacetSearch: function() {
        return OIOJS.voteengine.searchFacets != null &&
            OIOJS.voteengine.searchFacets.length > 0 &&
            (OIOJS.voteengine.searchTerm == null ||
                OIOJS.voteengine.searchTerm.length == 0);
    },

    doValidateSearchTerm: function() {
        return OIOJS.voteengine.searchTerm != null &&
            OIOJS.voteengine.searchTerm !== 'undefined' &&
            OIOJS.voteengine.searchTerm.length > 1;
    },

    doFilterPolls: function() {
        var filteredPolls = []
        if (OIOJS.voteengine.pollsPayload != null && OIOJS.voteengine.pollsPayload !== "undefined") {
            if (OIOJS.voteengine.isFacetSearch()) {

                //Facets search
                filteredPolls = OIOJS.voteengine.pollsPayload.result.filter(function(e) {
                    return OIOJS.utils.arrayIntersection(e.tags.split(","), OIOJS.voteengine.searchFacets).length > 0 ||
                        (e.publisher !== null && typeof e.publisher !== 'undefined' &&
                            OIOJS.utils.includesCaseInsensitive(OIOJS.voteengine.searchFacets, e.publisher));
                });

            } else {

                //Searchterm
                filteredPolls = OIOJS.voteengine.pollsPayload.result.filter(p => p.description.match(new RegExp(OIOJS.voteengine.searchTerm, "gi")));
            };
        };

        // console.log(filteredPolls);
        //Rendering
        filteredPolls.length > 0 ?
            OIOJS.voteengine.doRenderPolls(filteredPolls) : OIOJS.voteengine.doHandleNoResult();
        // return filteredPools;
    },

    doHandleNoResult: function() {
        $('#result .questions').hide();
        $('.noResult').show();
        OIOJS.voteengine.searchTerm = null;
    },

    doRenderPolls: function(pools) {
        var user = OIOJS.userFramework.getUser();

        if (pools.length > 0) {
            // OIOJS.voteengine.doCleanupView();
            $.each(pools, function(i, e) {

                var poolElement = $('<li/>', {
                    class: "question"
                });
                var poolContainer = $('<div/>', {
                    class: "question-container border-bottom border-left"
                });
                var poolPhrase = $('<div/>', {
                    class: "question-label"
                });

                var poolPhraseP = $('<p/>', {
                    html: function() {
                        return OIOJS.voteengine.doValidateSearchTerm() ?
                            "&nbsp;" + e.description.replace(new RegExp(OIOJS.voteengine.searchTerm, "gi"), '<i class="search">' + OIOJS.voteengine.searchTerm + '</i>') :
                            "&nbsp;" + e.description;
                    }
                });

                var isFollowedPoll = typeof user !== 'undefined' && user.favorites.polls.includes(e.id);

                var poolPhraseA = $('<i/>', {
                    class: "fa fa-bell",
                    style: isFollowedPoll ? "color:red !Important" : "color:lightgrey"
                });
                var poolShare = $('<div/>', {
                    class: "share",
                    html: ""
                });
                var poolInfo = $('<div/>', {
                    class: "info"
                });

                // poolPhrase.append(poolPhraseA);
                poolPhraseP.prepend(poolPhraseA);
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

                    var poolChoiceVoteIcon = $('<i/>', {
                        class: "fa fa-thumbs-up fa-lg",
                        "aria-hidden": "true",
                        style: "color:lightgrey"
                    });

                    var poolChoiceVoteLabel = $('<span/>', {
                        class: "label",
                        html: "&nbsp;" + v.label
                    });

                    var poolChoiceVoteScore = $('<div/>', {
                        class: "score",
                        html: $('<span/>', {
                            class: "badge badge-pill badge-" + progressBarColors[j]
                        })
                    });

                    // poolChoice.append(poolChoiceVoteIcon);
                    poolChoiceVoteLabel.prepend(poolChoiceVoteIcon);
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
                // poolContainer.append(poolShare);
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

            //Emptying the container
            domTarget.empty();
            // create items
            var items = itemList.map(i => $('<a/>', {
                class: 'dropdown-item',
                href: '#',
                html: OIOJS.utils.formatTag(i),
                "data-value": i
            }));
            //create columns of 8 items
            var itemsBuckets = []
            var startPos = 0;
            for (var i = 0; i < items.length; i++) {
                if (i > 0 && i % FILTER_COLS_TRESHOLD == 0) {
                    itemsBuckets.push(items.slice(startPos, i));
                    startPos = i;
                } else if (i == items.length - 1) {
                    itemsBuckets.push(items.slice(startPos));
                }
            }

            $.each(itemsBuckets, function(i, bucket) {

                var col = $('<div/>', {
                    class: 'col'
                });
                col.append(bucket).append($('<div/>', {
                    class: 'dropdown-divider',
                    role: 'separator'
                }));
                if ($(col).children('a').length > 0) {
                    domTarget.append(col);
                }
            });

        };

        //Tags
        if (OIOJS.voteengine.doExtractTags()) {
            // console.log(OIOJS.voteengine.tagFacets);
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
        var temp = OIOJS.voteengine.pollsPayload.result.filter(e => e.tags != null || typeof e.tags === 'undefined').reduce(function(acc, e) {
            e.tags.split(",").forEach(function(i) {
                // console.log(i);
                if (OIOJS.utils.includesCaseInsensitive(acc, i) === false) {
                    acc.push(i)
                };
            });
            return acc;
        }, []);

        temp.sort();
        // console.log(temp);
        OIOJS.voteengine.tagFacets = temp;
        OIOJS.voteengine.tagFacets.push("sample 1", "sample 1");
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
        this.pollsPayload = OIOJS.mocks.getPolls();

        var pools = OIOJS.voteengine.pollsPayload.result;

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

    setSearchTerm: function(searchTermParam) {
        OIOJS.voteengine.searchFacets = null;
        OIOJS.voteengine.searchTerm = searchTermParam;
        console.log(OIOJS.voteengine.searchTerm);
    },

    setSearchFacets: function(searchFacetsParam) {
        OIOJS.voteengine.searchTerm = null;
        var isSet = false;

        if (OIOJS.voteengine.searchFacets == null) {
            OIOJS.voteengine.searchFacets = [];
        }

        if (typeof searchFacetsParam === "string") {
            if (OIOJS.utils.includesCaseInsensitive(OIOJS.voteengine.searchFacets, searchFacetsParam) === false) {
                OIOJS.voteengine.searchFacets.push(searchFacetsParam);

            }
        } else if (typeof searchTermParam === "array") {
            OIOJS.voteengine.searchFacets = setSearchFacetsParam;
        }
        console.log(OIOJS.voteengine.searchFacets)
        if ((isSet = OIOJS.voteengine.searchFacets != null && OIOJS.voteengine.searchFacets.length > 0) === true) {
            $('.searchEngine input').val(OIOJS.voteengine.searchFacets.reduce((acc, f) => acc = acc + ";" + f));
        }
        return isSet;
    },

    bindSearch: function() {
        //Capture Facets search
        $('.searchEngine .dropdown-menu, .searchEngine .dropdown-item').on('keyup click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var _that = this;
            OIOJS.voteengine.setSearchFacets($(_that).data("value"));
            // return false;
        });

        //Capture Search term
        $('.searchEngine input').on('keyup click', function(e) {
            var _that = this;
            OIOJS.voteengine.setSearchTerm($(_that).val().trim());
        });

        $('.search-action').on('click', function(e) {
            OIOJS.voteengine.doFilterPolls();
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
            });

        });

        $(document).on('mouseover', '.choice', function() {
            var _that = this;
            if (typeof $(_that).find('.fa-thumbs-up').data("selected") === 'undefined') {
                $(_that).find('.fa-thumbs-up').addClass("thumbsUpHover");

            }
        });

        $(document).on('mouseout', '.choice', function() {
            var _that = this;
            if (typeof $(_that).find('.fa-thumbs-up').data("selected") === 'undefined') {
                $(_that).find('.fa-thumbs-up').removeClass("thumbsUpHover");
            }

        });
    }
};

OIOJS.userFramework = {
    //Manage all user context related functionalies
    init: function() {
        this.bindSignIn();
        this.bindSignOut();
        this.bindSignUp();
        this.bindAddFavorite();
        this.doRenderUserDetails();

    },
    getUser: function() {
        return JSON.parse(sessionStorage.getItem("user"));
    },
    doRenderUserDetails: function() {

        var user = null;
        if ((user = JSON.parse(sessionStorage.getItem("user"))) !== null) {
            //If sign in succeeded
            // console.log(user.account);
            $('.user .userProfile .userName').text(user.account.username);
            $('.user .userProfile').show();
            $('.user .signIn').hide();
            $('.user .signOut').show();
        } else {

            $('.user .userProfile .userName').empty();
            $('.user .userProfile').hide();
            $('.user .signIn').show();
            $('.user .signOut').hide();
        };
    },
    doSignIn: function() {
        sessionStorage.setItem("user", JSON.stringify(OIOJS.mocks.doLogin()));
        OIOJS.userFramework.doRenderUserDetails();
        window.location.reload();
    },

    doSignUp: function() {
        return null;
    },

    doSignOut: function() {
        sessionStorage.removeItem("user");
        OIOJS.userFramework.doRenderUserDetails();
        window.location.reload();
    },

    doAddFavorite: function(favoriteItem, type) {
        //@favoriteItem: The item being added as favortie
        //@type: the Item type. Possible values are: tg[tag], pbs[Publisher] or pl[poll]
        if (typeof favoriteItem !== 'undefined' && typeof type !== 'undefined') {

            switch (type) {
                case "tg":
                    break;
                case "pbs":
                    break;
                case "pl":
                    break;
                default:
                    // console.log("Unknown type "+type);
                    throw new Error("Unknown type " + type)

            }
        }
    },

    bindAddFavorite: function() {

        $(document).on('.unfetched', 'click', function(e) {
            e.preventDefault();
            var _that = this;
            OIOJS.userFramework.doAddFavorite(_that, '');

        });

        $(document).on('.fa-bell', 'click', function() {
            e.preventDefault();
            var _that = this;
            console.log("Follow poll");
            OIOJS.userFramework.doAddFavorite(_that, '');
        });

    },

    bindSignIn: function() {
        //TODO:Fetch form inputs,  apply first validation and trigger signIn request
        $('#signInModal .validate').on('click', function() {
            // console.log("done !");
            $('#signInModal').modal('hide');
            OIOJS.userFramework.doSignIn();


        });
    },

    bindSignOut: function() {
        //TODO:trigger signOut request
        $('.user .signOut').on('click', function() {
            // console.log("done !");
            OIOJS.userFramework.doSignOut();

        });


    },

    bindSignUp: function() {

        $('.signUp').on('click', function() {
            $('#signInModal .signUpForm').show();
            $('#signInModal .signInForm').hide();
        });

        $('.signUpCancel').on('click', function() {
            $('#signInModal .signUpForm').hide();
            $('#signInModal .signInForm').show();
        });




    }

};

OIOJS.utils = {

    capitalizeFirstLetter: function(inputString) {
        return inputString.charAt(0).toUpperCase() + inputString.slice(1);
    },

    formatTag: function(inputString) {
        return this.capitalizeFirstLetter(inputString.toLowerCase());
    },

    arrayIntersection: function(arrA, arrB) {
        return arrA.map(e => e.toLowerCase()).filter(e => this.includesCaseInsensitive(arrB.map(e => e.toLowerCase()), e));
    },

    includesCaseInsensitive: function(myArray, myString) {
        return myArray.map(e => e.toLowerCase()).includes(myString.toLowerCase());
    }
};

$(function() {
    // !Important: init user framework before vote engine
    OIOJS.userFramework.init();
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