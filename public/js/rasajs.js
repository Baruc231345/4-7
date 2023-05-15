const form = document.querySelector("form"),
        nextBtn = form.querySelector(".nextBtn"),
        nextBtn2 = form.querySelector(".nextBtn2"),
        backBtn = form.querySelector(".backBtn"),
        nextBtn3 = form.querySelector(".nextBtn3"),
        backBtn2 = form.querySelector(".backBtn2"),
        allInput = form.querySelectorAll(".first input");


document.addEventListener('DOMContentLoaded', () => {
  const positionLabel = document.querySelector('#position label').textContent;
  const inputFieldValues = Array.from(document.querySelectorAll('.input-field2 input')).map(input => input.value);
  const myButton = document.querySelector('#noneBtn');

  myButton.addEventListener('click', myFunction);

  function myFunction() {
    console.log(`Position Label: ${positionLabel}`);
    console.log(`Input Field Values: ${inputFieldValues}`);
  }
});
  

//////////////////-------------------------------------
const start_date1 = document.getElementById("start_date");
const end_date1 = document.getElementById("end_date");

const full_name1 = document.getElementById("full_name");
const event_name1 = document.getElementById("event_name");
const event_day1 = document.getElementById("event_day");
const start_time1 = document.getElementById("start_time");
const end_time1 = document.getElementById("end_time");
const event_description1 = document.getElementById("event_description");

/*

form.addEventListener("submit", () => {
  const start_time = start_time1.value;
  const end_time = end_time1.value;
  const full_name = full_name1.value;
  const event_name= event_name1.value
  const event_description = event_description1.value;
  const event_day = event_day1.value;

  // Create an object to store the start and end times
  const data = {
    start_time: start_time,
    end_time: end_time,
    full_name: full_name,
    event_name: event_name,
    event_description: event_description,
    event_day: event_day

  };

  // Serialize the data object to a JSON string
  const data_serialized = JSON.stringify(data);

  // Store the serialized data in localStorage
  localStorage.setItem('myData', data_serialized);

  // Redirect to another page
  window.location.href = "/submitRasa";
});
*/

form.addEventListener("submit", () => {
  var startTime = document.getElementById("start_time").value;
  var endTime = document.getElementById("end_time").value;
  if (endTime < startTime) {
    alert("End time cannot be earlier than start time");
  } else {    
    const rasatesting = {
      full_name: full_name1.value,
      event_name: event_name1.value,
      event_description: event_description1.value,
      event_day: event_day1.value,
      start_time: startTime,
      end_time: endTime,
    };  
    console.log(rasatesting);
    fetch("/api/rasa", {
      method: "POST",
      body: JSON.stringify(rasatesting),
      headers: {
        "Content-type": "application/json"
      }   
    })
    .then(response => response.json())
    .then(data => {
      // Assuming the response data contains the generated id
      const id = data.id;
      window.location.href = `/ejsrasa/${data.id}`;
    })
    .catch(error => {
      console.error(error);
      // Handle error here
    });
  }
});

const checkbox = document.getElementById('myRadioId-6');
const startTimeInput = document.getElementById('start-time');
const endTimeInput = document.getElementById('end-time');

checkbox.addEventListener('change', function() {
  if (this.checked) {
    startTimeInput.disabled = false;
    endTimeInput.disabled = false;
  } else {
    startTimeInput.disabled = true;
    endTimeInput.disabled = true;
  }
});

checkbox.addEventListener('change', function() {
  if (!this.checked) {
    startTimeInput.value = '';
    endTimeInput.value = '';
  }
});

function toggleOtherInput(checkbox) {
  var otherInput = document.getElementById("otherInput");
  otherInput.disabled = !checkbox.checked;
}
