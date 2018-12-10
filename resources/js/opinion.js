"use strict"

var OIOJS = OIOJS || {};

const FILTER_COLS_TRESHOLD = 7;
OIOJS.pollFramework = {
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
        this.bindNewPollForm();
    },

    isFacetSearch: function() {
        return OIOJS.pollFramework.searchFacets != null &&
            OIOJS.pollFramework.searchFacets.length > 0 &&
            (OIOJS.pollFramework.searchTerm == null ||
                OIOJS.pollFramework.searchTerm.length == 0);
    },

    doValidateSearchTerm: function() {
        return OIOJS.pollFramework.searchTerm != null &&
            OIOJS.pollFramework.searchTerm !== 'undefined' &&
            OIOJS.pollFramework.searchTerm.length > 1;
    },

    doFilterPolls: function() {
        var filteredPolls = []
        if (OIOJS.pollFramework.pollsPayload != null && OIOJS.pollFramework.pollsPayload !== "undefined") {
            if (OIOJS.pollFramework.isFacetSearch()) {

                //Facets search
                filteredPolls = OIOJS.pollFramework.pollsPayload.result.filter(function(e) {
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

    doHandleNoResult: function() {
        $('#result .questions').hide();
        $('.noResult .noResultSearchTerm').text(OIOJS.pollFramework.searchTerm);
        $('.noResult').show();
        OIOJS.pollFramework.searchTerm = null;
    },

    doRenderPolls: function(polls) {
        var user = OIOJS.userFramework.getUser();
        var pollItemTemplateDef = document.getElementById("pollItemTemplate").innerHTML;

        if (polls.length > 0) {
            OIOJS.pollFramework.doCleanupView();

            //Poll result template
            var pollItemTemplateCompiled = Handlebars.compile(pollItemTemplateDef);
            var pollItemTemplateHTML = pollItemTemplateCompiled(polls);
            $('ul.questions').append(pollItemTemplateHTML);
            $('ul.questions').show();
        }
    },

    doRenderFacets: function() {

        var isFollowedTags = function(item) {
            var user = OIOJS.userFramework.getUser();
            // console.log(item);
            if (user !== null && user.favorites.tags !== null && user.favorites.publishers !== null) {
                return OIOJS.utils.includesCaseInsensitive(user.favorites.tags, item) ||
                    OIOJS.utils.includesCaseInsensitive(user.favorites.publishers, item);
            }
            return false;
        };

        var generateColumnItems = function(itemList, domTarget, isTag) {

            //Emptying the container
            domTarget.empty();
            // create items
            var items = itemList.map(i => $('<a/>', {
                class: 'dropdown-item',
                href: '#',
                html: function() {
                    var name = isTag ? OIOJS.utils.formatTag(i) : OIOJS.utils.formatTag(i.name);
                    var code = isTag ? OIOJS.utils.formatTag(i) : i.code;
                    // console.log(isFollowedTags(code));
                    var colorVal = isFollowedTags(code) ? "red !Important" : "lightgrey";
                    var facetFavIcon = $('<i/>', {
                        class: 'fa fa-bell',
                        style: 'color:' + colorVal
                    });

                    return facetFavIcon[0].outerHTML + name;
                },
                "data-ref": isTag ? i : i.code
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
        if (OIOJS.pollFramework.doExtractTags()) {
            // console.log(OIOJS.pollFramework.tagFacets);
            generateColumnItems(OIOJS.pollFramework.tagFacets, $('#tagfacets .row'), true);
        };

        //Publishers
        if (OIOJS.pollFramework.doExtractPublishers()) {
            generateColumnItems(OIOJS.pollFramework.publisherFacets, $('#publisherfacets .row'), false);
        };
    },

    doExtractPublishers: function() {
        OIOJS.pollFramework.publisherFacets = OIOJS.pollFramework.pollsPayload.result.map(p => p.publisher);
        return OIOJS.pollFramework.publisherFacets.length > 0;
    },

    doExtractTags: function() {
        var temp = OIOJS.pollFramework.pollsPayload.result.filter(e => e.tags != null || typeof e.tags === 'undefined').reduce(function(acc, e) {
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
        OIOJS.pollFramework.tagFacets = temp;
        OIOJS.pollFramework.tagFacets.push("sample 1", "sample 1");
        OIOJS.pollFramework.tagFacets.push("sample 1", "sample 1", "sample 1", "sample 1", "sample 1", "sample 1", "sample 1", "sample 1", "sample 1", "sample 1", "sample 1", "sample 1", "sample 1");
        // OIOJS.pollFramework.tagFacets.push(temp);
        return OIOJS.pollFramework.tagFacets.length > 0;
    },

    doCleanupView: function() {
        $('.noResult').hide();
        $('#result ul.questions[class!="detailView"]').empty();
    },

    doDataInit: function() {
        //Init pools
        this.pollsPayload = OIOJS.mocks.getPolls();

        var pools = OIOJS.pollFramework.pollsPayload.result;

        OIOJS.pollFramework.searchTerm = $('#searchbar input').val();
        // console.log(OIOJS.pollFramework.searchTerm);
        OIOJS.pollFramework.doValidateSearchTerm() === true ?
            OIOJS.pollFramework.doFilterPolls() :
            OIOJS.pollFramework.doRenderPolls(pools);

        //update facets
        OIOJS.pollFramework.doRenderFacets();
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
        OIOJS.pollFramework.searchFacets = null;
        OIOJS.pollFramework.searchTerm = searchTermParam;
        console.log(OIOJS.pollFramework.searchTerm);
    },

    setSearchFacets: function(searchFacetsParam) {
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

    bindSearch: function() {
        //Capture Facets search
        $('.searchEngine .dropdown-menu, .searchEngine .dropdown-item').on('keyup click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var _that = this;
            OIOJS.pollFramework.setSearchFacets($(_that).data("ref"));
            // return false;
        });

        //Capture Search term
        $('.searchEngine input').on('keyup click', function(e) {
            var _that = this;
            OIOJS.pollFramework.setSearchTerm($(_that).val().trim());
        });

        $('.search-action').on('click', function(e) {
            OIOJS.pollFramework.doFilterPolls();
        });
    },

    bindVote: function() {
        $(document).on('click', '.proposition', function() {
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

            $(parent).children('.proposition').each(function(i, e) {
                OIOJS.pollFramework.doCalculateScore(e);
            });

        });

        $(document).on('mouseover', '.proposition', function() {
            var _that = this;
            if (typeof $(_that).find('.fa-thumbs-up').data("selected") === 'undefined') {
                $(_that).find('.fa-thumbs-up').addClass("thumbsUpHover");

            }
        });

        $(document).on('mouseout', '.proposition', function() {
            var _that = this;
            if (typeof $(_that).find('.fa-thumbs-up').data("selected") === 'undefined') {
                $(_that).find('.fa-thumbs-up').removeClass("thumbsUpHover");
            }
        });

        //Init default propositions color
        $('input[class~="picker"]').each(function(i, e) {
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

    bindNewPollForm: function() {

        //Enable tooltips
        $('[data-toggle="tooltip"]:disabled').tooltip();

        //Select poll's end date
        $('#endDate').datetimepicker();

        //Select proposition's color
        $('input.picker').colorPicker({
            preview: false,
            setValue: function(color, txt) {}
        });

        $(document).on('click keydown keyup', 'input.picker', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).val(null);
            return false;
        });

        //Timer check
        $(document).on('change', 'input#timerCheck', function() {
            $('input#endDate').prop('disabled', !$(this).prop("checked"));
        });

        //Select poll type
        $(document).on('change', '#pollTypeSelect', function() {
            var _that = $(this);
            switch (_that.val()) {
                case "PR0":
                    $('[class="form-group"][id="propositions"]').fadeIn();
                    break;
                case "EM0":
                    $('[class="form-group"][id="propositions"]').fadeOut();
                    break;
                default:
                    return false;
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
    },

    registerTemplateHelpers: function() {

        var user = OIOJS.userFramework.getUser();

        //========Draw chart for result overview ==========//
        //=================================================//
        Handlebars.registerHelper('drawOverviewChart', function(poll) {

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
            var totalScore = poll.propositions.reduce(((acc, v) => acc + v.score), 0);


            $(poll.propositions).each(function(i, v) {

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
        });


        //========Evaluate score for each proposition =======//
        //===================================================//
        Handlebars.registerHelper('renderScores', function(poll) {

            var totalScore = poll.propositions.reduce(((acc, v) => acc + v.score), 0);

            var propositions = $('<div/>', {
                class: 'propositions'
            });

            $.each(poll.propositions, function(i, p) {

                var scorePercentageVal = ((p.score * 100) / totalScore).toFixed(2);

                var propositionItem = $('<div/>', {
                    class: "proposition",
                    "data-score": p.score
                });

                var likeIcon = $('<i/>', {
                    class: "fa fa-thumbs-up fa-lg",
                    "aria-hidden": "true"
                });

                var badge = $('<span/>', {
                    class: "score badge badge-pill",
                    style: "background-color:" + p.color,
                    text: p.score + "(" + scorePercentageVal + "%)"
                });

                var propositionText = $('<span/>', {
                    class: 'propositionText',
                    html: '&nbsp;' + p.label
                });

                propositionItem.append(likeIcon);
                propositionItem.append(badge);
                propositionItem.append(propositionText);
                propositions.append(propositionItem);
            });

            return propositions[0].outerHTML;
        });


        //============ Render Poll description ==============//
        //===================================================//
        Handlebars.registerHelper('renderDescription', function(description, id) {

            var labelContainer = $('<div/>', {
                class: "question-label"
            });

            var favIconColor = user != null && user.favorites.polls.includes(id) ? "red !Important" : "lightgrey";
            var labelFavIcon = $('<i/>', {
                class: "fa fa-bell",
                style: "color:" + favIconColor
            })

            var labelText = OIOJS.pollFramework.doValidateSearchTerm() ?
                description.replace(new RegExp(OIOJS.pollFramework.searchTerm, "gi"), '<i class="search">' + OIOJS.pollFramework.searchTerm + '</i>') :
                description;

            labelContainer.append(labelFavIcon);
            labelContainer.append("&nbsp;" + labelText);

            return labelContainer[0].outerHTML;
        });

    }
};

$(function() {
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