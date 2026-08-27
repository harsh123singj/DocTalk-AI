import dotenv from "dotenv";

dotenv.config();

const { default: app } = await import("./app.js");
const { default: connectDB } = await import("./config/db.js");

await connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`APP is running on port ${PORT}`);
});