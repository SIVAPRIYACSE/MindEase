
const assessmentForm =
    document.getElementById("assessmentForm");

if (assessmentForm) {

    assessmentForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        let score = 0;

        const questions = [
            "q1",
            "q2",
            "q3",
            "q4",
            "q5"
        ];

        questions.forEach(function(question) {

            const selected =
                document.querySelector(
                    `input[name="${question}"]:checked`
                );

            if (selected) {

                score += Number(selected.value);

            }

        });


        let result = "";


        if (score <= 5) {

            result =
                "Your responses indicate a relatively positive emotional state. Continue maintaining healthy habits.";

        }

        else if (score <= 10) {

            result =
                "You may be experiencing some emotional stress. Consider relaxation and mindfulness activities.";

        }

        else {

            result =
                "Your responses indicate higher levels of stress. Consider speaking with a trusted person or professional for support.";

        }


        const resultBox =
            document.getElementById("assessmentResult");


        if (resultBox) {

            resultBox.innerHTML = `
                <h3>Your Assessment Result</h3>

                <p>
                    <strong>Score:</strong> ${score}
                </p>

                <p>
                    ${result}
                </p>
            `;

        }


        /* ================================
           SAVE ASSESSMENT TO DATABASE
           ================================ */

        const userId =
            localStorage.getItem("mindEaseUserId");


        if (userId) {

            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/assessments",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                user_id: userId,

                                score: score,

                                result: result

                            })
                        }
                    );


                if (!response.ok) {

                    console.log(
                        "Assessment could not be saved."
                    );

                }

            }

            catch (error) {

                console.log(
                    "Assessment API error:",
                    error
                );

            }

        }

    });

}


/* =================================
   RESOURCES
   ================================= */

function showResource(message) {

    const resourceBox =
        document.getElementById("resourceResult");


    if (resourceBox) {

        resourceBox.innerHTML = `
            <div class="resource-message">
                ${message}
            </div>
        `;

    }

}


/* =================================
   MOOD TRACKER
   ================================= */

let selectedMood = "";


/* =================================
   SELECT MOOD
   ================================= */

function selectMood(mood) {

    selectedMood = mood;


    console.log(
        "Selected mood:",
        selectedMood
    );


    /* Remove previous selection */

    const moodButtons =
        document.querySelectorAll(".mood");


    moodButtons.forEach(function(button) {

        button.classList.remove("selected");

    });


    /* Find selected button */

    moodButtons.forEach(function(button) {

        const buttonText =
            button.innerText.trim();


        if (buttonText.includes(mood)) {

            button.classList.add("selected");

        }

    });

}


/* =================================
   SAVE MOOD TO MYSQL
   ================================= */

async function saveMood() {

    const userId =
        localStorage.getItem("mindEaseUserId");


    /* Check login */

    if (!userId) {

        alert(
            "🌿 Please login before saving your mood."
        );

        window.location.href =
            "login.html";

        return;

    }


    /* Check mood */

    if (!selectedMood) {

        alert(
            "Please select your mood first."
        );

        return;

    }


    const noteElement =
        document.getElementById("moodNote");


    const note =
        noteElement
            ? noteElement.value.trim()
            : "";


    try {

        const response =
            await fetch(
                "http://localhost:5000/api/moods",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        user_id: userId,

                        mood: selectedMood,

                        note: note

                    })

                }
            );


        const data =
            await response.json();


        if (response.ok) {

            alert(
                "🌿 Your mood has been saved successfully!"
            );


            selectedMood = "";


            if (noteElement) {

                noteElement.value = "";

            }


            /* Remove selected style */

            const moodButtons =
                document.querySelectorAll(".mood");


            moodButtons.forEach(function(button) {

                button.classList.remove("selected");

            });


            /* Reload mood history */

            loadMoodHistory();

        }

        else {

            alert(
                "❌ " + data.message
            );

        }

    }

    catch (error) {

        console.error(
            "Mood save error:",
            error
        );


        alert(
            "❌ Cannot connect to MindEase server."
        );

    }

}


/* =================================
   LOAD MOOD HISTORY FROM MYSQL
   ================================= */

async function loadMoodHistory() {

    const userId =
        localStorage.getItem("mindEaseUserId");


    if (!userId) {

        return;

    }


    const historyContainer =
        document.getElementById("moodHistory");


    if (!historyContainer) {

        return;

    }


    try {

        const response =
            await fetch(
                `http://localhost:5000/api/moods/${userId}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load mood history"
            );

        }


        const moods =
            await response.json();


        if (moods.length === 0) {

            historyContainer.innerHTML = `
                <p class="no-moods">
                    No mood records yet.
                </p>
            `;

            return;

        }


        historyContainer.innerHTML =
            moods.map(function(item) {

                const date =
                    new Date(
                        item.created_at
                    ).toLocaleString();


                return `

                    <div class="mood-history-item">

                        <div class="history-mood">
                            ${item.mood}
                        </div>

                        <div class="history-note">
                            ${item.note || "No note added"}
                        </div>

                        <div class="history-date">
                            ${date}
                        </div>

                    </div>

                `;

            }).join("");


    }

    catch (error) {

        console.error(
            "Mood history error:",
            error
        );


        historyContainer.innerHTML = `
            <p class="no-moods">
                Unable to load mood history.
            </p>
        `;

    }

}


/* =================================
   REGISTER
   ================================= */

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("registerName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("registerPassword")
                    .value;


            const message =
                document.getElementById(
                    "registerMessage"
                );


            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/register",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                name: name,

                                email: email,

                                password: password

                            })

                        }
                    );


                const data =
                    await response.json();


                if (response.ok) {

                    if (message) {

                        message.innerHTML =
                            "🌿 Registration successful! You can now login.";

                        message.style.color =
                            "#668f82";

                    }


                    registerForm.reset();

                }

                else {

                    if (message) {

                        message.innerHTML =
                            "❌ " + data.message;

                        message.style.color =
                            "#b56b6b";

                    }

                }

            }

            catch (error) {

                console.error(error);


                if (message) {

                    message.innerHTML =
                        "❌ Cannot connect to MindEase server.";

                    message.style.color =
                        "#b56b6b";

                }

            }

        }
    );

}


/* =================================
   LOGIN
   ================================= */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            /* ================================
               MASTER LOGIN
               ================================ */

            const masterEmail =
                "admin@mindease.com";


            const masterPassword =
                "MindEase@123";


            if (
                email === masterEmail &&
                password === masterPassword
            ) {

                loginAsMaster(message);

                return;

            }


            /* ================================
               NORMAL USER LOGIN
               ================================ */

            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                email: email,

                                password: password

                            })

                        }
                    );


                const data =
                    await response.json();


                if (response.ok) {

                    localStorage.setItem(
                        "mindEaseLoggedIn",
                        "true"
                    );


                    localStorage.setItem(
                        "mindEaseUserName",
                        data.user.name
                    );


                    localStorage.setItem(
                        "mindEaseUserId",
                        data.user.id
                    );


                    localStorage.removeItem(
                        "mindEaseMaster"
                    );


                    if (message) {

                        message.innerHTML =
                            "🌿 Login successful! Welcome "
                            + data.user.name;

                        message.style.color =
                            "#668f82";

                    }


                    setTimeout(function() {

                        window.location.href =
                            "index.html";

                    }, 1000);

                }

                else {

                    if (message) {

                        message.innerHTML =
                            "❌ " + data.message;

                        message.style.color =
                            "#b56b6b";

                    }

                }

            }

            catch (error) {

                console.error(error);


                if (message) {

                    message.innerHTML =
                        "❌ Cannot connect to MindEase server.";

                    message.style.color =
                        "#b56b6b";

                }

            }

        }
    );

}


/* =================================
   MASTER LOGIN
   ================================= */

function loginAsMaster(message) {

    localStorage.setItem(
        "mindEaseLoggedIn",
        "true"
    );


    localStorage.setItem(
        "mindEaseUserName",
        "Master"
    );


    localStorage.setItem(
        "mindEaseMaster",
        "true"
    );


    localStorage.removeItem(
        "mindEaseUserId"
    );


    if (message) {

        message.innerHTML =
            "🌿 Master login successful!";

        message.style.color =
            "#668f82";

    }


    setTimeout(function() {

        window.location.href =
            "index.html";

    }, 1000);

}


/* =================================
   DISPLAY USER NAME
   ================================= */

function displayUserName() {

    const welcomeUser =
        document.getElementById(
            "welcomeUser"
        );


    const userName =
        localStorage.getItem(
            "mindEaseUserName"
        );


    if (welcomeUser && userName) {

        welcomeUser.innerHTML =
            "Welcome, " + userName + " 🌿";

    }

}


/* =================================
   CHECK LOGIN STATUS
   ================================= */

function checkLoginStatus() {

    const loggedIn =
        localStorage.getItem(
            "mindEaseLoggedIn"
        );


    const loginLink =
        document.querySelector(
            ".login-link"
        );


    const logoutLink =
        document.querySelector(
            ".logout-link"
        );


    if (loggedIn === "true") {

        if (loginLink) {

            loginLink.style.display =
                "none";

        }


        if (logoutLink) {

            logoutLink.style.display =
                "inline-block";

        }

    }

    else {

        if (loginLink) {

            loginLink.style.display =
                "inline-block";

        }


        if (logoutLink) {

            logoutLink.style.display =
                "none";

        }

    }

}


/* =================================
   LOGOUT
   ================================= */

function logout() {

    localStorage.removeItem(
        "mindEaseLoggedIn"
    );


    localStorage.removeItem(
        "mindEaseUserName"
    );


    localStorage.removeItem(
        "mindEaseUserId"
    );


    localStorage.removeItem(
        "mindEaseMaster"
    );


    alert(
        "🌿 You have been logged out."
    );


    window.location.href =
        "login.html";

}


/* =================================
   PAGE LOAD
   ================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        displayUserName();

        checkLoginStatus();

        loadMoodHistory();

    }
);
