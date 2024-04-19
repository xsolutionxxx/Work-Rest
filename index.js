'use strict'

document.addEventListener("DOMContentLoaded", function () {

    const body = document.querySelector(".body");

    const buttons = document.querySelectorAll(".buttons button");

    const workMode = document.querySelector("#work-mode");
    const breakMode = document.querySelector("#break-mode");

    const display = document.querySelector("#display");
    const startBtn = document.querySelector("#startBtn");
    const pauseBtn = document.querySelector("#pauseBtn");
    const resetBtn = document.querySelector("#resetBtn");

    const sumWork = document.querySelector('.sum-work');
    const sumBreak = document.querySelector('.sum-break');

    let workStatus = false;
    let breakStatus = false;

    let startTime = 0;
    let elapsedTime = 0;
    let paused = true;
    let intervalId;
    let hrs = 0;
    let mins = 0;
    let secs = 0;

    let currentTime = 0;
    let totalWork = 0;
    let totalBreak = 0;

    workMode.addEventListener('click', () => {
        workMode.classList.toggle('mode-active-static');

        if (workMode.classList.contains('mode-active-static')) {
            switchModes();
            workStatus = true;
            breakStatus = false;
            updateButtonClasses();
        } else {
            switchModes();
            workStatus = false;
            breakStatus = false;
            updateButtonClasses();
        }

        if (workStatus) {
            body.classList.add('body-active-static');
            body.classList.remove('body-active');
            breakMode.classList.remove('mode-active');
        } else {
            body.classList.remove('body-active-static');
        }
    })

    breakMode.addEventListener('click', () => {
        breakMode.classList.toggle('mode-active');

        if (breakMode.classList.contains('mode-active')) {
            switchModes();
            breakStatus = true;
            workStatus = false;
            updateButtonClasses();
        } else {
            switchModes();
            breakStatus = false;
            workStatus = false;
            updateButtonClasses();
        }

        if (breakStatus) {
            body.classList.add('body-active');
            body.classList.remove('body-active-static');
            workMode.classList.remove('mode-active-static');
        } else {
            body.classList.remove('body-active');
        }
        updateButtonClasses();
    })

    function updateButtonClasses() {
        if (workStatus || breakStatus) {
            buttons.forEach(btn => {
                btn.classList.remove('button-active');
                btn.addEventListener('click', () => {
                    buttons.forEach(btnn => {
                        if (btnn.classList.contains('button-active')) {
                            btnn.classList.remove('button-active');
                        }

                        if (btn === resetBtn) {
                            setTimeout(() => {
                                btn.classList.remove('button-active');
                            }, 300)
                        }
                    });
                    btn.classList.add('button-active');
                });
            });
        } else {
            buttons.forEach(btn => {
                btn.classList.add('button-active');
                btn.addEventListener('click', () => {
                    buttons.forEach(btnn => {
                        if (btnn.classList.contains('button-active')) {
                            btnn.classList.remove('button-active');
                        }
                        btnn.classList.add('button-active');
                    });
                });
            });
        }
    }

    function switchModes() {
        if (workStatus || breakStatus) {
            currentTime += elapsedTime;
            checkMessage()
            paused = true;
            clearInterval(intervalId);
            startTime = 0;
            elapsedTime = 0;
            hrs = 0;
            mins = 0;
            secs = 0;
            currentTime = 0;
            display.textContent = "00:00:00";
        } else {
            currentTime += elapsedTime;
            checkMessage()
            paused = true;
            clearInterval(intervalId);
            startTime = 0;
            elapsedTime = 0;
            hrs = 0;
            mins = 0;
            secs = 0;
            currentTime = 0;
            display.textContent = "00:00:00";
        }
    }

    // ТАЙМЕР

    startBtn.addEventListener('click', () => {
        if ((workStatus || breakStatus) && paused) {
            paused = false;
            startTime = Date.now() - elapsedTime;
            intervalId = setInterval(updateTime, 75);
        }
    });

    pauseBtn.addEventListener('click', () => {
        if (!paused) {
            paused = true;
            elapsedTime = Date.now() - startTime;
            clearInterval(intervalId)
        }
    });

    resetBtn.addEventListener('click', () => {
        currentTime += elapsedTime;
        checkMessage()
        paused = true;
        clearInterval(intervalId);
        startTime = 0;
        elapsedTime = 0;
        hrs = 0;
        mins = 0;
        secs = 0;
        currentTime = 0;
        display.textContent = "00:00:00";
    });

    function formatTime(milliseconds) {
        secs = Math.floor((milliseconds / 1000) % 60);
        mins = Math.floor((milliseconds / (1000 * 60)) % 60);
        hrs = Math.floor((milliseconds / (1000 * 60 * 60)) % 60);

        secs = pad(secs);
        mins = pad(mins);
        hrs = pad(hrs);

        function pad(unit) {
            return (("0") + unit).length > 2 ? unit : "0" + unit;
        }

        return `${hrs}:${mins}:${secs}`;
    }

    function updateTime() {
        elapsedTime = Date.now() - startTime;
        display.textContent = formatTime(elapsedTime);
    }

    function checkMessage() {
        if (currentTime !== 0 && workStatus) {
            totalWork += currentTime;
            let result = `You have worked: ${formatTime(currentTime)}`;
            messageCreator(result);
            sumWork.textContent = `Work: ${formatTime(totalWork)}`;
        } else if (currentTime !== 0 && breakStatus) {
            totalBreak += currentTime;
            let result = `You were resting: ${formatTime(currentTime)}`;
            messageCreator(result);
            sumBreak.textContent = `Break: ${formatTime(totalBreak)}`;
        }
    }

    function messageCreator(message) {
        const timerResContainer = document.createElement("div");
        timerResContainer.classList.add('message');
        timerResContainer.textContent = message;

        const aside = document.querySelector(".aside");
        aside.appendChild(timerResContainer);
    }
});