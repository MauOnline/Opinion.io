"use strict"

var OIOJS = OIOJS || {};

const FILTER_COLS_TRESHOLD = 7;
OIOJS.pollFramework = {
    //Manage the vote engine and search engine

    favorites: {
        tags: [],
        publishers: [],
        polls: []
    },
    pollsPayload: null,
    searchTerm: null,
    searchFacets: null,
    tagFacets: null,
    publisherFacets: null,
    toggleModalRefs: [],
    init: function () {
        this.doDataInit();
        this.bindVote();
        this.bindSearch();
        this.bindNewPollForm();
    },

    isFacetSearch: function () {
        return OIOJS.pollFramework.searchFacets != null &&
            OIOJS.pollFramework.searchFacets.length > 0 &&
            (OIOJS.pollFramework.searchTerm == null ||
                OIOJS.pollFramework.searchTerm.length == 0);
    },

    doValidateSearchTerm: function () {
        return OIOJS.pollFramework.searchTerm != null &&
            OIOJS.pollFramework.searchTerm !== 'undefined' &&
            OIOJS.pollFramework.searchTerm.length > 1;
    },

    doFilterPolls: function () {
        var filteredPolls = []
        if (OIOJS.pollFramework.pollsPayload != null && OIOJS.pollFramework.pollsPayload !== "undefined") {
            if (OIOJS.pollFramework.isFacetSearch()) {
                //Facets search
                filteredPolls = OIOJS.pollFramework.pollsPayload.result.filter(function (e) {
                    return OIOJS.utils.arrayIntersection(e.tags.split(","), OIOJS.pollFramework.searchFacets).length > 0 ||
                        (e.publisher !== null && typeof e.publisher !== 'undefined' &&
                            OIOJS.utils.includesCaseInsensitive(OIOJS.pollFramework.searchFacets, e.publisher.code));
                });

            } else {
                //Searchterm
                filteredPolls = OIOJS.pollFramework.pollsPayload.result.filter(p => p.description.match(new RegExp(OIOJS.pollFramework.searchTerm, "gi")));
            };
        };
        // console.log(filteredPolls);
        //Rendering
        filteredPolls.length > 0 ?
            OIOJS.pollFramework.doRenderPolls(filteredPolls) : OIOJS.pollFramework.doHandleNoResult();
        // return filteredPools;
    },

    doHandleNoResult: function () {
        $('#result .questions').hide();
        $('.noResult .noResultSearchTerm').text(OIOJS.pollFramework.searchTerm);
        $('.noResult').show();
        OIOJS.pollFramework.searchTerm = null;
    },

    doRenderPolls: function (polls) {
        // console.log(polls)
        // var user = OIOJS.userFramework.getUser();
        var pollItemTemplateDef = document.getElementById("pollItemTemplate").innerHTML;

        if (polls && polls.length > 0) {
            OIOJS.pollFramework.doCleanupView();

            //Poll result template
            var pollItemTemplateCompiled = Handlebars.compile(pollItemTemplateDef);
            var pollItemTemplateHTML = pollItemTemplateCompiled(polls);
            $('ul.questions').append(pollItemTemplateHTML);
            $('ul.questions').show();
        }
    },

    doRenderFacets: function () {

        var generateColumnItems = function (itemList, domTarget, isTag) {
            //Emptying the container
            domTarget.empty();
            // create items
            var items = itemList.map(i => $('<div/>', {
                class: 'dropdown-item',
                "data-ref": isTag ? i : i.code,
                "data-tag": isTag,
                html: function () {
                    var name = isTag ? OIOJS.utils.formatTag(i) : OIOJS.utils.formatTag(i.name);
                    var code = isTag ? OIOJS.utils.formatTag(i) : i.code;
                    // console.log(isFollowedTags(code));
                    var isPoll = !isTag && typeof i.name === 'undefined';
                    var colorVal = OIOJS.utils.isFavorite(code, isPoll) ? "red !Important" : "lightgrey";

                    //link to add filter to favorite fot the authenticated user
                    var favoriteButton = $('<a/>', {
                        class: 'favoriteBtn',
                        href: 'javascript:void(0)',
                        html: function () {
                            var facetFavIcon = $('<i/>', {
                                class: 'fa fa-thumb-tack',
                                style: 'color:' + colorVal
                            });
                            return facetFavIcon[0].outerHTML;
                        }
                    });

                    //Link to appy filter on polls view
                    var filterButton = $('<a/>', {
                        class: 'filterBtn',
                        href: 'javascript:void(0)',
                        text: name
                    });
                    // console.log(favoriteButton[0].outerHTML + filterButton[0].outerHTML);
                    return favoriteButton[0].outerHTML + filterButton[0].outerHTML;
                }
            }));

            //create columns of 8 items
            var itemsBuckets = [];
            var startPos = 0;
            for (var i = 0; i < items.length; i++) {
                if (i > 0 && i % FILTER_COLS_TRESHOLD == 0) {
                    itemsBuckets.push(items.slice(startPos, i));
                    startPos = i;
                } else if (i == items.length - 1) {
                    itemsBuckets.push(items.slice(startPos));
                }
            }

            $.each(itemsBuckets, function (i, bucket) {
                var col = $('<div/>', {
                    class: 'col'
                });
                col.append(bucket).append($('<div/>', {
                    class: 'dropdown-divider',
                    role: 'separator'
                }));
                if ($(col).children('div').length > 0) {
                    domTarget.append(col);
                }
            });
        };

        //Tags
        if (OIOJS.pollFramework.doExtractTags()) {
            // console.log(OIOJS.pollFramework.tagFacets);
            generateColumnItems(OIOJS.pollFramework.tagFacets, $('#tagfacets .row'), true);
        };

        //Publishers
        if (OIOJS.pollFramework.doExtractPublishers()) {
            generateColumnItems(OIOJS.pollFramework.publisherFacets, $('#publisherfacets .row'), false);
        };
    },

    doExtractPublishers: function () {
        OIOJS.pollFramework.publisherFacets = [];
        var temp = [] //Include a publisher only once based on publisher code
        $.each(OIOJS.pollFramework.pollsPayload.result, function (i, e) {
            if (e.publisher != null && temp.indexOf(e.publisher.code) < 0) {
                OIOJS.pollFramework.publisherFacets.push(e.publisher);
                temp.push(e.publisher.code);
            }
        });

        return OIOJS.pollFramework.publisherFacets.length > 0;
    },

    doExtractTags: function () {
        var temp = OIOJS.pollFramework.pollsPayload.result.filter(e => e.tags != null
            || typeof e.tags === 'undefined').reduce(function (acc, e) {
                e.tags.split(",").forEach(function (i) {
                    // console.log(i);
                    if (OIOJS.utils.includesCaseInsensitive(acc, i) === false) {
                        acc.push(i)
                    };
                });
                return acc;
            }, []);

        temp.sort();
        // console.log(temp);
        OIOJS.pollFramework.tagFacets = temp;
        return OIOJS.pollFramework.tagFacets.length > 0;
    },

    doCleanupView: function () {
        $('.noResult').hide();
        $('#result ul.questions[class!="detailView"]').empty();
    },

    doDataInit: function () {
        var _that = this;
        //Init polls
        // this.pollsPayload = OIOJS.mocks.getPolls();

        OIOJS.utils.fnSendRequest('GET', 'http://opncore.local/api/v1/polls?page=1', null, function (resp) {
            _that.pollsPayload = resp.data;
            var polls = _that.pollsPayload.result;

            $("#debug-display").append("<i> Polls displayed" + polls.length + "</i>"); //TODO: remove on production

            //Render polls
            _that.searchTerm = $('#searchbar input').val();
            _that.doValidateSearchTerm() === true ?
                _that.doFilterPolls() :
                _that.doRenderPolls(polls);

            //render facets
            _that.doRenderFacets();
        }, false)
    },

    doCalculateScore: function (q) {
        if (q !== 'undefined') {

            //TODO: refresh the scores and the glance score view .

            // var parent = $(q).parent('.question-container');
            // var scoreTotalVal = $(parent).data('total');
            // console.log(q);
            var propositions = $(q).children('.question-container .proposition');

            var scoreTotalVal = 0;
            $.each(propositions, function (i, p) {
                scoreTotalVal += $(p).data('score');
            });
            console.log(scoreTotalVal);

            $.each(propositions, function (i, p) {

                var scoreVal = $(P).data('score');
                var scorePercentageVal = (scoreVal * 100) / scoreTotalVal;
                $(q).find('.score .badge').text(scoreVal + '(' + scorePercentageVal.toFixed(2) + '%)');
            });
        }
    },

    setSearchTerm: function (searchTermParam) {
        OIOJS.pollFramework.searchFacets = null;
        OIOJS.pollFramework.searchTerm = searchTermParam;
        console.log(OIOJS.pollFramework.searchTerm);
    },

    setSearchFacets: function (searchFacetsParam) {
        OIOJS.pollFramework.searchTerm = null;
        var isSet = false;

        if (OIOJS.pollFramework.searchFacets == null) {
            OIOJS.pollFramework.searchFacets = [];
        }

        if (typeof searchFacetsParam === "string") {
            if (OIOJS.utils.includesCaseInsensitive(OIOJS.pollFramework.searchFacets, searchFacetsParam) === false) {
                OIOJS.pollFramework.searchFacets.push(searchFacetsParam);
            }
        } else if (typeof searchTermParam === "array") {
            OIOJS.pollFramework.searchFacets = setSearchFacetsParam;
        }
        console.log(OIOJS.pollFramework.searchFacets)
        if ((isSet = OIOJS.pollFramework.searchFacets != null && OIOJS.pollFramework.searchFacets.length > 0) === true) {
            $('.searchEngine input').val(OIOJS.pollFramework.searchFacets.reduce((acc, f) => acc = acc + ";" + f));
        }
        return isSet;
    },

    bindSearch: function () {
        // alert("done")
        //Capture Facets search
        $(document).on('click', '.dropdown-item .filterBtn', function (e) {
            alert("Filter !");

            var _that = this;
            OIOJS.pollFramework.setSearchFacets($(_that).data("ref"));
            // return false;
        });

        //Capture Search term
        $('.searchEngine input').on('keyup click', function (e) {
            var _that = this;
            OIOJS.pollFramework.setSearchTerm($(_that).val().trim());
        });

        $('.search-action').on('click', function (e) {
            OIOJS.pollFramework.doFilterPolls();
        });
    },

    bindVote: function () {
        $(document).on('click', '.proposition', function () {
            var user = OIOJS.userFramework.getUser();

            var _that = this;
            var parent = $(_that).parents('li.question');

            var reqObj = {
                "poll_id": $(parent).data('id'),
                "proposition_code": $(_that).data('code')
            };

            OIOJS.utils.fnSendRequest('POST', 'http://opncore.local/api/v1/vote', reqObj, function (resp) {
                // console.log(pollResponse);
                var pollItem = $('li[data-id="' + reqObj.poll_id + '"]');

                var prevOvervChart = pollItem.find('div[class*="pollResultOverViewChart"]');
                var newOvervChart = OIOJS.utils.fnRenderOverviewChart(resp.propositions);
                prevOvervChart.replaceWith(newOvervChart);

                var prevPropositions = pollItem.find('div[class*="propositions"]');
                var newPropositions = OIOJS.utils.fnRenderScores(resp.propositions);
                prevPropositions.replaceWith(newPropositions);

            }, true, parent);
        });

        $(document).on('mouseover', '.proposition', function () {
            var _that = this;
            if (typeof $(_that).find('.fa-thumbs-up').data("selected") === 'undefined') {
                $(_that).find('.fa-thumbs-up').addClass("thumbsUpHover");

            }
        });

        $(document).on('mouseout', '.proposition', function () {
            var _that = this;
            if (typeof $(_that).find('.fa-thumbs-up').data("selected") === 'undefined') {
                $(_that).find('.fa-thumbs-up').removeClass("thumbsUpHover");
            }
        });

        //Init default propositions color
        $('input[class~="picker"]').each(function (i, e) {
            var _that = $(this);
            var col;
            if ((col = _that.data('color')) !== undefined && col.indexOf('#') == 0) {
                // console.log(col);
                _that.css({
                    backgroundColor: col
                })
                _that.data('color', col);
            }
        });
    },

    bindNewPollForm: function () {

        //Enable tooltips
        $('[data-toggle="tooltip"]:disabled').tooltip();

        //Select poll's end date
        $('#newPollTimer').datetimepicker();

        //Select proposition's color
        $('input.picker').colorPicker({
            preview: false,
            setValue: function (color, txt) { }
        });

        $(document).on('click keydown keyup', 'input.picker', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).val(null);
            return false;
        });

        //Timer check
        $(document).on('change', 'input#isPollTimer', function () {
            $('input#newPollTimer').prop('disabled', !$(this).prop("checked"));
        });

        //Select poll type
        $(document).on('change', '#newPollType', function () {
            var _that = $(this);
            switch (_that.val()) {
                case "PROP":
                    $('[class="form-group"][id="newPollPropositions"]').fadeIn();
                    break;
                case "EMTC":
                    $('[class="form-group"][id="newPollPropositions"]').fadeOut();
                    break;
                default:
                    return false;
            }

        });


        //Initiate Add tag
        $('#newPollTags').tagsInput({
            // 'autocomplete_url': url_to_autocomplete_api,
            // 'autocomplete': { option: value, option: value},
            'height': '100px',
            'width': '400px',
            'interactive': true,
            'defaultText': 'New tag',
            // 'onAddTag':callback_function,
            // 'onRemoveTag':callback_function,
            // 'onChange' : callback_function,
            'delimiter': ',',   // Or a string with a single delimiter. Ex: ';'
            'removeWithBackspace': false,
            'minChars': 3,
            'maxChars': 15, // if not provided there is no limit
            'placeholderColor': '#666666'
        });


        $(document).on('click', 'button#newPollCreate', function (e) {
            //Create new Poll for authenticated user
            var _that = this;
            var newPollModal = $('#newPollModal'); //Model can be used to trigger event dynamicaly
            OIOJS.pollFramework.toggleModalRefs.push('#newPollModal');//Store modal ID for herror management
            var newPollForm = $(newPollModal).find('#newPollForm');
            var newPollQuestion = $(newPollForm).find('#newPollQuestion').val();
            var newPollTimer = $(newPollForm).find("#newPollTimer").val();
            var newPollTags = $(newPollForm).find('input#newPollTags').val();
            var newPollType = $(newPollForm).find('#newPollType').val();

            var newPollPropositions = [];
            $(newPollForm).find('#newPollPropositions .proposition').each(function (i, e) {
                newPollPropositions.push({
                    "value": $(e).find('input.value').val(),
                    "color": $(e).find('input.picker').data('color')
                })
                // console.log($(e).find('.value').val());
                // console.log($(e).find('.picker').data('color'));
            });

            var newPollSources = [];
            $(newPollForm).find('#newPollSources .source').each(function (i, e) {

                var link = $(e).find('input').val();
                if (link.length > 0) {

                    var isWeblink = $(e).find('input').hasClass('link');
                    var isVideo = $(e).find('input').hasClass('vid-link');
                    // var isPicture = $(e).find('input').hasClass('pic-link');
                    var sourceType = isWeblink ? 'link' : isVideo ? 'video' : 'image';

                    newPollSources.push({
                        "type": sourceType,
                        "link": link
                    });
                }
            });

            var reqObj = {
                "description": newPollQuestion,
                "timer": newPollTimer,
                "tags": newPollTags,
                "type": newPollType,
                "propositions": newPollPropositions,
                "sources": newPollSources
            }

            OIOJS.utils.fnSendRequest("POST", "http://opncore.local/api/v1/poll", reqObj,
                function (response) {
                    //Close modal
                    $('#newPollModal').modal('hide');
                    //TODO: Redirect to Poll details view
                    // window.location.reload();
                }, true, $('#newPollModal .modal-dialog'));
        });

    }
};

OIOJS.userFramework = {
    //Manage all user context related functionalies
    init: function () {
        this.bindSignIn();
        this.bindSignOut();
        this.bindSignUp();
        this.bindAddFavorite();
        this.doRenderUserDetails();

    },
    getUser: function () {
        return JSON.parse(sessionStorage.getItem("user"));
    },
    doRenderUserDetails: function () {

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
    doSignIn: function () {
        var reqObj = {
            "email": $('#emailInput').val(),
            "password": $('#passwdInput').val()
        };

        OIOJS.utils.fnSendRequest('POST', 'http://opncore.local/api/v1/login', reqObj, function (resp) {

            //Store user details
            sessionStorage.setItem("user", JSON.stringify(resp));

            //Store user preferences
            OIOJS.pollFramework.favorites.tags = resp.favorites.tags;
            OIOJS.pollFramework.favorites.publishers = resp.favorites.publishers;
            OIOJS.pollFramework.favorites.polls = resp.favorites.polls;
            sessionStorage.setItem("favorites", JSON.stringify(OIOJS.pollFramework.favorites));

            window.location.reload();
        }, false, null);
    },

    doSignUp: function () {
        return null;
    },

    doSignOut: function () {

        //Clean session
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("favorites");

        OIOJS.userFramework.doRenderUserDetails();
        window.location.reload();
    },

    bindAddFavorite: function (e) {
        $(document).on('click', '.dropdown-item .favoriteBtn, .question-label .favoriteBtn', function (event) {

            var isPoll = $(this).parent('div').hasClass('question-label');

            var parent = isPoll ? $(this).parent('.question-label') : $(this).parent('.dropdown-item');
            var type = $(parent).data('tag') === true ? 'tag' : isPoll ? 'poll' : 'publisher';
            var item_ref = $(parent).data('ref');

            var reqObj = {
                "favorites": [
                    {
                        "item_ref": item_ref,
                        "type": type
                    }
                ]
            }

            OIOJS.utils.fnSendRequest('POST', 'http://opncore.local/api/v1/favorites', reqObj, function (response) {
                // console.log(response);
                // OIOJS.pollFramework.tagFacets.push(response.tags)
                OIOJS.pollFramework.favorites.tags = response.tags;
                OIOJS.pollFramework.favorites.publishers = response.publishers;
                OIOJS.pollFramework.favorites.polls = response.polls;
                // console.log(OIOJS.pollFramework.favorites);
                sessionStorage.setItem("favorites", JSON.stringify(OIOJS.pollFramework.favorites));
                OIOJS.pollFramework.doRenderFacets();
                OIOJS.pollFramework.doRenderPolls(OIOJS.pollFramework.pollsPayload.result);
            }, true, null);
        });
    },

    bindSignIn: function () {
        //TODO:Fetch form inputs,  apply first validation and trigger signIn request
        $('#signInModal .validate').on('click', function () {
            // console.log("done !");
            $('#signInModal').modal('hide');
            OIOJS.userFramework.doSignIn();
        });
    },

    bindSignOut: function () {
        //TODO:trigger signOut request
        $('.user .signOut').on('click', function () {
            // console.log("done !");
            OIOJS.userFramework.doSignOut();

        });
    },

    bindSignUp: function () {

        $('.signUp').on('click', function () {
            $('#signInModal .signUpForm').show();
            $('#signInModal .signInForm').hide();
        });

        $('.signUpCancel').on('click', function () {
            $('#signInModal .signUpForm').hide();
            $('#signInModal .signInForm').show();
        });
    }

};


OIOJS.utils = {

    isFavorite: function (item, isPoll) {
        // var user = OIOJS.userFramework.getUser();
        var favorites = JSON.parse(sessionStorage.getItem("favorites"));
        // console.log(favorites);

        if (favorites == null) {
            return false;
        }

        if (isPoll) {
            //Check favorite poll
            return OIOJS.utils.includesCaseInsensitive(favorites.polls, item);
        } else {
            // console.log(favorites.tags);
            // console.log(item);
            //check favorite facet (tags or publisher)
            return OIOJS.utils.includesCaseInsensitive(favorites.publishers, item)
                || OIOJS.utils.includesCaseInsensitive(favorites.tags, item);
        }
    },

    startLoader: function (domElement) {
        OIOJS.utils.fnHandleLoader(domElement, true);
    },

    stopLoader: function (domElement) {
        OIOJS.utils.fnHandleLoader(domElement, false);
    },

    fnHandleLoader: function (domElement, isStartFlag) {
        // console.log(domElement)
        // if (typeof domElement === 'undefined' || $(domElement).length == 0) {
        //     return false;
        // }
        var isStart = isStartFlag && domElement !== null && $(domElement).length > 0;
        if (!isStart) {
            $('.loader-container').remove();
        } else {
            //Get dom element offset/position
            var pos = $(domElement).offset();
            //Get dom element width and height
            var width = $(domElement).width();
            var height = $(domElement).height();
            // console.log(width);
            // console.log(height);
            //Create loader box
            var loaderContainer = $('<div/>', {
                class: "loader-container",
                html: $('<i/>', {
                    class: "fa fa-refresh fa-spin",
                    'aria-hidden': "true",
                    style: "font-size:40px;"
                })
            }).appendTo($('body'));

            loaderContainer.offset(pos);
            loaderContainer.width(width);
            loaderContainer.height(height);
            // loaderContainer.show();
        }
    },

    capitalizeFirstLetter: function (inputString) {
        return inputString.charAt(0).toUpperCase() + inputString.slice(1);
    },

    formatTag: function (inputString) {
        return this.capitalizeFirstLetter(inputString.toLowerCase());
    },

    arrayIntersection: function (arrA, arrB) {
        return arrA.map(e => e.toLowerCase()).filter(e => this.includesCaseInsensitive(arrB.map(e => e.toLowerCase()), e));
    },

    includesCaseInsensitive: function (myArray, myString) {
        if (myArray == null || myArray.length == 0) {
            return false;
        }
        return myArray.map(e => e.toLowerCase()).includes(myString.toLowerCase());
    },

    registerTemplateHelpers: function () {

        //========Draw chart for result overview ==========//
        //=================================================//
        Handlebars.registerHelper('renderOverviewChart', function (propositions) {
            return OIOJS.utils.fnRenderOverviewChart(propositions);
        });

        //========Evaluate score for each proposition =======//
        //===================================================//
        Handlebars.registerHelper('renderScores', function (propositions) {
            return OIOJS.utils.fnRenderScores(propositions);
        });

        //============ Render Poll description ==============//
        //===================================================//
        Handlebars.registerHelper('renderDescription', function (description, id) {
            return OIOJS.utils.fnRenderDescription(description, id);
        });
    },


    fnRenderDescription: function (description, id) {

        var favorites = JSON.parse(sessionStorage.getItem("favorites"));

        var labelContainer = $('<div/>', {
            class: "question-label",
            "data-ref": id,
            "data-tag": false
        });

        var favoriteBtn = $('<a/>', {
            class: "favoriteBtn",
            href: "javascript:void(0)"
        });

        var favIconColor = favorites && favorites.polls.includes(id.toString()) ? "red !Important" : "lightgrey";
        var labelFavIcon = $('<i/>', {
            class: "fa fa-thumb-tack",
            style: "color:" + favIconColor
        })

        var labelText = OIOJS.pollFramework.doValidateSearchTerm() ?
            description.replace(new RegExp(OIOJS.pollFramework.searchTerm, "gi"),
                '<i class="search">' + OIOJS.pollFramework.searchTerm + '</i>') : description;

        favoriteBtn.append(labelFavIcon);
        labelContainer.append(favoriteBtn);
        labelContainer.append("&nbsp;" + labelText);

        return labelContainer[0].outerHTML;
    },

    fnRenderScores: function (propositions) {

        console.log(propositions);

        var totalScore = propositions.reduce(((acc, v) => acc + v.score), 0);
        var propositionsContainer = $('<div/>', {
            class: 'propositions'
        });

        $.each(propositions, function (i, p) {
            var scorePercentageVal = ((p.score * 100) / totalScore).toFixed(2);
            var scorePercentageStr = !isNaN(scorePercentageVal) ? p.score + "(" + scorePercentageVal + "%)" : p.score;
            var propositionItem = $('<div/>', {
                class: "proposition",
                "data-code": p.code,
                "data-score": p.score
            });


            var highlightColor = p.highlight === true ? "blue !important" : "lightgray"

            var likeIcon = $('<i/>', {
                class: "fa fa-thumbs-up fa-lg",
                "aria-hidden": "true",
                style: "color: " + highlightColor
            });

            var badge = $('<span/>', {
                class: "score badge badge-pill",
                style: "background-color:" + p.color,
                text: scorePercentageStr
            });

            var propositionText = $('<span/>', {
                class: 'propositionText',
                html: '&nbsp;' + p.label
            });

            propositionItem.append(likeIcon);
            propositionItem.append(badge);
            propositionItem.append(propositionText);
            propositionsContainer.append(propositionItem);
        });
        return propositionsContainer[0].outerHTML;
    },

    fnRenderOverviewChart: function (propositions) {
        var chartContainer = $('<div/>', {
            class: 'pollResultOverViewChart'
        });

        var newCanvas = $('<canvas/>', {
            class: "shadow mb-1",
        })[0];
        // console.log(options);
        var c = newCanvas.getContext('2d');

        var xOffset = 0;
        var yOffset = 0;
        var cw = newCanvas.width;
        var ch = newCanvas.height;
        var width = 0;
        var totalScore = propositions.reduce(((acc, v) => acc + v.score), 0);

        $(propositions).each(function (i, v) {
            width = Math.floor((((v.score * 100) / totalScore).toFixed(2)) * cw * .01);
            // console.log(width);
            // console.log(xOffset);
            c.fillStyle = v.color;
            c.fillRect(Math.floor(xOffset), yOffset, width, ch);
            xOffset += width;
        });

        var img = $('<img/>', {
            src: newCanvas.toDataURL()
        })

        chartContainer.append(img);
        return chartContainer[0].outerHTML;
    },

    fnSendRequest: function (method, url, reqObj, successCallBack, isSecured, loaderTarget) {

        //Retrieve authenticated used from application session
        var user = OIOJS.userFramework.getUser();
        var access_token = null;
        if (typeof user !== 'undefined' && user != null) {
            access_token = user.metadata.access_token;
        };

        //Evaluate content type based on request method
        var contentTypeVal = null;
        if (method !== 'GET') {
            contentTypeVal = 'application/json';
            reqObj = JSON.stringify(reqObj)
        }

        //Common Modal handler.
        var modalHandler = function () {
            $.each(OIOJS.pollFramework.toggleModalRefs, function (i, e) {
                $(e).modal('hide'); //close modal
                OIOJS.pollFramework.toggleModalRefs.splice(i, 1); //remove modals reference
                // console.log(OIOJS.pollFramework.toggleModalRefs);
            });
        }
        // console.log(reqObj);
        return $.ajax({
            url: url,
            method: method,
            contentType: contentTypeVal,
            dataType: 'json',
            data: reqObj,
            beforeSend: function (request, settings) {
                //Start loader if a loaderTarget is provided
                if (loaderTarget !== null && typeof loaderTarget !== 'undefined') {
                    OIOJS.utils.startLoader(loaderTarget);
                }

                //Check secured API call
                if (isSecured) {
                    request.setRequestHeader("Authorization", 'Bearer ' + access_token);
                }
            },
            statusCode: {
                401: function () {
                    // alert("Unauthorized");
                    OIOJS.utils.stopLoader(null);//If any error message loader is being removed anyway
                    $('#signInModal').modal('toggle');
                    modalHandler();
                },
                422: function () {
                    OIOJS.utils.stopLoader(null);//If any error message loader is being removed anyway
                    modalHandler();
                }
            }
        }).done(function (response, textStatus, jqXHR) {
            successCallBack(response);

            //Modal are closed on success response
            OIOJS.utils.stopLoader(null);

        }).fail(function (jqXHR, textStatus, errorThrown) {
            //On failure
            // console.log("xhr: " + jqXHR.responseXML);
            OIOJS.utils.stopLoader(null);
            console.log("Error:" + errorThrown + "\ntextStatus:" + textStatus + "\nresponse text:" + jqXHR.responseText + "\nstatus:" + jqXHR.status);
        });
    }

};

$(function () {
    //Order is !Important: init user framework before vote engine
    OIOJS.utils.registerTemplateHelpers();
    OIOJS.userFramework.init();
    OIOJS.pollFramework.init();

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


    var ctx = document.getElementById("weeklyProgression").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }, {
                label: '# of Votes',
                data: [12, 50, 9, 9, 14, 2],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }

            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });




    var ctx = document.getElementById("voteOrigins").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {}
    });



    //Poll result overview chart

    // var newCanvas = $('<canvas/>', {
    //     class: "shadow mb-2"
    // })[0];
    // $('.pollResultOverViewChart-test').append(newCanvas);
    // // console.log($('.pollResultOverViewChart'));

    // newCanvas.style.width = "100%";
    // newCanvas.style.height = "20px";
    // var c = newCanvas.getContext('2d');

    // var xOffset = 0;
    // var yOffset = 0;
    // var cw = newCanvas.width;
    // var ch = newCanvas.height;
    // var width = 0;

    // width = 45.87 * cw * .01;
    // c.fillStyle = "#28a745";
    // c.fillRect(Math.floor(xOffset), yOffset, Math.floor(width), ch);
    // // c.fillStyle = "#fff";
    // // c.font = "sans-serif";
    // // c.fillText("Canvas Rocks!", xOffset + 2, yOffset);
    // // con.strokeText("Canvas Rocks!", 5, 130);
    // xOffset += width;

    // width = 33.03 * cw * .01;
    // c.fillStyle = "#dc3545";
    // c.fillRect(Math.floor(xOffset), yOffset, Math.floor(width), ch);
    // // c.fillStyle = "#fff";
    // // c.font = "sans-serif";
    // // c.fillText("Canvas Rocks!", xOffset + 2, yOffset);
    // xOffset += width;

    // width = 21.10 * cw * .01;
    // c.fillStyle = "#ffc107";
    // c.fillRect(Math.floor(xOffset), yOffset, Math.floor(width), ch);
    // c.fillStyle = "#fff";
    // c.font = "sans-serif";
    // c.fillText("Canvas Rocks!", xOffset + 2, yOffset);




});