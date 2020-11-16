var total = 150 // total number of images
var prev, rand; // used for random number generation
let gw = window.innerWidth; // window dimensions
let gh = window.innerHeight;
console.log("Global height: " + gh);
generate(); // generate two random images on page

// generate a random, non-repeating number (min inclusive and max exclusive)
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    rand = Math.floor(Math.random() * (max - min) + min);
    while (prev == rand) {
        rand = Math.floor(Math.random() * (max - min) + min);
    }
    prev = rand;
    return rand;
}

// target the html to generate fresh images
// assumption: image files are numbered consecutively starting from 0.jpg 
function generate() {

    // generate random images
    var img1 = document.getElementById("image1");
    img1.src = "web-optimized_test_images/" + getRandomInt(0, total) + ".jpg";
    var img2 = document.getElementById("image2");
    img2.src = "web-optimized_test_images/" + getRandomInt(0, total) + ".jpg";

    // once images load, calculate random sizes and positions
    img1.addEventListener("load", function() {
        randSize(img1);
        console.log("Image 1 Height: " + img1.height);
        randPlace(img1);
        console.log("Image 1 Top: " + img1.style.top);
    });
    img2.addEventListener("load", function() {
        randSize(img2);
        console.log("Image 2 Height: " + img2.height);
        randPlace(img2);
        console.log("Image 2 Top: " + img2.style.top);
    });
    
}

// create random image size based on window limits
function randSize(image) {
    if (image.width > image.height) { // landscape image, constrain width
        image.width = getRandomInt(100, gw);
    }
    else if (image.height > image.width) { // vertical image, constrain height
        image.height = getRandomInt(100, gh);
    }
}

// create a random position within window limits
function randPlace(image) {
    var temp = getRandomInt(0, gw - image.width);
    image.style.left = temp + "px";
    temp = getRandomInt(0, gh - image.height);
    image.style.top = temp + "px";
}

// how to mitigate the blip where you see the image re-size itself after it loads?
// something about my math might not be right...image is sometimes leaving the frame??
// finish print button feature (generate pdf server-side probably)