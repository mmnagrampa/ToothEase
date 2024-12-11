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

        const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('is_admin')
            .eq('user_id', userId)
            .single();

        if (profileError) {
            console.error('Error fetching user profile:', profileError);
            displayMessage('Error fetching user profile. Please try again.');
            return;
        }

        const isAdmin = userProfile?.is_admin || false;

        const currentDate = new Date().toISOString().split('T')[0]; // Get today's date

        const appointmentsQuery = supabase
            .from('appointments')
            .select(`
                *,
                clinics!appointments_clinic_id_fkey(name)
                ${isAdmin ? ', users!appointments_user_id_fkey(name)' : ''}`
            )
            .order('created_at', { ascending: false });

        if (isAdmin) {
            // Show both booked and archived appointments for admin
            appointmentsQuery.gte('appointment_date', currentDate); // Filter out past appointments
        } else {
            // For regular users, show only their booked appointments
            appointmentsQuery.eq('user_id', userId)
                .gte('appointment_date', currentDate); // Filter out past appointments
        }

        const { data: appointments, error } = await appointmentsQuery;

        if (error) {
            console.error('Error fetching appointments:', error.message);
            displayMessage(`Error loading appointments: ${error.message}`);
            return;
        }

        if (!appointments || appointments.length === 0) {
            const noBookElement = document.querySelector('.no-book');
            noBookElement.style.display = 'block';
            return;
        }

        const noBookElement = document.querySelector('.no-book');
        noBookElement.style.display = 'none';

        renderAppointments(appointments, isAdmin);

    } catch (error) {
        console.error('Unexpected error:', error);
        displayMessage('An unexpected error occurred. Please try again.');
    }
});

function renderAppointments(appointments, isAdmin) {
    const appointmentsContainer = document.querySelector('.book-appointment');
    appointmentsContainer.innerHTML = ''; // Clear previous content

    const appointmentsHtml = appointments.map(appointment => {
        const formattedTime = formatTime(appointment.appointment_time);
        const clinicName = appointment.clinics?.name || 'Unknown Clinic';
        const clientName = isAdmin ? `<p><strong>Client:</strong> ${appointment.users?.name || 'Unknown Client'}</p>` : '';
        const isArchived = new Date(appointment.appointment_date) < new Date(); // Check if the appointment is in the past
        const editButtonHtml = isAdmin && !isArchived ? `
            <button class="edit" data-id="${appointment.appointment_id}" style="display: none;">Edit</button>
        ` : '';
        
        // Set the font color based on the status
        let statusColor = '';
        switch (appointment.status) {
            case 'Confirmed':
                statusColor = 'green';
                break;
            case 'Cancelled':
                statusColor = 'red';
                break;
            case 'Pending Confirmation':
                statusColor = 'yellow';
                break;
            default:
                statusColor = 'black'; // Default color for unknown status
        }

        return `
            <div class="appointment-card" data-id="${appointment.appointment_id}">
                <h3>Service: ${appointment.service}</h3>
                ${clientName}
                <p><strong>Clinic:</strong> ${clinicName}</p>
                <p><strong>Date:</strong> ${appointment.appointment_date}</p>
                <p><strong>Time:</strong> ${formattedTime}</p>
                <p><strong>Status:</strong> <span class="appointment-status" style="color: ${statusColor};">${appointment.status}</span></p>
                ${isAdmin ? `
                    <div class="approval-buttons">
                        <button class="approve" data-id="${appointment.appointment_id}">Approve</button>
                        <button class="reject" data-id="${appointment.appointment_id}">Reject</button>
                    </div>
                    ${editButtonHtml}
                ` : ''}
                <hr>
            </div>
        `;
    }).join('');

    const appointmentsList = document.createElement('div');
    appointmentsList.className = 'appointments-list';
    appointmentsList.innerHTML = appointmentsHtml;
    appointmentsContainer.appendChild(appointmentsList);

    if (isAdmin) {
        document.querySelectorAll('.approve').forEach(button => {
            button.addEventListener('click', async (e) => {
                const appointmentId = e.target.dataset.id;
                await updateAppointmentStatus(appointmentId, 'Confirmed');
            });
        });

        document.querySelectorAll('.reject').forEach(button => {
            button.addEventListener('click', async (e) => {
                const appointmentId = e.target.dataset.id;
                await updateAppointmentStatus(appointmentId, 'Cancelled');
            });
        });

        document.querySelectorAll('.edit').forEach(button => {
            button.addEventListener('click', (e) => {
                const appointmentId = e.target.dataset.id;
                console.log(`Editing appointment ${appointmentId}`);
                const appointmentCard = document.querySelector(`.appointment-card[data-id="${appointmentId}"]`);
                const approvalButtons = appointmentCard.querySelector('.approval-buttons');
                const editButton = appointmentCard.querySelector('.edit');
                
                // Hide the Edit button and show the approval buttons
                if (editButton) editButton.style.display = 'none';
                if (approvalButtons) approvalButtons.style.display = 'block';
            });
        });
    }

}

async function updateAppointmentStatus(appointmentId, status) {
    try {
        const { error } = await supabase
            .from('appointments')
            .update({ status })
            .eq('appointment_id', appointmentId);

        if (error) {
            console.error('Error updating appointment status:', error.message);
            return;
        }

        // Update the UI without reloading
        const appointmentCard = document.querySelector(`.appointment-card[data-id="${appointmentId}"]`);
        const statusElement = appointmentCard.querySelector('.appointment-status');
        statusElement.textContent = status;

        // Change the color of the status based on the value
        changeStatusColor(statusElement, status);

        // Hide approval buttons and show the edit button after updating status
        const approvalButtons = appointmentCard.querySelector('.approval-buttons');
        if (approvalButtons) approvalButtons.style.display = 'none';

        // Show the "Edit" button
        const editButton = appointmentCard.querySelector('.edit');
        if (editButton) editButton.style.display = 'block';

    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

function changeStatusColor(statusElement, status) {
    switch (status) {
        case 'Confirmed':
            statusElement.style.color = 'green';
            break;
        case 'Cancelled':
            statusElement.style.color = 'red';
            break;
        case 'Pending Confirmation':
            statusElement.style.color = 'yellow';
            break;
        default:
            statusElement.style.color = 'black';
            break;
    }
}

function formatTime(time) {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

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
    }, 5000);
}
