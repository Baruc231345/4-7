const db1 = require("../routes/rasa-db");

const rasatesting = async(req , res) =>{
    const {full_name, event_name, event_description, event_day, start_time, end_time } = req.body
        console.log(full_name)
        console.log(event_name)
        console.log(event_description)
        console.log(event_day)
        console.log(start_time)
        console.log(end_time)
        db1.query('INSERT INTO inputted_table SET ?', {
            full_name: full_name,
            event_name: event_name,
            event_description: event_description,
            event_day: event_day,
            start_time: start_time,
            end_time: end_time,
            rasa_status: "Pending"
          }, (error, results) => {
            if (error) {
              console.error(error);
              // Handle the error appropriately
            } else {
              console.log(results + "rasatesting.js"); // Check the entire results object
              const insertedId = results.insertId; // Retrieve the generated ID
              console.log(insertedId); // Verify the generated ID
              return res.json({
                status: "success",
                id: insertedId,
                success: "Date Already Successfully Inputted"
              });
            }
          });
    }

module.exports = rasatesting;