const express = require("express");
const cors = require("cors");

const { initializeApp, cert } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");

const serviceAccount = require("./firebase-service-account.json");

initializeApp({
    credential: cert(serviceAccount)
});

const app = express();

app.use(cors());
app.use(express.json());


// Temporary device storage
// Later we will replace this with a real database.
const devices = new Map();


// ----------------------------------------
// HOME
// ----------------------------------------

app.get("/", (req, res) => {

    res.json({
        status: "Claude Notify backend is running"
    });

});


// ----------------------------------------
// REGISTER DEVICE
// ----------------------------------------

app.post("/register-device", (req, res) => {

    try {

        const { fcmToken } = req.body;

        if (!fcmToken) {

            return res.status(400).json({
                success: false,
                error: "FCM token is required"
            });

        }

        const deviceId =
            "device_" +
            Date.now() +
            "_" +
            Math.random().toString(36).substring(2, 8);


        devices.set(deviceId, {
            fcmToken: fcmToken,
            createdAt: new Date().toISOString()
        });


        console.log("Device registered:", deviceId);


        res.json({
            success: true,
            deviceId: deviceId
        });

    } catch (error) {

        console.error("Registration error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});


// ----------------------------------------
// SEND NOTIFICATION
// ----------------------------------------

app.post("/send-notification", async (req, res) => {

    try {

        const {
            deviceId,
            title,
            message
        } = req.body;


        if (!deviceId) {

            return res.status(400).json({
                success: false,
                error: "deviceId is required"
            });

        }


        const device = devices.get(deviceId);


        if (!device) {

            return res.status(404).json({
                success: false,
                error: "Device not found"
            });

        }


        const response = await getMessaging().send({

            token: device.fcmToken,

            notification: {
                title: title || "Claude Code",
                body: message || "Claude needs your attention!"
            },

            android: {
                priority: "high"
            }

        });


        console.log("Notification sent:", response);


        res.json({

            success: true,
            messageId: response

        });


    } catch (error) {

        console.error("Notification error:", error);


        res.status(500).json({

            success: false,
            error: error.message

        });

    }

});


const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(
        `Claude Notify backend running on http://localhost:${PORT}`
    );
});