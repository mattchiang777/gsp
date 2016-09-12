/**
 * Created by tkmabde on 3/23/16.
 */
// Class
function Circle(x, y, rad, color) {

    var _this = this;
    // var defaultColor = '#' + Math.floor(Math.random() * 16777215).toString(16); //16777215 is the decimal value of #FFFFFF
    var defaultColor = chooseColor();
    // var defaultColor = getRandomColor();
    // constructor
    (function() {
        _this.x = x || null;
        _this.y = y || null;
        _this.radius = rad || null;
        _this.color = color || defaultColor;
    })();

    this.update = function(increment) {
        _this.radius += increment;
    };

    this.draw = function(ctx) {
        if (!_this.x || !_this.y || !_this.radius || !_this.color) {
            console.error('Circle requires an x, y, radius and color');
            return;
        }
        ctx.beginPath();
        ctx.arc(_this.x, _this.y, _this.radius, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = _this.color;
        ctx.fill();

        // Letters

        // ctx.font = "200px Helvetica";
        // ctx.fillStyle = "white";
        // switch (_this.color) {
        //     case "#36F2B8":
        //         ctx.fillText("G", 500, 550);
        //         break;
        //     case "#58585B":
        //         ctx.fillText("S", 500, 550);
        //         break;
        //     case "#C1B257":
        //         ctx.fillText("&", 500, 550);
        //         break;
        //     case "#FF5185":
        //         ctx.fillText("P", 500, 550);
        //         break;

        // }

    };

    function chooseColor() {
        var choices = [
            "#36F2B8", // first
            "#58585B", // second
            "#C1B257", // third
            "#FF5185" // fourth
        ];

        return choices[Math.floor(Math.random() * choices.length)];


    }

    function getRandomColor() {
        // creating a random number between 0 and 255
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);

        // going from decimal to hex
        var hexR = r.toString(16);
        var hexG = g.toString(16);
        var hexB = b.toString(16);

        // making sure single character values are prepended with a "0"
        if (hexR.length == 1) {
            hexR = "0" + hexR;
        }

        if (hexG.length == 1) {
            hexG = "0" + hexG;
        }

        if (hexB.length == 1) {
            hexB = "0" + hexB;
        }

        // creating the hex value by concatenatening the string values
        var hexColor = "#" + hexR + hexG + hexB;

        return hexColor.toUpperCase();
    };
}