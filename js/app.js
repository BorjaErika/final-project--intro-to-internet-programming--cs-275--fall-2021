
window.onload = () => {
    const arrow = document.getElementsByClassName(`left`),
    tracks = document.getElementsByClassName(`carousel_track`);

    let offset = 0;

    let updatingArrows = () => {
        arrow[0].classList.remove(`right`);
        arrow[1].classList.remove(`right`);
        if(offset === 0) {arrow[1].classList.add(`right`);}
        else if(offset === -2500) {arrow[0].classList.add(`right`);}
    };

    let movingRight = () => {
        if(offset < 0)
        {
            offset += 500;
            for(let slide of tracks ) {slide.style.left = offset + `px`;}
        }
        updatingArrows();
    };

    let movingLeft = () => {
        if(offset > -2000)
        {
            offset -= 500;
            for(let slide of tracks) {slide.style.left = offset + `px`;}
        }
        updatingArrows();
    };

    arrow[0].addEventListener(`click`, movingLeft);
    arrow[1].addEventListener(`click`, movingRight);

    document.addEventListener(`keydown`, (k) => {
        if (k.key === `leftArrow`) {movingLeft();}
        else if (k.key === `rightArrow`) {movingRight();}
    });
};
