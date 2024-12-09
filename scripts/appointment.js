import supabase from './nav-auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    const appointmentsContainer = document.querySelector('.book-appointment');

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
            console.error('Error fetching user:', userError);
            displayMessage('Error fetching user data. Please try again.');
            return;
        }

        if (!user) {
            displayMessage('Please log in to view your appointments.');
            return;
        }

        const userId = user.id;

        // Check if the logged-in user is an admin
        const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('is_admin')
            .eq('user_id', userId) // Use user_id here
            .single();

        if (profileError) {
            console.error('Error fetching user profile:', profileError);
            displayMessage('Error fetching user profile. Please try again.');
            return;
        }

        const isAdmin = userProfile?.is_admin || false;

        if (isAdmin) {
            // Admin can see all appointments
            const { data: appointments, error } = await supabase
                .from('appointments')
                .select(`
                    *,
                    clinics!appointments_clinic_id_fkey(name)
                `)
                .order('appointment_date', { ascending: true });

            if (error) {
                console.error('Error fetching appointments:', error.message);
                displayMessage(`Error loading appointments: ${error.message}`);
                return;
            }

            // If no appointments exist for admin
            if (!appointments || appointments.length === 0) {
                const noBookElement = document.querySelector('.no-book');
                noBookElement.style.display = 'block';
                return;
            }

            const noBookElement = document.querySelector('.no-book');
            noBookElement.style.display = 'none';

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
                        <div class="approval-buttons">
                            <button class="approve" data-id="${appointment.appointment_id}">Approve</button>
                            <button class="reject" data-id="${appointment.appointment_id}">Reject</button>
                        </div>
                        <hr>
                    </div>
                `;
            }).join('');

            const appointmentsList = document.createElement('div');
            appointmentsList.className = 'appointments-list';
            appointmentsList.innerHTML = appointmentsHtml;
            appointmentsContainer.appendChild(appointmentsList);

            // Add event listeners for approve/reject buttons
            document.querySelectorAll('.approve').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const appointmentId = e.target.dataset.id;
                    await updateAppointmentStatus(appointmentId, 'confirmed');
                });
            });

            document.querySelectorAll('.reject').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const appointmentId = e.target.dataset.id;
                    await updateAppointmentStatus(appointmentId, 'cancelled');
                });
            });
        } else {
            // Normal users only see their own appointments
            const { data: appointments, error } = await supabase
                .from('appointments')
                .select(`
                    *,
                    clinics!appointments_clinic_id_fkey(name)
                `)
                .eq('user_id', userId) // Only fetch appointments for the logged-in user
                .order('appointment_date', { ascending: true });

            if (error) {
                console.error('Error fetching appointments:', error.message);
                displayMessage(`Error loading appointments: ${error.message}`);
                return;
            }

            // If no appointments exist for the user
            if (!appointments || appointments.length === 0) {
                const noBookElement = document.querySelector('.no-book');
                noBookElement.style.display = 'block';
                return;
            }

            const noBookElement = document.querySelector('.no-book');
            noBookElement.style.display = 'none';

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

            const appointmentsList = document.createElement('div');
            appointmentsList.className = 'appointments-list';
            appointmentsList.innerHTML = appointmentsHtml;
            appointmentsContainer.appendChild(appointmentsList);
        }

    } catch (error) {
        console.error('Unexpected error:', error);
        displayMessage('An unexpected error occurred. Please try again.');
    }
});

// Function to update the appointment status
async function updateAppointmentStatus(appointmentId, status) {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .update({ status })
            .eq('appointment_id', appointmentId);

        if (error) {
            console.error('Error updating appointment status:', error.message);
            displayMessage('Failed to update the appointment status. Please try again.');
            return;
        }

        displayMessage(`Appointment ${status} successfully!`);
        window.location.reload(); // Reload to show updated status
    } catch (error) {
        console.error('Unexpected error:', error);
        displayMessage('An unexpected error occurred while updating the appointment status.');
    }
}

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
