const express = require("express");
const app = express();
const loggedIn = require("../controllers/loggedin");
const login = require("../controllers/login");
const logout = require("../controllers/logout");
const newreg = require("../controllers/newreg");
const db = require("../routes/db-config");
const router = express.Router();
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

/*
const checkPending = (req, res, next) => {
  const email = req.body.email; // assuming email is in the request body
  const pending = req.body.pending; // assuming 'pending' is a boolean column in your table
  console.log(email);
  console.log(pending)
  db.query(
    "SELECT * FROM user WHERE email = ? AND pending = ?",
    [email, pending],
    (err, result) => {
      if (err) throw err;
      if (!result.length) {
        return res.json({
          status: "error",
          error: "Your account is still pending",
        });
      } else {
        next();
      }
    }
  )
};
*/

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

router.get("/login", loggedIn, adminMiddleware, (req , res) => {
  res.sendFile("login.html", {root: "./public"});
})

router.get("/loginnew", (req , res) => {
    res.sendFile("loginnew.html", {root: "./public"});
})

router.get("/editUserView", (req , res) => {
  res.sendFile("editUserView.html", {root: "./public"});
})

router.get("/rasa", (req , res) => {
    res.sendFile("rasa.html", {root: "./public"});
})

router.get("/login", (req , res) => {
    res.sendFile("login.html", {root: "./public/"});
})

router.get("/dashboardAdmin", loggedIn, dashboardAccessMiddleware, (req, res) => {
  res.sendFile("dashboard_admin.html", { root: "./public/" });
});

router.get("/dashboardRegular", loggedIn, dashboardAccessMiddleware, (req, res) => {
  res.sendFile("dashboard_regular.html", { root: "./public/" });
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

router.get("/submitrasa", (req , res) => {
  const storedData = localStorage.getItem('myData');
  const data = JSON.parse(storedData);
  res.render("submitrasa", data);
});

router.get("/verification1", async(req, res)=>{
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

router.get("/verification", async (req, res) => {
  const nodemailer = require('nodemailer');
  const html = `
  <h1>Number 3 Test</h1>
  <a href="http://localhost:3005/accesorRegular&status=approved" style="background-color: green; color: white; padding: 10px; text-decoration: none;">Approve</a>
`;
  const path = require('path');
  const fs = require('fs');

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
      to: 'leynessherwin@gmail.com',
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
    console.log(html);
    // Delete the generated PDF file after sending the email
    //fs.unlinkSync(pdfPath);
  }

  main()
    .catch(e => console.log(e));
});


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
  const rasaID = req.params.id;
  const url = `http://localhost:3005/ejsrasa/${rasaID}`;

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: "load"});
    const pdfBuffer = await page.pdf();
    fs.writeFileSync(`rasa_${rasaID}.pdf`, pdfBuffer);
    await browser.close();

    const pdfFileName = `rasa_${rasaID}.pdf`;
    const sql = "UPDATE rasa_database.inputted_table SET pdf = ? WHERE id = ?";
    db.query(sql, [pdfFileName, rasaID], function(error, result){
      if (error) {
        console.error(error);
        res.status(500).send('An error occurred while updating the table');
      } else {
        console.log(`PDF generated and saved for rasaID ${rasaID}`);
        res.download(pdfFileName);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while generating PDF');
  }
});

router.get('/open-pdf/:id', (req, res) => {
  const rasaID = req.params.id;
  const { open } = require('open');
  open(`rasa_${rasaID}.pdf`);
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



router.get("/logout", logout);
router.get("/newreg", newreg);
module.exports = router;
