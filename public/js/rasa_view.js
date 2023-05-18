const tableBody = document.getElementById("data-body");

fetch("/api/rasa_view")
  .then(response => response.json())
  .then(data => {
    console.log(data)
    data.forEach(entry => {
      const row = document.createElement("tr");
      const fullNameCell = document.createElement("td");
      const eventNameCell = document.createElement("td");
      const eventDescriptionCell = document.createElement("td");
      const eventDayCell = document.createElement("td");
      const startTimeCell = document.createElement("td");
      const endTimeCell = document.createElement("td");
      
      fullNameCell.textContent = entry.full_name;
      eventNameCell.textContent = entry.event_name;
      eventDescriptionCell.textContent = entry.event_description;
      eventDayCell.textContent = entry.event_day;
      startTimeCell.textContent = entry.start_time;
      endTimeCell.textContent = entry.end_time;
      
      row.appendChild(fullNameCell);
      row.appendChild(eventNameCell);
      row.appendChild(eventDescriptionCell);
      row.appendChild(eventDayCell);
      row.appendChild(startTimeCell);
      row.appendChild(endTimeCell);
      
      tableBody.appendChild(row);
    });
  })
  .catch(error => console.error(error));

  function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12

    minutes = minutes < 10 ? '0' + minutes : minutes;

    return hours + ':' + minutes + ' ' + ampm;
  }