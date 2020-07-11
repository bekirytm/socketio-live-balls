const colors = ['blue' , 'green' , 'red' , 'yellow' , 'orange' , 'black' , 'grey'];

const randomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
};

module.exports = randomColor;