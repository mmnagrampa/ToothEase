import supabase from './nav-auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    const appointmentsContainer = document.querySelector('.book-appointment');

    try {
        // Get the current logged-in user using `getUser`
        const { data: user, error: userError } = await supabase.auth.getUser();

        if (userError) {
            console.error('Error fetching user:', userError);
            displayMessage('Error fetching user data. Please try again.');
            return;
        }

        if (!user) {
            // If no user is logged in, show a message or redirect to login
            displayMessage('Please log in to view your appointments.');
            return;
        }

        // Fetch appointments for the specific user with clinic name
        const { data: appointments, error } = await supabase
            .from('appointments')
            .select(`
                *,
                clinics!appointments_clinic_id_fkey(name)
            `)
            .eq('user_id', user.id)  // Filter by the user's ID
            .order('appointment_date', { ascending: true });

        if (error) {
            console.error('Error fetching appointments:', error);
            displayMessage('Error loading appointments. Please try again.');
            return;
        }

        if (!appointments || appointments.length === 0) {
            // Show 'No Booked Appointments' message if no appointments are found
            const noBookElement = document.querySelector('.no-book');
            noBookElement.style.display = 'block';
            return;
        }

        // Hide the 'No Booked Appointments' message
        const noBookElement = document.querySelector('.no-book');
        noBookElement.style.display = 'none';

        // Generate HTML for appointments
        const appointmentsHtml = appointments.map(appointment => {
            const formattedTime = formatTime(appointment.appointment_time);
            const clinicName = appointment.clinics?.name || 'Unknown Clinic';
            return `
                <div class="appointment-card">
                    <h3>Service: ${appointment.service}</h3>
                    <p><strong>Clinic:</strong> ${clinicName}</p>
                    <p><strong>Date:</strong> ${appointment.appointment_date}</p>
                    <p><strong>Time:</strong> ${formattedTime}</p>
                    <p><strong>Status:</strong> ${appointment.status}</p>
                    <hr>
                </div>
            `;
        }).join('');

        // Append appointments to the container
        const appointmentsList = document.createElement('div');
        appointmentsList.className = 'appointments-list';
        appointmentsList.innerHTML = appointmentsHtml;
        appointmentsContainer.appendChild(appointmentsList);

    } catch (error) {
        console.error('Unexpected error:', error);
        displayMessage('An unexpected error occurred. Please try again.');
    }
});

// Utility function to display popup messages
function displayMessage(message) {
    const popupOverlay = document.getElementById('popup-overlay');
    const popupBox = document.getElementById('popup-box');
    const popupMessage = document.getElementById('popup-message');

    popupMessage.textContent = message;
    popupOverlay.style.display = 'block';
    popupBox.style.display = 'block';

    setTimeout(() => {
        popupOverlay.style.display = 'none';
        popupBox.style.display = 'none';
    }, 3000);
}

// Utility function to format time in 24-hour format with seconds
function formatTime(time) {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
