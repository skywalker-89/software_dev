const sendEmail = require("../utils/sendEmail");

exports.sendEmail = async (req, res) => {
  try {
    const {
      recipientEmail,
      firstName,
      lastName,
      location,
      dateTime,
      type,
      senderEmail,
    } = req.body;

    let confirmLink = `http://localhost:1111/email/confirm-schedule?recipientEmail=${encodeURIComponent(
      recipientEmail
    )}&senderEmail=${encodeURIComponent(
      senderEmail
    )}&location=${encodeURIComponent(location)}&dateTime=${encodeURIComponent(
      dateTime
    )}`;

    let subject = "Lost Item Claim Request";
    let message = `Hello,\n\n${firstName} ${lastName} wants to claim the lost item.\nPickup Details:\nLocation: ${location}\nTime: ${dateTime}.\n\nPlease reach out to arrange the handover.`;

    // HTML version with chat link button
    let htmlMessage = `
      <p>Hello,</p>
      <p>${firstName} ${lastName} wants to claim the lost item.</p>
      <p><strong>Pickup Details:</strong><br>
      Location: ${location}<br>
      Time: ${dateTime}</p>
      <p>Rearrange the time and place.</p>
      <p><a href="http://localhost:3000/chat" style="
          background-color: #2563EB;
          color: white !important;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          display: inline-block;
        ">Chat with them now</a></p>
      <br>
      <p>Confirm the time and place.</p>
      <p><a href="${confirmLink}" style="
          background-color: #7ED321;
          color: white !important;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          display: inline-block;
        ">I'm ok with the time and place.</a></p>
        <script>
    function confirmSchedule() {
      fetch('${confirmLink}', {
        method: 'GET'
      })
      .then(response => response.text())
      .then(data => {
        alert('✅ Confirmation sent successfully');
      })
      .catch(error => {
        alert('❌ Failed to send confirmation');
        console.error('Error:', error);
      });
    }
  </script>
    `;

    console.log(confirmLink);

    await sendEmail(recipientEmail, subject, message, htmlMessage);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error });
  }
};

exports.sendEmailPic = async (req, res) => {
  try {
    const {
      recipientEmail,
      firstName,
      lastName,
      location,
      dateTime,
      senderEmail,
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    let attachments = req.files.map((file) => ({
      filename: file.originalname,
      content: file.buffer,
    }));

    let confirmLink = `http://localhost:1111/email/confirm-schedule?recipientEmail=${encodeURIComponent(
      recipientEmail
    )}&senderEmail=${encodeURIComponent(
      senderEmail
    )}&location=${encodeURIComponent(location)}&dateTime=${encodeURIComponent(
      dateTime
    )}`;

    let subject = "Lost Item Return Request";
    let message = `Hello,\n\n${firstName} ${lastName} wants to return your lost item.\nPickup Details:\nLocation: ${location}\nTime: ${dateTime}.\n\nAttached are the images of the item.\n\nPlease reach out to arrange the handover.`;

    // HTML version with chat link button
    let htmlMessage = `
      <p>Hello,</p>
      <p>${firstName} ${lastName} wants to return your lost item.</p>
      <p><strong>Pickup Details:</strong><br>
      Location: ${location}<br>
      Time: ${dateTime}</p>

      <br>
      <p>Rearrange the time and place.</p>
      <p><a href="http://localhost:3000/chat" style="
          background-color: #2563EB;
          color: white !important;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          display: inline-block;
        ">Chat with them now</a></p>
      <p>Confirm the time and place.</p>
      <p><a href="${confirmLink}" style="
          background-color: #7ED321;
          color: white !important;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          display: inline-block;
        ">I'm ok with the time and place.</a></p>
      <p>This is not my item</p>
      <p><a href="http://localhost:3000/chat" style="
          background-color: #EF4444;
          color: white !important;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          display: inline-block;
        ">This is not my item</a></p>
    `;

    console.log(confirmLink);

    await sendEmail(recipientEmail, subject, message, htmlMessage, attachments);
    res.status(200).json({ message: "Email with images sent successfully" });
  } catch (error) {
    console.error("❌ Error sending email with images:", error);
    res
      .status(500)
      .json({ message: "Failed to send email with images", error });
  }
};

exports.confirmSchedule = async (req, res) => {
  try {
    const { recipientEmail, senderEmail, location, dateTime } = req.query;

    if (!recipientEmail || !senderEmail || !location || !dateTime) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    let subject = "Pickup Time and Location Confirmed";
    let message = `Hello,\n\nThe time and place for the item pickup have been confirmed.\n\nScheduled Details:\nLocation: ${location}\nTime: ${dateTime}\n\nPlease make sure to arrive at the scheduled time and place.\n\nThank you!`;

    let htmlMessage = `
      <p>Hello,</p>
      <p>The time and place for the item pickup have been <strong>confirmed</strong>.</p>
      <p><strong>Scheduled Details:</strong><br>
      Location: ${location}<br>
      Time: ${dateTime}</p>
      <p>Please make sure to arrive at the scheduled time and place.</p>
      <p>Thank you!</p>
    `;

    // Send email to sender
    await sendEmail(senderEmail, subject, message, htmlMessage);
    // Send email to recipient
    await sendEmail(recipientEmail, subject, message, htmlMessage);

    // ✅ Redirect to /gmailConfirm after processing
    res.redirect(302, "http://localhost:3000/gmailConfirm");
  } catch (error) {
    console.error("❌ Error sending confirmation emails:", error);
    res.status(500).send("❌ Failed to send confirmation emails");
  }
};
