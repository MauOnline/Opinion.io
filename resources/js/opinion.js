"use strict"

var OIOJS = OIOJS || {};

OIOJS.voteengine = {

    init: function() {
        this.dataInit();
        this.bindVote();
    },

    dataInit: function() {
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
      
            $.each({_that, parent}, function(i, e){
            	var target = i === 0 ? 'score' : 'total';
            	var oldVal =  $(e).data(target);
            	// alert(oldVal);
            	$(e).data(target, oldVal+1); //update
            })

            $(parent).children('.choice').each(function(i, e) {
                OIOJS.voteengine.calculateScore(e);
            })
        });
    }
}

$(function() {
    OIOJS.voteengine.init();
})