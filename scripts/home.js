const images = [
    {
        url: './pics/dental-aesthetics.jpg',
        label: 'Dental Aesthetics Center',
        status: 'Open / Closed',
        title: 'Dental Aesthetics Center',
        monday: '12:00 PM - 4:00 PM',
        tuesday: '12:00 PM - 4:00 PM',
        wednesday: '12:00 PM - 4:00 PM',
        thursday: '12:00 PM - 4:00 PM',
        friday: '12:00 PM - 4:00 PM',
        saturday: 'CLOSED',
        sunday: 'CLOSED',
    },
    {
        url: './pics/city-smiles.jpg',
        label: 'City Smiles Dental Clinic',
        status: 'Open / Closed',
        title: 'City Smiles Dental Clinic',
        monday: '12:00 PM - 4:00 PM',
        tuesday: '12:00 PM - 4:00 PM',
        wednesday: '12:00 PM - 4:00 PM',
        thursday: '12:00 PM - 4:00 PM',
        friday: '12:00 PM - 4:00 PM',
        saturday: 'CLOSED',
        sunday: 'CLOSED',
    },
    {
        url: './pics/respall-dental.jpg',
        label: 'Respall Dental Clinic',
        status: 'Open / Closed',
        title: 'Respall Dental Clinic',
        monday: '12:00 PM - 4:00 PM',
        tuesday: '12:00 PM - 4:00 PM',
        wednesday: '12:00 PM - 4:00 PM',
        thursday: '12:00 PM - 4:00 PM',
        friday: '12:00 PM - 4:00 PM',
        saturday: 'CLOSED',
        sunday: 'CLOSED',
    }
];

// Get the container where images will be displayed
const imageContainer = document.getElementById('image-container');

// Get the modal elements
const modal = document.getElementById('myModal');
const modalImg = document.getElementById('modal-image');
const modalStatus = document.getElementById('open-close');
const modalLocation = document.getElementById('location');
const modalDesc = document.getElementById('modal-description');
const modalTitle = document.getElementById('modal-title');
const closeBtn = document.querySelector('.close');

// Days
const mondayTime = document.getElementById('Monday');
const tuesdayTime = document.getElementById('Tuesday');
const wednesdayTime = document.getElementById('Wednesday');
const thursdayTime = document.getElementById('Thursday');
const fridayTime = document.getElementById('Friday');
const saturdayTime = document.getElementById('Saturday');
const sundayTime = document.getElementById('Sunday');

// Loop through the array and create image elements within styled boxes
images.forEach(image => {
    const div = document.createElement('div'); // Create a div for the image box
    div.className = 'image-box'; // Add class for styling

    const img = document.createElement('img'); // Create an image element 
    img.src = image.url; // Set the image source


    // When an image is clicked, open the modal
    img.addEventListener('click', () => {
        modal.style.display = 'flex'; // Show the modal
        modalImg.src = image.url; // Set the modal image source
        modalStatus.textContent = image.status; // Set status of clinic
        mondayTime.textContent = image.monday; // Schedule for monday
        tuesdayTime.textContent = image.tuesday; // Schedule for tuesday
        wednesdayTime.textContent = image.wednesday; // Schedule for wednesday
        thursdayTime.textContent = image.thursday; // Schedule for thursday
        fridayTime.textContent = image.friday; // Schedule for friday
        saturdayTime.textContent = image.saturday; // Schedule for saturday
        sundayTime.textContent = image.sunday; // Schedule for sunday
        modalTitle.textContent = image.title; // Set title
        modalLocation.textContent = image.location; // Set the location of clinic
        modalDesc.textContent = image.description; // Set the description of clinic
    });

    const label = document.createElement('label'); // Create a label element
    label.textContent = image.label; // Set the label text to the image label
    label.className = 'image-label'; // Add class for label styling

    div.appendChild(img); // Append the image to the box
    div.appendChild(label); // Append the label below the image
    imageContainer.appendChild(div); // Append the box to the container
});

// Close the modal when the 'X' is clicked
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close the modal if the user clicks outside the modal content
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});