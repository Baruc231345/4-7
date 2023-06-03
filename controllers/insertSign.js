const express = require('express');
const multer = require('multer');
const db1 = require("../routes/rasa-db");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).fields([{ name: 'form_sign' }]);

router.post('/insertSign', upload, (req, res) => {
    const { form_sign} = req.files;

    // Access the file buffers
    const form_signBuffer = form_sign[0].buffer;

    // Save the image buffers to the database
    db1.query('INSERT INTO signature_table (form_sign) VALUES (?)', [form_signBuffer], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "Error inserting signatures" });
        } else {
            console.log("Signatures are successfully inserted");
            return res.json({
                status: "success",
                success: "Signatures are successfully inserted"
            });
        }
    });
});

module.exports = router;