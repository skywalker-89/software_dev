const sendEmail = require("../utils/sendEmail");
const QRCode = require("qrcode");

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
      user_id,
      poster_id,
      id,
      title,
    } = req.body;

    console.log(req.body);

    let confirmLink = `http://localhost:1111/email/confirm-schedule?recipientEmail=${encodeURIComponent(
      recipientEmail
    )}&senderEmail=${encodeURIComponent(
      senderEmail
    )}&location=${encodeURIComponent(location)}&dateTime=${encodeURIComponent(
      dateTime
    )}&title=${encodeURIComponent(title)}&id=${encodeURIComponent(id)}`;

    let chatLink = `http://localhost:1111/chat/create-room?user_id=${encodeURIComponent(
      user_id
    )}&poster_id=${encodeURIComponent(poster_id)}&id=${encodeURIComponent(
      id
    )}&title=${encodeURIComponent(title)}`;

    let subject = "Lost Item Claim Request";
    let message = `Hello,\n\n${firstName} ${lastName} wants to claim the lost item.\nPickup Details:\nLocation: ${location}\nTime: ${dateTime}.\n\nPlease reach out to arrange the handover.`;

    // HTML version with chat link button
    let htmlMessage = `
      <p>Hello,</p>
      <p>${firstName} ${lastName} wants to claim <a href="http://localhost:3000/item/${id}">${title}</a></p>
      <p><strong>Pickup Details:</strong><br>
      Location: ${location}<br>
      Time: ${dateTime}</p>
      <p>Chat with them to confirm the time and place.</p>
      <p><a href="${chatLink}" style="
          background-color: #2563EB;
          color: white !important;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          display: inline-block;
        ">Chat with them now</a></p>
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
      user_id,
      poster_id,
      id,
      title,
    } = req.body;

    console.log("This is the the", title);
    console.log("This is the the", id);

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
    )}&title=${encodeURIComponent(title)}&id=${encodeURIComponent(id)}`;

    let chatLink = `http://localhost:1111/chat/create-room?user_id=${encodeURIComponent(
      user_id
    )}&poster_id=${encodeURIComponent(poster_id)}&id=${encodeURIComponent(
      id
    )}&title=${encodeURIComponent(title)}`;

    let subject = "Lost Item Return Request";
    let message = `Hello,\n\n${firstName} ${lastName} wants to return your lost item.\nPickup Details:\nLocation: ${location}\nTime: ${dateTime}.\n\nAttached are the images of the item.\n\nPlease reach out to arrange the handover.`;

    // HTML version with chat link button
    let htmlMessage = `
      <p>Hello,</p>
      <p>${firstName} ${lastName} wants to return your <a href="http://localhost:3000/item/${id}">${title}</a></p>
      <p><strong>Pickup Details:</strong><br>
      Location: ${location}<br>
      Time: ${dateTime}</p>

      <br>
      <p>Chat with them to confirm the time and place.</p>
      <p><a href="${chatLink}" style="
          background-color: #2563EB;
          color: white !important;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          display: inline-block;
        ">Chat with them now</a></p>
      <p>Please don not reply this gmail if this is not your item</p>
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

exports.ReSchedule = async (req, res) => {
  try {
    const {
      recipientEmail,
      senderEmail,
      location,
      dateTime,
      title,
      id,
      senderFirstName,
      senderLastName,
      senderPhone,
      senderId,
    } = req.query;
    console.log(req.query);

    if (
      !recipientEmail ||
      !senderEmail ||
      !location ||
      !dateTime ||
      !title ||
      !id ||
      !senderFirstName ||
      !senderLastName ||
      !senderPhone ||
      !senderId
    ) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    // Your qrData object
    const qrData = {
      senderEmail,
      senderFirstName,
      senderLastName,
      senderPhone,
      senderEmail,
      senderId,
      id,
    };

    // Serialize qrData into a string (JSON format)
    const qrDataString = JSON.stringify(qrData);

    // Generate the QR code as a data URL
    QRCode.toDataURL(qrDataString, async function (err, url) {
      if (err) {
        console.error("Error generating QR code:", err);
        return res.status(500).send("❌ Failed to generate QR code");
      }
      console.log(url); // This is the data URL representing the QR code

      let subject = "Pickup Time and Location Confirmed";
      let message = `Hello,\n\nThe time and place for the item pickup have been confirmed.\n\nScheduled Details:\nLocation: ${location}\nTime: ${dateTime}\n\nPlease make sure to arrive at the scheduled time and place.\n\nThank you!`;

      // Embed the QR code image as a base64 data URL in the email HTML
      let htmlMessage = `
        <p>Hello,</p>
        <p>The time and place for the <a href="http://localhost:3000/item/${id}">${title}</a> pickup have been <strong>confirmed</strong>.</p>
        <p><strong>Scheduled Details:</strong><br>
        Location: ${location}<br>
        Time: ${dateTime}</p>
        <p>Please make sure to arrive at the scheduled time and place.</p>
        <p>Thank you!</p>
      `;

      let htmlMessageQR = `
        <p>Hello,</p>
        <p>The time and place for the <a href="http://localhost:3000/item/${id}">${title}</a> pickup have been <strong>confirmed</strong>.</p>
        <p><strong>Scheduled Details:</strong><br>
        Location: ${location}<br>
        Time: ${dateTime}</p>
        <p>Please make sure to arrive at the scheduled time and place.</p>
        <p>Thank you!</p>
        <p><strong>Scan this QR code at meet up location.</strong></p>
        <img src="cid:qr-code-image" />

      `;

      // Prepare attachments with inline QR code
      let attachments = [
        {
          filename: "qr-code.png",
          content: url.split("base64,")[1], // Strip out the base64 header
          encoding: "base64",
          cid: "qr-code-image", // This will be used in the <img> tag
        },
      ];

      // Send email to sender
      await sendEmail(
        senderEmail,
        subject,
        message,
        htmlMessageQR,
        attachments
      );
      // Send email to recipient
      await sendEmail(recipientEmail, subject, message, htmlMessage);

      // ✅ Send JSON response instead of redirect
      res.status(200).json({
        success: true,
        message: "Confirmation emails sent successfully.",
      });
    });
  } catch (error) {
    console.error("❌ Error sending confirmation emails:", error);
    res.status(500).send("❌ Failed to send confirmation emails");
  }
};

exports.confirmSchedule = async (req, res) => {
  try {
    const { recipientEmail, senderEmail, location, dateTime, title, id } =
      req.query;
    console.log(req.query);

    if (
      !recipientEmail ||
      !senderEmail ||
      !location ||
      !dateTime ||
      !title ||
      !id
    ) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    let subject = "Pickup Time and Location Confirmed";
    let message = `Hello,\n\nThe time and place for the item pickup have been confirmed.\n\nScheduled Details:\nLocation: ${location}\nTime: ${dateTime}\n\nPlease make sure to arrive at the scheduled time and place.\n\nThank you!`;

    let htmlMessage = `
      <p>Hello,</p>
      <p>The time and place for the <a href="http://localhost:3000/item/${id}">${title}</a> pickup have been <strong>confirmed</strong>.</p>
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
