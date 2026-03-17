import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user.models.js";

dotenv.config();

const createUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // User details
        const username = "testuser";
        const email = "testuser@gmail.com";
        const password = "123456";
        const fullName = "Test User";

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("⚠️ User already exists");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        await User.create({
            username: username,
            email: email,
            password: hashedPassword,
            full_name: fullName,
            role: "user",
            status: "active"
        });

        console.log(`👤 Created User Account: ${username} (${email})`);
        process.exit();
    } catch (error) {
        console.error("❌ Error creating user:", error);
        process.exit(1);
    }
};

createUser();
