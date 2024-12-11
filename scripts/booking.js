import supabase from './nav-auth.js';

function showMessagePopup(message, redirectUrl = null) {
    const overlay = document.getElementById('popup-overlay');
    const popupBox = document.getElementById('popup-box');
    const popupMessage = document.getElementById('popup-message');

    popupMessage.textContent = message;
    overlay.style.display = 'block';
    popupBox.style.display = 'block';

    setTimeout(() => {
        overlay.style.display = 'none';
        popupBox.style.display = 'none';
        if (redirectUrl) {
            window.location.href = redirectUrl; 
        }
    }, 3000);
}

async function populateClinicsDropdown() {
    const clinicsDropdown = document.getElementById("clinics");
    clinicsDropdown.innerHTML = ''; 
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a clinic';
    clinicsDropdown.appendChild(defaultOption);

    try {
        const { data, error } = await supabase.from('clinics').select('clinic_id, name');
        if (error) {
            console.error('Error fetching clinics:', error);
            showMessagePopup('Error fetching clinics. Please try again.');
            return;
        }

        if (data && data.length > 0) {
            data.forEach((clinic) => {
                const option = document.createElement("option");
                option.value = clinic.clinic_id;
                option.textContent = clinic.name;
                clinicsDropdown.appendChild(option);
            });
        } else {
            const option = document.createElement('option');
            option.textContent = 'No clinics available';
            clinicsDropdown.appendChild(option);
        }
    } catch (error) {
        console.error('Error fetching clinics:', error);
        showMessagePopup('Error fetching clinics. Please try again.');
    }
}

function populateServicesDropdown(services) {
    const servicesDropdown = document.getElementById("services");
    servicesDropdown.innerHTML = ''; 

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a service';
    servicesDropdown.appendChild(defaultOption);

    if (services && services.length > 0) {
        services.forEach(service => {
            const option = document.createElement('option');
            option.value = service;
            option.textContent = service;
            servicesDropdown.appendChild(option);
        });
    } else {
        const option = document.createElement('option');
        option.textContent = "No services available";
        servicesDropdown.appendChild(option);
    }
}

document.getElementById("clinics").addEventListener("change", async function () {
    const selectedClinicId = this.value;
    const servicesDropdown = document.getElementById("services");
    const timeDropdown = document.getElementById("appointment-time");
    servicesDropdown.innerHTML = ''; 
    timeDropdown.innerHTML = ''; 

    const defaultServiceOption = document.createElement('option');
    defaultServiceOption.value = '';
    defaultServiceOption.textContent = 'Select a service';
    servicesDropdown.appendChild(defaultServiceOption);

    const defaultTimeOption = document.createElement('option');
    defaultTimeOption.value = '';
    defaultTimeOption.textContent = 'Select a time';
    timeDropdown.appendChild(defaultTimeOption);

    if (selectedClinicId) {
        try {
            const { data, error } = await supabase
                .from('clinics')
                .select('services, schedule')
                .eq('clinic_id', selectedClinicId)
                .single();

            if (error) {
                console.error('Error fetching clinic details:', error);
                showMessagePopup('Error fetching clinic details. Please try again.');
                return;
            }

            populateServicesDropdown(data.services);

            const selectedDate = document.getElementById("appointment-date").value;
            if (selectedDate) {
                populateTimeSlots(data.schedule); 
            }

            updateCalendarWithClosedDays(data.schedule);
        } catch (error) {
            console.error('Error fetching clinic details:', error);
            showMessagePopup('Error fetching clinic details. Please try again.');
        }
    } else {
        populateServicesDropdown([]);
    }
});

document.getElementById("appointment-date").addEventListener("change", async function () {
    const selectedDate = this.value;
    const selectedClinicId = document.getElementById("clinics").value;

    if (!selectedDate) {
        console.error("No date selected");
        return;
    }

    if (selectedClinicId) {
        try {
            const { data, error } = await supabase
                .from('clinics')
                .select('schedule')
                .eq('clinic_id', selectedClinicId)
                .single();

            if (error) {
                console.error('Error fetching clinic schedule:', error);
                return;
            }

            populateTimeSlots(data.schedule);
        } catch (error) {
            console.error('Error fetching clinic schedule:', error);
        }
    }
});

function populateTimeSlots(schedule) {
    const selectedDate = document.getElementById("appointment-date").value;
    if (!selectedDate) {
        console.error("No date selected");
        return;
    }

    const timeDropdown = document.getElementById("appointment-time");
    timeDropdown.innerHTML = ''; 

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a time';
    timeDropdown.appendChild(defaultOption);

    const dateObj = new Date(selectedDate);
    const dayOfWeek = dateObj.toLocaleString('en-us', { weekday: 'long' });

    if (schedule[dayOfWeek] && schedule[dayOfWeek].open !== "CLOSED") {
        const { open, close } = schedule[dayOfWeek];
        const startTime = parseTime(open);
        const endTime = parseTime(close);

        for (let hour = startTime; hour < endTime; hour++) {
            const option = document.createElement('option');
            const formattedTime = formatTime(hour);
            option.value = formattedTime;
            option.textContent = formattedTime;
            timeDropdown.appendChild(option);
        }
    } else {
        const option = document.createElement('option');
        option.textContent = "No available time slots";
        timeDropdown.appendChild(option);
    }
}

function parseTime(timeString) {
    const [hour, minute] = timeString.split(':').map(Number);
    return hour + minute / 60;
}

function formatTime(hour) {
    const hours = Math.floor(hour);
    const minutes = Math.round((hour - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function updateCalendarWithClosedDays(schedule) {
    const closedDays = [];
    Object.keys(schedule).forEach(day => {
        if (schedule[day].open === "CLOSED") {
            closedDays.push(day);
        }
    });

    const dayMap = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6
    };

    const closedDayNumbers = closedDays.map(day => dayMap[day]);

    flatpickr("#appointment-date", {
        minDate: "today", 
        dateFormat: "Y-m-d",
        disable: [
            function (date) {
                return closedDayNumbers.includes(date.getDay());
            }
        ],
        onDayCreate: function (dObj, dStr, fp, dayElem) {
            const date = dayElem.dateObj;
            if (closedDayNumbers.includes(date.getDay())) {
                dayElem.title = "Clinic is closed on this day";
                dayElem.classList.add("flatpickr-closed-day");
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    populateClinicsDropdown();  

    flatpickr("#appointment-date", {
        minDate: "today", 
        dateFormat: "Y-m-d", 
    });
});

document.getElementById("submit-appointment").addEventListener("click", async function (event) {
    event.preventDefault(); 

    const clinicId = document.getElementById("clinics").value;
    const service = document.getElementById("services").value;
    const appointmentDate = document.getElementById("appointment-date").value;
    const appointmentTime = document.getElementById("appointment-time").value;

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
        console.error("Error fetching user:", userError.message);
        alert("Failed to fetch the logged-in user. Please log in again.");
        return;
    }

    const userId = user?.id || null;

    if (!userId) {
        alert("User not authenticated. Please log in.");
        return;
    }

    if (!clinicId || !service || !appointmentDate || !appointmentTime) {
        alert("Please fill out all fields.");
        return;
    }

    const appointmentData = {
        clinic_id: clinicId,
        user_id: userId,
        service: service,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        status: 'Pending Confirmation',
    };

    console.log('Payload for appointment:', appointmentData);

    try {
        const { data, error } = await supabase.from('appointments').insert([appointmentData]);

        if (error) {
            console.error('Error inserting appointment:', error);
            showMessagePopup('Failed to book the appointment. Please try again.');
        } else {
            console.log('Appointment booked successfully:', data);
            showMessagePopup('Appointment successfully booked!', 'appointment.html');
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        showMessagePopup('An unexpected error occurred. Please try again.');
    }
});
