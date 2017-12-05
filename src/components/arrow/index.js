var Base = require('../base');

var Arrow = Base.extend({

    classname: "Arrow",

    constructor: function (options) {
        this.base(options);

        this.turnTypeIconPaths = {
            'C': 'arrow/straight.svg',
            'TL': 'arrow/left.svg',
            'TSLL': 'arrow/half-left.svg',
            'TSHL': 'arrow/hard-left.svg',
            'TR': 'arrow/right.svg',
            'TSLR': 'arrow/half-right.svg',
            'TSHR': 'arrow/hard-right.svg',
            'EXIT1': 'arrow/roundabout.svg',
            'EXIT2': 'arrow/roundabout.svg',
            'EXIT3': 'arrow/roundabout.svg',
            'EXIT4': 'arrow/roundabout.svg',
            'EXIT5': 'arrow/roundabout.svg',
            'EXIT6': 'arrow/roundabout.svg',
            'TU': 'arrow/u-turn.svg',
            'FINISH': 'arrow/flag.svg'
        }; //turn types to icon files

        this.bindAll(this, 'onRoute');
        ffwdme.on('navigation:onroute', this.onRoute);

        this.render();
    },

    classes: 'ffwdme-components-container ffwdme-grid-w3 ffwdme-grid-h2 ffwdme-info',

    turnTypeIconPaths: null,

    arrowEl: null,

    labelEl: null,

    distEl: null,

    lastTurn: null,

    announceDist: 150,

    imgUrl: function () {
        return ffwdme.defaults.imageBaseUrl;
    },

    make: function () {
        this.base();

        //create arrow ele
        var img = document.createElement('img');
        img.src = this.getRetinaImageUrl(this.imgUrl() + this.turnTypeIconPaths.C); //straight as default
        this.arrowEl = $(img).addClass('ffwdme-components-small-arrow').appendTo($(this.el));

        //label for exit
        var label = document.createElement('span');
        this.labelEl = $(label).addClass('ffwdme-components-label').addClass('ffwdme-components-label-roundabout').appendTo($(this.el));

        //label for distance
        var distbar = document.createElement('span');
        this.distEl = $(distbar).addClass('ffwdme-components-progress').appendTo($(this.el));
    },

    onRoute: function (e) {

        console.log(e);

        var turnType = null;
        var distance = e.navInfo.distanceToNextDirection;

        if (e.navInfo.finalDirection === true) {
            turnType = 'FINISH';
        } else {
            var direction = e.navInfo.nextDirection;
            if (!direction) return;


            turnType = direction.turnType;
            if (!turnType) return;

            if (distance > this.announceDist) {
                turnType = 'C';
            }


            if (/^EXIT/.test(turnType)) {
                this.labelEl.html(turnType.split('EXIT')[1]);
            } else {
                this.labelEl.html('');
            }
        }

        if (distance) {
            if (distance > this.announceDist) {
                distance = 0;
            } else if (distance > 100) {
                distance = 100;
            }

            distance = Math.floor(distance/10) * 10;
            $(this.distEl).attr('style', 'width: ' + distance + '%');
        }

        this.updateIcon(turnType);
    },

    updateIcon: function (turnType) {
        if (turnType != this.lastTurn) { // set img src only when turn type changes
            this.arrowEl[0].src = this.getRetinaImageUrl(this.imgUrl() + this.turnTypeIconPaths[turnType]);
            this.lastTurn = turnType;
        }
    }

});

module.exports = Arrow;
