import dotenv from 'dotenv'
import mongoose from 'mongoose';
dotenv.config()
import app from "./app.js";

const PORT = process.env.PORT || 3000

try {
    await mongoose.connect(process.env.db);
    console.log("🚀 Db connected")
} catch (err) {
    console.log("ERROR 💥", err.message)
}

app.listen(PORT, () => {
    console.log("🚀 App runing on ", PORT, "...")
})