const express = require("express");
const app = express();
const loggedIn = require("../controllers/loggedin");
const login = require("../controllers/login");
const logout = require("../controllers/logout");
const newreg = require("../controllers/newreg");
const db = require("../routes/db-config");
const path = require('path');
const fs = require('fs');
const router = express.Router();
const multer = require('multer');
const db1 = require("../routes/rasa-db");


const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).fields([{ name: 'form_sign' }]);

router.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));

console.log(__dirname)

router.get("/", loggedIn, (req, res, next) => {
    if (req.user) {      
      const status = "loggedIn";
      res.render("index", { status: status, user: req.user });
      console.log(status);
    } else {
      const status = "Status is not logged in. Log in first";
      res.render("index", { status: status, user: "nothing" });
      console.log(status);
    }
  });

  // Middleware to restrict access to /dashboard if not logged in
const dashboardAccessMiddleware = (req, res, next) => {
  if (req.user) {
    return next();
  } else {
    res.redirect("/");
  }
};

const adminMiddleware = (req, res, next) => {
  const userId = req.user.id;
  db.query("SELECT * FROM user WHERE id = ?", [userId], (err, results) => {
    if (err) throw err;

    const user = results[0];
    if (user.role === "admin") {
      return next();
    } else {
      console.log("You're not Admin!")
      res.clearCookie("userRegistered");
      res.redirect("/");
    }
  }); 
};

router.get("/login", (req , res) => {
  res.sendFile("login.html", {root: "./public/"});
})

router.get("/dashboardAdmin", loggedIn, adminMiddleware, (req, res) => {
res.sendFile("dashboard_admin.html", { root: "./public/" });
});

router.get("/dashboardRegular", loggedIn, dashboardAccessMiddleware, (req, res) => {
//const id = req.query.id;
res.sendFile("dashboard_regular.html", { root: "./public/" });
});

router.get("/login", loggedIn, adminMiddleware, (req , res) => {
  res.sendFile("login.html", {root: "./public"});
})

router.get("/editUserView", (req , res) => {
  res.sendFile("editUserView.html", {root: "./public"});
})


router.get("/rasa", (req , res) => {
    res.sendFile("rasa.html", {root: "./public"});
})


router.get("/dashboardRegular/:id", loggedIn, dashboardAccessMiddleware, (req, res) => {
  res.render("dashboard_regular.html", { root: "./public/" });
});


router.get("/newregister", (req , res) => {
    res.sendFile("newregister.html", {root: "./public/"});
})

router.get("/userview",loggedIn, dashboardAccessMiddleware, (req, res) => {
    var query = "SELECT * FROM user ORDER BY id DESC";
    db.query(query, function(error, data){
        if (error){
            throw error
        }
        else{
            res.render('user-view', {title: 'Node.js MySQL CRUD Application', action:'list', sampleData: data})
        }
    })
})

router.get("/rasaview", (req, res) => {
  var query = "SELECT * FROM rasa_database.inputted_table ORDER BY id";
  db.query(query, function(error, data){
      if (error){
          throw error
      }
      else{
          res.render('rasa_view', {title: 'Node.js MySQL CRUD Application', action:'list', sampleData: data})
      }
  })
})


router.get("/calendar", loggedIn, dashboardAccessMiddleware,(req , res) => {
    res.sendFile("calendar.html", {root: "./public/"});
})

router.get("/accesorAdmin",loggedIn, dashboardAccessMiddleware, (req , res) => {
    res.sendFile("accesor_admin.html", {root: "./public/"});
})

router.get("/accesorRegular",loggedIn, dashboardAccessMiddleware, (req , res) => {
  res.sendFile("accesor_regular.html", {root: "./public/"});
})

router.get("/pdfrasa", async (req, res) => {
  const puppeteer = require('puppeteer');
  const fs = require('fs');
  console.log("Clicked");
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    const url = "http://localhost:3005/submitRasa"
    await page.goto(url, {waitUntil: "load"});
    const pdfBuffer = await page.pdf();
    fs.writeFileSync('example.pdf', pdfBuffer);
    await page.pdf({path: "page.pdf", width:"100px"});
    await browser.close();
    res.send('PDF generated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while generating PDF');
  }

  const { exec } = require('child_process');
exec('start example.pdf', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});
});

router.get("/editUserView/:id", (req, res) => {
  const userId = req.params.id;
  console.log(userId);
  
  const query = "SELECT * FROM user WHERE id = ?";
  db.query(query, [userId], function(error, data){
    if (error){
      throw error;
    } else {
      if (data.length > 0) {
        const user = data[0];
        res.locals.userId = userId;
        res.render("editUserView1", { user: user });
      } else {
        res.status(404).send("Rasa form is not found");
      }
    }
  });
});

router.get('/ejsrasa/:id', (req,res) => {
  const rasaID = req.params.id;
  console.log(rasaID);
  const query = "SELECT * FROM rasa_database.temporary_inputted_table WHERE id = ?";
  db.query(query, [rasaID], function(error, data){
    if (error){
      throw error;
    } else {
      if (data.length > 0) {
        const inputted_table = data[0];
        res.locals.rasaID = rasaID;
        res.render("submitrasa", { inputted_table: inputted_table });
      } else {
        res.status(404).send("Rasa not found");
      }
    }
  });
});

router.get('/ejsrasa_copy/:id', (req,res) => {
  const rasaID = req.params.id;
  console.log(rasaID);
  const query = "SELECT * FROM rasa_database.inputted_table WHERE id = ?";
  db.query(query, [rasaID], function(error, data){
    if (error){
      throw error;
    } else {
      if (data.length > 0) {
        const inputted_table = data[0];
        res.locals.rasaID = rasaID;
        res.render("submitrasa", { inputted_table: inputted_table });
      } else {
        res.status(404).send("Rasa not found");
      }
    }
  });
});


router.get('/pdf/:id', async (req, res) => {
  const puppeteer = require('puppeteer');
  const fs = require('fs');
  const path = require('path');
  const rasaID = req.params.id;
  const url = `http://localhost:3005/ejsrasa_copy/${rasaID}`;

  // Check if the ID exists in the database
  const sql = 'SELECT * FROM rasa_database.inputted_table WHERE id = ?';
  db.query(sql, [rasaID], async (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send('An error occurred while checking the ID in the database');
    }
    if (!result.length) {
      return res.status(404).send('The provided ID does not exist');
    }

    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'load' });
      const pdfBuffer = await page.pdf();
      await browser.close();

      const pdfFileName = `rasa_${rasaID}.pdf`;
      const filePath = path.join('C:', 'Users', 'Mig', '4-7', 'pdf-folders', pdfFileName);

      // Delete the existing PDF file if it exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Write the new PDF file
      fs.writeFileSync(filePath, pdfBuffer);

      const updateSql = 'UPDATE rasa_database.inputted_table SET pdf = ? WHERE id = ?';
      db.query(updateSql, [pdfFileName, rasaID], function (error, result) {
        if (error) {
          console.error(error);
          res.status(500).send('An error occurred while updating the table');
        } else {
          console.log(`PDF successfully generated and saved in pdf-folders. RasaId = ${rasaID}`);
          res.download(filePath);
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while generating PDF');
    }
  });
});

router.get("/delete_rasa_request/:id", async (req, res) => {
    const rasaID = req.params.id;
  
    try {
      const selectSql = 'SELECT * FROM rasa_database.inputted_table WHERE id = ?';
      db.query(selectSql, [rasaID], function (error, result) {
        if (error) {
          console.error(error);
          return res.status(500).send('An error occurred while fetching the data to be deleted');
        }
        if (!result.length) {
          return res.status(404).send('The provided ID does not exist in the inputted_table');
        }
        const data = result[0];
        const insertSql = 'INSERT INTO rasa_database.archieved_inputted_table (rasa_id, full_name, event_day, event_name, event_description, start_time, end_time, rasa_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(
          insertSql,
          [data.id, data.full_name, data.event_day, data.event_name, data.event_description, data.start_time, data.end_time, data.rasa_status],
          function (error, result) {
            if (error) {
              console.error(error);
              return res.status(500).send('An error occurred while transferring the data to the archieve_inputted_table');
            }
            const deleteSql = 'DELETE FROM rasa_database.inputted_table WHERE id = ?';
            db.query(deleteSql, [rasaID], function (error, result) {
              if (error) {
                console.error(error);
                return res.status(500).send('An error occurred while deleting the data from the inputted_table');
              }
  
              res.status(200).send('Data successfully deleted from inputted_table and transferred to archieve_inputted_table');
            });
          }
        );
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while processing the request');
    }
  });
/*
router.get('/pdf/:id', async (req, res) => {
  const puppeteer = require('puppeteer');
  const fs = require('fs');
  const rasaID = req.params.id;
  const url = `http://localhost:3005/ejsrasa/${rasaID}`;

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load' });
    const pdfBuffer = await page.pdf();
    await browser.close();

    const pdfFileName = `rasa_${rasaID}.pdf`;
    const filePath = path.join('C:', 'Users', 'Mig', '4-7', 'pdf-folders', pdfFileName);
    fs.writeFileSync(filePath, pdfBuffer);

    const sql = 'UPDATE rasa_database.inputted_table SET pdf = ? WHERE id = ?';
    db.query(sql, [pdfFileName, rasaID], function (error, result) {
      if (error) {
        console.error(error);
        res.status(500).send('An error occurred while updating the table');
      } else {
        console.log(`PDF sucessfully generated and save on pdf-folders. RasaId = ${rasaID}`);
        res.download(filePath);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while generating PDF');
  }
}); 
*/

router.get('/pdf1/:id', async (req, res) => {
  const puppeteer = require('puppeteer');
  const fs = require('fs');
  const rasaID = req.params.id;
  const url = `http://localhost:3005/ejsrasa/${rasaID}`;

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load' });
    const pdfBuffer = await page.pdf();
    await browser.close();

    const pdfFileName = `rasa_${rasaID}.pdf`;
    const filePath = path.join('C:', 'Users', 'Mig', '4-7', 'pdf-folders', pdfFileName);
    fs.writeFileSync(filePath, pdfBuffer);

    const sql = "UPDATE rasa_database.inputted_table SET pdf = ? WHERE id = ?";
    db.query(sql, [pdfFileName, rasaID], function(error, result){
      if (error) {
        console.error(error);
        res.status(500).send('An error occurred while updating the table');
      } else {
        console.log(`PDF successfully generated and saved in pdf-folders. RasaId = ${rasaID}`);
        res.download(filePath);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while generating PDF');
  }
});

router.get('/open-pdf/:id', (req, res) => {
  const rasaID = req.params.id;
  const { exec } = require('child_process');
  const path = require('path');
  const pdfFileName = `rasa_${rasaID}.pdf`;
  const filePath = path.join('C:', 'Users', 'Mig', '4-7', 'pdf-folders', pdfFileName);

  // Command to open the PDF file with the default PDF viewer
  const command = process.platform === 'win32' ? `start ${filePath}` : `open ${filePath}`;

  exec(command, (error) => {
    if (error) {
      console.error(error);
      return res.status(500).send('An error occurred while opening the PDF');
    }

    console.log(`PDF successfully opened. RasaId = ${rasaID}`);
    res.status(200).send('PDF opened successfully');
  });
});

router.put('/approve/:id', (req, res) => {
  console.log("redirect");
  const userId = req.params.id;

  db.query(
    'UPDATE user SET pending = 0 WHERE id = ?',
    [userId],
    (error, results) => {
      if (error) {
        return res.json({
          status: 'error',
          error: 'Error approving user'
        });
      }
      return res.json({
        status: 'success',
        success: 'User approved successfully'
      });
    }
  );
});

router.get("/rasa_view",(req , res) => {
  res.sendFile("rasa_view.html", {root: "./public/"});
})

router.get("/trash", async(req, res)=>{
  const nodemailer = require('nodemailer');
  const html = `
  <h1>This is content</h1>
  <a href="http://localhost:3005/accesorRegular&status=approved" style="background-color: green; color: white; padding: 10px; text-decoration: none;">Approve</a>
`;
  async function main(){
    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: 'chat@outlook.com',
        pass: 'cha!'
      }
    });

    const info = await transporter.sendMail({
      from: 'Me Brrt Haha <chat@outlook.com>',
      to: 'kaqkyfltfsxdamwmdo@bbitj.com',
      subject: 'Testing, testing 123',
      html:html, 
    })

    console.log("Message Sent: " + info.messageId);
  }
  main()
  .catch(e => console.log(e));
});

/*
// Verification 1
router.get("/verification/:id", async (req, res) => {  
  const id = req.params.id;
  const nodemailer = require('nodemailer');
  const html = `
  <h1>Rasa for Approval Email</h1>http://localhost:3005/rasaview
  <a href="http://localhost:3005/verification" style="background-color: green; color: white; padding: 10px; text-decoration: none;">Approve</a>
`;

  async function main() {
    // Generate the PDF and save it to a file
    const pdfPath = path.join(__dirname, 'rasa_327.pdf');
    // Generate the PDF using your preferred method and save it to the 'pdfPath' location

    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: 'processtest1@outlook.com',
        pass: 'Capstone1!'
      }
    });

    const info = await transporter.sendMail({
      from: 'Me Test Haha <processtest1@outlook.com>',
      to: 'nekins213@gmail.com',
      subject: 'Testing, testing 123',
      html: html,
      attachments: [
        { 
          filename: 'generated.pdf',
          path: pdfPath,
        }
      ]
    });

    console.log("Message Sent: " + info.messageId);
    // Delete the generated PDF file after sending the email
    //fs.unlinkSync(pdfPath);
  }

  main()
    .catch(e => console.log(e));
});

*/

router.get("/verification/:id", async (req, res) => {
  const id = req.params.id;
  const nodemailer = require('nodemailer');
  const path = require('path');
  const fs = require('fs');
  const email = "nekins213@gmail.com";
  const pdfFileName = `rasa_${id}.pdf`;
  const filePath = path.join('C:', 'Users', 'Mig', '4-7', 'pdf-folders', pdfFileName);

  const html = `
    <h1>Rasa for Approval Email</h1>
    <a href="http://localhost:3005/getSignature/${id}" style="background-color: green; color: white; padding: 10px; text-decoration: none;">Approve</a>
  `;

  try {
    const updateSql = 'UPDATE rasa_database.inputted_table SET rasa_status = ? WHERE id = ?';
    db.query(updateSql, [`waiting for approval of ${email}`, id], (error, result) => {
      if (error) {
        console.error(error);
        const updateErrorSql = 'UPDATE rasa_database.inputted_table SET rasa_status = ? WHERE id = ?';
        db.query(updateErrorSql, [`Error 500: Sending Rasa to Email is Failed`, id], (error) => {
          if (error) {
            console.error(error);
            return res.status(500).send('An error occurred while updating rasa_status');
          }
          return res.status(500).send('An error occurred while sending email. rasa_status updated to Error 500: Sending Rasa to Email is Failed');
        });
      } else {
        console.log("rasa_status updated to " + "waiting for email of " + email + " for ID: " + id);
        if (!fs.existsSync(filePath)) {
          console.log(`PDF file not found for ID: ${id}`);
          return res.status(404).send('PDF file not found');
        }

        const transporter = nodemailer.createTransport({
          service: 'hotmail',
          auth: {
            user: 'processtest1@outlook.com',
            pass: 'Capstone1!'
          }
        });

        transporter.sendMail({
          from: 'Miguel Baruc <processtest1@outlook.com>',
          to: email,
          subject: 'First Signature:',
          html: html,
          attachments: [
            {
              filename: `Rasa_File_${id}.pdf`,
              path: filePath,
            }
          ]
        }, (error, info) => {
          if (error) {
            console.error(error);
            return res.status(500).send('An error occurred while sending the email');
          }
          console.log("Message Sent: " + info.messageId);

          setTimeout(() => {
            res.redirect('/rasaview');
          }, 5000); // Delay the redirection by 5 seconds
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while updating rasa_status and sending email');
  }
});

router.get("/verification2/:id", async (req, res) => {
  const id = req.params.id;
  const nodemailer = require('nodemailer');
  const path = require('path');
  const fs = require('fs');
  const email = "miguelbaruc12@gmail.com";

  const html = `
    <h1>Rasa for Approval Email</h1>
    <a href="http://localhost:3005/getSignature2/${id}" style="background-color: green; color: white; padding: 10px; text-decoration: none;">Approve</a>
  `;

  try {
    const updateSql = 'UPDATE rasa_database.inputted_table SET rasa_status = ? WHERE id = ?';
    db.query(updateSql, [`This is signature 2: Sending email to ${email}`, id], (error, result) => {
      if (error) {
        console.error(error);
        const updateErrorSql = 'UPDATE rasa_database.inputted_table SET rasa_status = ? WHERE id = ?';
        db.query(updateErrorSql, [`Signature 2 - Error 500: Sending Rasa to Email is Failed`, id], (error) => {
          if (error) {
            console.error(error);
            return res.status(500).send('An error occurred while updating rasa_status');
          } return res.status(500).send('An error occurred while sending email. rasa_status updated to Error 500: Sending Rasa to Email is Failed');
        });
      } else {
      console.log("This is Signature 2: rasa_status updated to " + "waiting for email of " + email + " for ID: " + id);
      const pdfFileName = `rasa_${id}.pdf`;
      const filePath = path.join('C:', 'Users', 'Mig', '4-7', 'pdf-folders', pdfFileName);

      // Check if the PDF file exists
      if (!fs.existsSync(filePath)) {
        console.log(`PDF file not found for ID: ${id}`);
        return res.status(404).send('PDF file not found');
      }

      const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user: 'processtest1@outlook.com',
          pass: 'Capstone1!'
        }
      });

      transporter.sendMail({
        from: 'Miguel Baruc: Second Signature <processtest1@outlook.com>',
        to: email,
        subject: 'Second Signature:',
        html: html,
        attachments: [
          {
            filename: `Rasa_File_${id}.pdf`,
            path: filePath,
          }
        ]
      }, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).send('An error occurred while sending the email');
        }
        console.log("Message Sent: " + info.messageId);
        res.status(200).send('Email sent successfully and rasa_status updated');
        res.redirect(`/getSignature2/${id}`);
      });
    }
      });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while updating rasa_status and sending email');
  }
});

router.get("/insertSign" , async (req, res)=>{
  res.sendFile("insertSign.html", {root: "./public/"});
})

router.get('/getSignature/:id', (req, res) => {
  const rasaID = req.params.id;
  console.log(rasaID);
  const updateQuery = "UPDATE rasa_database.inputted_table SET form_sign = (SELECT form_sign FROM rasa_database.signature_table WHERE id = 7) WHERE id = ?";

  db.query(updateQuery, [rasaID], function(error, result) {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error updating form_sign" });
    } else {
      console.log("form_sign updated successfully");

      const updateSql = 'UPDATE rasa_database.inputted_table SET rasa_status = ? WHERE id = ?';
      db.query(updateSql, [`First Signature Approved: waiting for approval of miguelbaruc12@gmail.com`, rasaID], (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).send('An error occurred while updating rasa_status');
        } else {
          console.log("rasa_status updated to First Signature Approved: waiting for approval of miguelbaruc12@gmail.com");
          const selectQuery = "SELECT * FROM rasa_database.inputted_table WHERE id = ?";
          db.query(selectQuery, [rasaID], function(error, data) {
            if (error) {
              throw error;
            } else {
              if (data.length > 0) {
                const inputted_table = data[0];
                res.locals.rasaID = rasaID;
                res.render("submitrasa", { inputted_table: inputted_table });
              } else {
                res.status(404).send("Rasa not found");
              }
            }
          });
        }
      });
    }
  });
});

router.get('/getSignature2/:id', (req, res) => {
  const rasaID = req.params.id;
  console.log(rasaID);
  const updateQuery = "UPDATE rasa_database.inputted_table SET form_sign2 = (SELECT form_sign FROM rasa_database.signature_table WHERE id = 9) WHERE id = ?";

  db.query(updateQuery, [rasaID], function(error, result) {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error updating form_sign" });
    } else {
      console.log("form_sign2 updated successfully");
      const selectQuery = "SELECT * FROM rasa_database.inputted_table WHERE id = ?";
      db.query(selectQuery, [rasaID], function(error, data) {
        if (error) {
          throw error;
        } else {
          if (data.length > 0) {
            const inputted_table = data[0];
            res.locals.rasaID = rasaID;
            res.render("submitrasa", { inputted_table: inputted_table });
          } else {
            res.status(404).send("Rasa not found");
          }
        }
      });
    }
  });
});

router.get("/logout", logout);
router.get("/newreg", newreg);
module.exports = router;
