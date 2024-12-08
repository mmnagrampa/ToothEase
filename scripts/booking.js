import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/+esm';

const supabaseUrl = 'https://ucspfnzhoepaxvpigvfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjc3Bmbnpob2VwYXh2cGlndmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MzU4MDcsImV4cCI6MjA0ODIxMTgwN30.iw7m3PDLJByvFGZTXsmbEDPxkP28_RYkNh9egJ5BXY4';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to populate the clinics dropdown
async function populateClinicsDropdown() {
    const clinicsDropdown = document.getElementById("clinics");

    // Clear previous options before adding new ones
    clinicsDropdown.innerHTML = '';

    // Add default "Select a clinic" option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a clinic';
    clinicsDropdown.appendChild(defaultOption);

    try {
        // Get clinics from Supabase database
        const { data, error } = await supabase.from('clinics').select('id, name');
        if (error) {
            console.error('Error fetching clinics:', error);
            return;
        }

        // Debug: Log fetched clinic data
        console.log('Clinics data:', data);

        if (data && data.length > 0) {
            // Populate dropdown with clinics
            data.forEach((clinic) => {
                const option = document.createElement("option");
                option.value = clinic.id;
                option.textContent = clinic.name;
                clinicsDropdown.appendChild(option);
            });
        } else {
            // If no clinics, show a message
            const option = document.createElement('option');
            option.textContent = 'No clinics available';
            clinicsDropdown.appendChild(option);
        }
    } catch (error) {
        console.error('Error fetching clinics:', error);
    }
}

// Function to populate the services dropdown
function populateServicesDropdown(services) {
    const servicesDropdown = document.getElementById("services");
    servicesDropdown.innerHTML = ''; // Clear previous options

    // Add default "Select a service" option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a service';
    servicesDropdown.appendChild(defaultOption);

    // Check if services are available
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

// Event listener for clinic selection change
document.getElementById("clinics").addEventListener("change", async function () {
    const selectedClinicId = this.value;
    const servicesDropdown = document.getElementById("services");
    const timeDropdown = document.getElementById("appointment-time");

    // Clear previous options
    servicesDropdown.innerHTML = ''; 
    timeDropdown.innerHTML = ''; 

    // Add default options
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
            // Fetch clinic services and schedule from Supabase
            const { data, error } = await supabase
                .from('clinics')
                .select('services, schedule') // Fetch services and schedule data
                .eq('id', selectedClinicId)
                .single();

            if (error) {
                console.error('Error fetching clinic details:', error);
            } else {
                console.log('Clinic services and schedule data:', data);

                // Populate services dropdown
                populateServicesDropdown(data.services);

                // Check if a date is already selected
                const selectedDate = document.getElementById("appointment-date").value;
                if (selectedDate) {
                    populateTimeSlots(data.schedule); // Populate time slots if a date is selected
                }

                // Update the calendar with closed days
                updateCalendarWithClosedDays(data.schedule);
            }
        } catch (error) {
            console.error('Error fetching clinic details:', error);
        }
    } else {
        // Clear dropdowns if no clinic selected
        populateServicesDropdown([]);
    }
});

// Event listener for date selection change
document.getElementById("appointment-date").addEventListener("change", async function () {
    const selectedDate = this.value;
    const selectedClinicId = document.getElementById("clinics").value;

    if (!selectedDate) {
        console.error("No date selected");
        return;
    }

    if (selectedClinicId) {
        try {
            // Fetch clinic schedule from Supabase
            const { data, error } = await supabase
                .from('clinics')
                .select('schedule') // Fetch only schedule data
                .eq('id', selectedClinicId)
                .single();

            if (error) {
                console.error('Error fetching clinic schedule:', error);
            } else {
                console.log('Clinic schedule:', data.schedule);
                populateTimeSlots(data.schedule); // Populate time slots
            }
        } catch (error) {
            console.error('Error fetching clinic schedule:', error);
        }
    }
});

// Function to populate time slots for the selected date
function populateTimeSlots(schedule) {
    const selectedDate = document.getElementById("appointment-date").value;

    if (!selectedDate) {
        console.error("No date selected");
        return;
    }

    const timeDropdown = document.getElementById("appointment-time");
    timeDropdown.innerHTML = ''; // Clear previous time slots

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

// Convert "09:30" to decimal hours (e.g., 9.5)
function parseTime(timeString) {
    const [hour, minute] = timeString.split(':').map(Number);
    return hour + minute / 60; // Convert to decimal hours
}

// Convert decimal hours (e.g., 9.5) to "09:30"
function formatTime(hour) {
    const hours = Math.floor(hour);
    const minutes = Math.round((hour - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Function to update the calendar with closed days
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
        minDate: "today", // Disable past dates
        dateFormat: "Y-m-d", // Format the date
        disable: [
            function (date) {
                return closedDayNumbers.includes(date.getDay());
            }
        ],
        onDayCreate: function (dObj, dStr, fp, dayElem) {
            const date = dayElem.dateObj;
            if (closedDayNumbers.includes(date.getDay())) {
                dayElem.title = "Clinic is closed on this day";
                dayElem.classList.add("flatpickr-closed-day");  // Add class for styling
            }
        }
    });
}

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
    populateClinicsDropdown();  // Populate clinics on page load

    // Initialize Flatpickr calendar
    flatpickr("#appointment-date", {
        minDate: "today", // Disable past dates
        dateFormat: "Y-m-d", // Format the date
    });
});

// Function to handle appointment submission
document.getElementById("submit-appointment").addEventListener("click", async function () {
    const clinicId = document.getElementById("clinics").value;
    const service = document.getElementById("services").value;
    const appointmentDate = document.getElementById("appointment-date").value;
    const appointmentTime = document.getElementById("appointment-time").value;
    const userId = 'user-uuid-here'; // You will need to get the logged-in user's UUID

    // Validate required fields
    if (!clinicId || !service || !appointmentDate || !appointmentTime || !userId) {
        alert("Please fill out all fields.");
        return;
    }

    // Create appointment data object
    const appointmentData = {
        clinic_id: clinicId,  // Clinic ID
        user_id: userId,      // User ID (you may fetch this dynamically from a session)
        service: service,     // Selected service
        appointment_date: appointmentDate, // Selected appointment date
        appointment_time: appointmentTime, // Selected appointment time
        status: 'pending',    // Default status for new appointments
    };

    try {
        // Insert the appointment into the Supabase database
        const { data, error } = await supabase
            .from('appointments')
            .insert([appointmentData]);

        if (error) {
            console.error('Error inserting appointment:', error);
            alert('Failed to book the appointment. Please try again.');
        } else {
            console.log('Appointment booked:', data);
            alert('Appointment successfully booked!');
            // Optionally reset the form or update the UI here
        }
    } catch (error) {
        console.error('Error submitting appointment:', error);
        alert('An error occurred. Please try again.');
    }
});
