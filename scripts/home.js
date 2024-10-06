const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const today = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" });
const currentDay = new Date(today).getDay();
const currentTime = new Date(today).getHours() * 60 + new Date(today).getMinutes(); // Time in minutes

//Schedules for 3 different clinics
const clinicSchedules = {
    "clinic1": {
        name: "Dental Aesthetics Center",
        image: "../img/dental-aesthetics.jpg",
        schedule: {
            "Monday": { open: "12:00", close: "16:00" },
            "Tuesday": { open: "12:00", close: "16:00" },
            "Wednesday": { open: "12:00", close: "16:00" },
            "Thursday": { open: "12:00", close: "16:00" },
            "Friday": { open: "12:00", close: "16:00" },
            "Saturday": { open: "CLOSED", close: "CLOSED" },
            "Sunday": { open: "CLOSED", close: "CLOSED" }
        },
        dentists: ["Dr. Leigh Belga"],
        services: {
            firstColumn: [
                "Oral Prophylaxis", 
                "Fluoride Treatment", 
                "Composite Restorations",
                "Dental Sealants", 
                "Extraction", 
                "Root Canal Therapy"
            ],
            secondColumn: [
                "Orthodontic Treatment", 
                "Veneers", 
                "Retainers", 
                "Dentures"
            ]
        },
        location: "<a href='https://maps.app.goo.gl/xVNJ1jWNHyJF5mqQ9'>Door 8, NEA Building, Central<br> Business District II, Triangulo, Naga City</a>",
        facebook: "<a href='https://www.facebook.com/DentalAestheticsCenter'>Dental Aesthetics Center by Dr. Leigh Belga</a>",
        email: "dentalaestheticscenter@yahoo.com"
    },
    "clinic2": {
        name: "City Smiles Dental Clinic", 
        image: "../img/city-smiles.jpg",
        schedule: {
            "Monday": { open: "09:00", close: "18:00" },
            "Tuesday": { open: "09:00", close: "18:00" },
            "Wednesday": { open: "CLOSED", close: "CLOSED" },
            "Thursday": { open: "09:00", close: "18:00" },
            "Friday": { open: "09:00", close: "18:00" },
            "Saturday": { open: "09:00", close: "18:00" },
            "Sunday": { open: "09:00", close: "17:00" }
        },
        dentists: ["Dr. Irish", "Dr. Viel"],
        services: {
            firstColumn: [
                "Dental Consultation", 
                "Oral Prophylaxis", 
                "Tooth Restoration",
                "Tooth Extraction", 
                "Oral Surgery", 
                "Orthodontics",
                "Cosmetic Dentistry"
            ],
            secondColumn: [
                "Laser Teeth Whitening", 
                "Prosthodontics", 
                "Pediatric Dentistry",
                "Root Canal Therapy",
                "Dental x-ray"
            ]
        },
        location: "<a href='https://maps.app.goo.gl/oBK9Z2dka5jrDufk7'>GF 1-C Red Corner Residences<br> Dayangdang St. , Naga City</a>",
        facebook: "<a href='https://www.facebook.com/citysmilesdentalclinic.naga'>City Smiles Dental Clinic - Naga City</a>",
        email: "citysmilesdentalclinic.naga@gmail.com"
    },
    "clinic3": {
        name: "Respall Dental Clinic", 
        image: "../img/respall-dental.jpg",
        schedule: {
            "Monday": { open: "09:00", close: "18:00" },
            "Tuesday": { open: "09:00", close: "18:00" },
            "Wednesday": { open: "09:00", close: "18:00" },
            "Thursday": { open: "09:00", close: "18:00" },
            "Friday": { open: "09:00", close: "18:00" },
            "Saturday": { open: "09:00", close: "18:00" },
            "Sunday": { open: "09:00", close: "17:00" }
        },
        dentists: ["Dr. Alfonso Jesus Respall"],
        services: {
            firstColumn: [
                "Teeth cleaning", 
                "Stain removal", 
                "Tooth restoration",
                "Pits and fissure sealants", 
                "Fluoride treatment", 
                "Veneers",
                "Laser teeth whitening",
                "Dentures"
            ],
            secondColumn: [
                "Crowns", 
                "Fixed bridge", 
                "Orthodontic treatment",
                "Wisdom tooth removal",
                "Tooth extraction",
                "Root canal treatment",
                "Periapical x-ray"
            ]
        },
        location: "<a href='https://maps.app.goo.gl/FdPaeGhGy587he3z9'>Magsaysay Ave, Naga City</a>",
        facebook: "<a href='https://www.facebook.com/profile.php?id=100068696123145'>Respall Dental Clinic - Naga </a>",
        email: "respalldental.naga@gmail.com"
    }
};

// Function to convert 24-hour time to 12-hour format
function convertTo12HourFormat(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12; // Convert 0 (midnight) or 12 (noon) to 12 in 12-hour format
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Function to display schedule for each clinic
function displaySchedule(clinic) {
    const schedule = clinicSchedules[clinic].schedule;
    const scheduleContainer = document.getElementById('schedule');
    const statusContainer = document.getElementById('status');
    const dentistsContainer = document.getElementById('dentists');
    const servicesContainer = document.getElementById('services');
    const locationContainer = document.getElementById('location');
    const facebookContainer = document.getElementById('facebook');
    const emailContainer = document.getElementById('email');
    const clinicImage = document.getElementById('clinic-image');

    let isOpen = false;

    scheduleContainer.innerHTML = ""; // Clear previous content

    daysOfWeek.forEach((day, index) => {
        const daySchedule = schedule[day];
        const openTime = daySchedule.open !== "CLOSED" ? convertToMinutes(daySchedule.open) : null;
        const closeTime = daySchedule.close !== "CLOSED" ? convertToMinutes(daySchedule.close) : null;

        let isOpenNow = false;
        if (openTime !== null && closeTime !== null) {
            isOpenNow = currentTime >= openTime && currentTime <= closeTime && currentDay === index;
        }

        if (isOpenNow) isOpen = true;

        //Check if it's the current day then highlight
        const dayClass = currentDay === index ? 'highlight-day' : '';

        //Highlight time if it's the current day
        const timeClass = (currentDay === index && openTime !== null && closeTime !== null && currentTime >= openTime && currentTime <= closeTime) ? 'highlight-time' : '';

        scheduleContainer.innerHTML += `
            <div class="day ${dayClass}">
                <span>${day}</span>
                <span class="${timeClass}">
                    ${daySchedule.open === "CLOSED" ? 'Closed' : `${convertTo12HourFormat(daySchedule.open)} - ${convertTo12HourFormat(daySchedule.close)}`}
                </span>
            </div>
        `;
    });

    // Set clinic name and image
    document.getElementById('clinic-name').innerText = clinicSchedules[clinic].name; // Updated to use the name property
    clinicImage.src = clinicSchedules[clinic].image;

    // Status
    statusContainer.innerHTML = `<div class="status ${isOpen ? 'open' : 'closed-status'}">
        ${isOpen ? 'OPEN NOW' : 'CLOSED'}
    </div>`;

    // Display other information
    dentistsContainer.innerHTML = `<strong>Dentists:</strong><ul>${clinicSchedules[clinic].dentists.map(dentist => `<li>${dentist}</li>`).join('')}</ul>`;
    servicesContainer.innerHTML = `
        <strong>Services:</strong>
        <div class="services">
            <div class="column">
                <ul>
                    ${clinicSchedules[clinic].services.firstColumn.map(service => `<li>${service}</li>`).join('')}
                </ul>
            </div>
            <div class="column">
                <ul>
                    ${clinicSchedules[clinic].services.secondColumn.map(service => `<li>${service}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    locationContainer.innerHTML = `<i class="fa-solid fa-location-dot" style="color: #ff0000;"></i> ${clinicSchedules[clinic].location}`;
    facebookContainer.innerHTML = `<i class="fa-brands fa-facebook" style="color: #005eff;"></i> ${clinicSchedules[clinic].facebook}`;
    emailContainer.innerHTML = `<i class="fa-regular fa-envelope" style="color: #000000;"></i> ${clinicSchedules[clinic].email}`;
}

// Helper function to convert time to minutes
function convertToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

function showModal(clinic) {
    displaySchedule(clinic); // Call to display the schedule of the selected clinic
    document.getElementById('modal').style.display = 'flex'; // Display the modal
}

function closeModal() {
    document.getElementById('modal').style.display = 'none'; // Hide the modal
}

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
