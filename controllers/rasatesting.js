const db1 = require("../routes/rasa-db");

const rasatesting = async(req , res) =>{
    const {full_name, event_name, event_description, event_day, start_time, end_time } = req.body
        console.log(full_name)
        console.log(event_name)
        console.log(event_description)
        console.log(event_day)
        console.log(start_time)
        console.log(end_time)
        db1.query('INSERT INTO inputted_table SET ?' , {
            full_name : full_name,
            event_name : event_name,
            event_description : event_description,
            event_day : event_day,
            start_time : start_time,
            end_time : end_time,},
            (error, results) => {   
            if(error) throw error;
            return res.json({ status: "success", success: "Date Already Successfully Inputted" })
        })
    }

module.exports = rasatesting;