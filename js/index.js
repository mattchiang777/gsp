/*
    Written by Matthew Chiang @phattyphresh
    Animation details:
    1. Logo fades with sound. When sound stops, the logo reappears
    2. TODO Sync the vertex expansions better, don't just use levels for this part, maybe BPM?
    3. Background CSS animation is synced using overall sound level
    4. Toggle "Use Mic" to use the computer's microphone to take in sound.
    5. Works best on Chrome

    TODO Create better documentation
    TODO "Use Mic" UI has a bug where ticking useMic after having dropped an MP3 when the mic is on first replays the sample audio
 */

// Make an instance of two and place it on the page
var elem = document.getElementById('draw-shapes');
var params = {
  fullscreen: true
};
var two = new Two(params).appendTo(elem);

// Resolution represents how many subdivisions should be present during curve calculations (# of vertices)
Two.Resolution = 32;

// Create a circle copy to keep store of a circle's vertices' coordinates
var circleCopy = two.makeCircle(two.width / 2, two.height / 2, 50);
two.remove(circleCopy);
// global array of circle's vertices
var VERTICES = circleCopy.vertices.slice();

// Create the circles
var circle = two.makeCircle(0, 0, 50);
var circle2 = two.makeCircle(75, 0, 50);
var circle3 = two.makeCircle(150, 0, 50);
var circle4 = two.makeCircle(225, 0, 50);

// Make a group, order of circles as arguments determines which is drawn first
var group = two.makeGroup(circle, circle3, circle2, circle4);

// Get the group width and translate the group to the center of the page
var groupWidth = group.getBoundingClientRect().width;
group.translation.set(two.width / 2 - groupWidth / 2 + 50, two.height / 2);

// GS&P logo colors
circle.fill = '#36F2B8';
circle2.fill = '#58585B';
circle3.fill = '#C1B257';
circle4.fill = '#FF5185';

// Opacity
circle.opacity = 0.95;
circle2.opacity = 0.95;
circle3.opacity = 0.90;
circle4.opacity = 0.85;

// No border stroke
group.noStroke();

// Create text
var styles = {
  family: 'Proxima-Nova, sans-serif',
  size: 50,
  leading: 50,
  weight: 900
};

var text1 = two.makeText("G", 0, 6, styles);
var text2 = two.makeText("&", 150, 6, styles);
var text3 = two.makeText("S", 75, 6, styles);
var text4 = two.makeText("P", 225, 6, styles);

var textGroup = two.makeGroup(text1, text2, text3, text4);
textGroup.fill = '#F4EEEE';

// Get the text group width and translate the group to the center of the page
var textGroupWidth = group.getBoundingClientRect().width;
textGroup.translation.set(two.width / 2 - textGroupWidth / 2 + 50, two.height / 2);

// Helper functions for transforming anchor points
function transform() {
    $.each(group.children, function(idx, val) {
        for (var i = 0; i < val.vertices.length; i++) {
            var v = val.vertices[i];
            var pct = (i + 1) / circle.vertices.length;
            var theta = pct * Math.PI * 2;
            var radius = Math.random() * two.height;
            var x = radius * Math.cos(theta);
            var y = radius * Math.sin(theta);

            // Redraw the circles back to their original vertices after expanding off screen
            if (v.x < -two.width || v.x > two.width || v.y < -two.height || v.y > two.height) {
                v.x = VERTICES[i].x;
                v.y = VERTICES[i].y;
            }
            // Expand the vertices
            // CHANGE CODE HERE TO MESS WITH EXPANSION SPEED
            else {
                // v.x += Math.random() * x / 25;
                // v.y += Math.random() * y / 25;
                v.x += AudioHandler.getLevel() * x / 25;
                v.y += AudioHandler.getLevel() * y / 25;
                textGroup.opacity -= 1 / 1000;
            }
            
        }
    })
};

// Change the background if the sound level is greater than a certain point
function bgChangeColor() {
    if (AudioHandler.getLevel() < 0.2) {
        $('#draw-shapes').css('animationDuration', '0s');
        resetTextOpacity();
        resetVertices();
    } else {
        var newDuration = AudioHandler.getLevel() * 25 + 's';
        $('#draw-shapes').css('animationDuration', newDuration);
    }

}

function resetTextOpacity() {
    textGroup.opacity = 1;
}

/*
    Redraw the circles back to their original vertices if sound level gets low
    1. Check if the x and y coordinates of the vertex is positive or negative (which quadrant)
    2. Then check if it's past the original vertex position. If it is, decrease the position until it is.
    @params v is the vertex
    @params i is the index
    @params x is the angle in radians for the x coordinate
    @params y is the angle in radians for the y coordinate
    @params rate is the shrink speed
 */
function shrink(v, i, x, y, rate) {
    // bottom right
    if (v.x > 0 && v.y > 0) {
        if (v.x >= VERTICES[i].x && v.y >= VERTICES[i].y) {
            v.x -= x / rate;
            v.y -= y / rate;
        }
    }
    // top right
    else if (v.x > 0 && v.y < 0) {
        if (v.x >= VERTICES[i].x && v.y <= VERTICES[i].y) {
            v.x -= x / rate;
            v.y -= y / rate;
        }
    }
    // bottom left
    else if (v.x < 0 && v.y > 0) {
        if (v.x <= VERTICES[i].x && v.y >= VERTICES[i].y) {
            v.x -= x / rate;
            v.y -= y / rate;
        }
    }
    // top left
    else {
        if (v.x <= VERTICES[i].x && v.y <= VERTICES[i].y) {
            v.x -= x / rate;
            v.y -= y / rate;
        }
    }
};

function resetVertices() {
    $.each(group.children, function(idx, val) {
        for (var i = 0; i < val.vertices.length; i++) {
            var v = val.vertices[i];
            var pct = (i + 1) / circle.vertices.length;
            var theta = pct * Math.PI * 2;
            var radius = Math.random() * two.height;
            var x = radius * Math.cos(theta);
            var y = radius * Math.sin(theta);
            shrink(v, i, x, y, 500);
        }
    })
}

// Tell two to do an initial rendering on the screen
two.update();
two.bind('update', bgChangeColor);
two.bind('update', transform);
two.play();