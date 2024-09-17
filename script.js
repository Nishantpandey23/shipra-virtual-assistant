let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;
    text_speak.lang = "en-GB";
    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    let day = new Date();
    let hours = day.getHours();
    if (hours >= 0 && hours < 12) {
        speak("Good Morning Sir");
    } else if (hours >= 12 && hours < 16) {
        speak("Good Afternoon Sir");
    } else {
        speak("Good Evening Sir");
    }
}

window.addEventListener('load', () => {
    wishMe();
});

let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition(); // Object creation
recognition.onresult = (event) => {
    let currentIndex = event.resultIndex;
    let transcript = event.results[currentIndex][0].transcript;
    content.innerText = transcript; // Display the message
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener("click", () => {
    recognition.start();
    btn.style.display = "none";
    setTimeout(() => {
        btn.style.display = "block";
    }, 1000); // Slight delay to re-enable the button
});

function takeCommand(message) {
    // Remove 'shipra' or 'shifra' from the command if mentioned
    message = message.replace(/shipra|shifra/gi, "").trim();

    btn.style.display = "flex";
    setTimeout(() => {
        btn.style.display = "none";
    }, 1000); // Hide the button after executing

    // Basic greeting
    if (message.includes("hello") || message.includes("hey")) {
        speak("Hello sir, what can I help you with?");
    }
    // Who are you
    else if (message.includes("who are you")) {
        speak("I am your virtual assistant, created by Nishant sir");
    }
    // Open YouTube
    else if (message.includes("open youtube")) {
        speak("Opening YouTube...");
        window.open("https://www.youtube.com/");
    }
    // Open Google
    else if (message.includes("open google")) {
        speak("Opening Google...");
        window.open("https://www.google.com/");
    }
    // Open Facebook
    else if (message.includes("open facebook")) {
        speak("Opening Facebook...");
        window.open("https://www.facebook.com/");
    }
    // Open Instagram
    else if (message.includes("open instagram")) {
        speak("Opening Instagram...");
        window.open("https://www.instagram.com/");
    }
    // Open Calculator
    else if (message.includes("open calculator")) {
        speak("Opening calculator...");
        window.open("calculator://");
    }
    // Check Time
    else if (message.includes("time")) {
        let now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // The hour '0' should be '12'
        let time = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
        speak(`The time is ${time}`);
    }
    // Check Date
    else if (message.includes("date")) {
        let now = new Date();
        let day = now.getDate();
        let month = now.toLocaleString('default', { month: 'long' });
        let year = now.getFullYear();
        let fullDate = `${day} ${month} ${year}`;
        speak(`Today's date is ${fullDate}`);
    }
    // **New Feature: Weather Information**
    else if (message.includes("weather")) {
        let city = "New Delhi"; // Default city, can be dynamic
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY`)
            .then(response => response.json())
            .then(data => {
                let weather = data.weather[0].description;
                let temp = Math.round(data.main.temp - 273.15); // Kelvin to Celsius
                speak(`The weather in ${city} is currently ${weather} with a temperature of ${temp} degrees Celsius`);
            })
            .catch(() => {
                speak("Sorry, I couldn't fetch the weather details right now.");
            });
    }
    // **New Feature: Set Reminder**
    else if (message.includes("remind me in")) {
        let time = message.match(/\d+/)[0]; // Extract time from the message
        let unit = message.includes("minute") ? "minutes" : "seconds";
        
        let milliseconds = unit === "minutes" ? time * 60 * 1000 : time * 1000;

        speak(`Okay, I will remind you in ${time} ${unit}`);
        setTimeout(() => {
            speak("Here is your reminder!");
        }, milliseconds);
    }
    // **New Feature: Tell a Joke**
    else if (message.includes("tell me a joke")) {
        let jokes = [
            "Why don't scientists trust atoms? Because they make up everything!",
            "Why did the computer go to the doctor? It had a virus!",
            "I would tell you a construction joke, but I’m still working on it."
        ];
        let randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        speak(randomJoke);
    }
    // Default: Search on Google
    else {
        speak(`This is what I found on the internet for ${message}`);
        window.open(`https://www.google.com/search?q=${message}`);
    }
}
