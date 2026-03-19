import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user.models.js";
import Charity from "../models/charity.model.js";
import Post from "../models/post.models.js";

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Clear existing data
        await User.deleteMany({});
        await Charity.deleteMany({});
        await Post.deleteMany({});
        console.log("🗑️ Cleared existing data");

        // Create Admin User
        const hashedPassword = await bcrypt.hash("123456", 10);
        const admin = await User.create({
            username: "admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            full_name: "Admin User",
            phone: "0999999999",
            address: "Hanoi",
            role: "admin",
            status: "active"
        });
        console.log("👤 Created Admin User");

        // Create Sample Charities
        const charities = await Charity.insertMany([
            {
                title: "Quỹ Trồng Cây Xanh 2024",
                description: "Chiến dịch phủ xanh các đồi trọc tại miền Trung Việt Nam. Chúng tôi đặt mục tiêu trồng 10.000 cây xanh trong năm nay để bảo vệ môi trường và giảm thiểu biến đổi khí hậu.",
                shortDescription: "Trồng 10.000 cây xanh bảo vệ môi trường.",
                highlightMessage: "Vì một Việt Nam xanh hơn!",
                goalAmount: 100000000,
                currentAmount: 25000000,
                status: "active"
            },
            {
                title: "Hỗ Trợ Trẻ Em Vùng Cao",
                description: "Cung cấp sách vở, quần áo ấm và xây dựng phòng học cho trẻ em tại các tỉnh vùng núi phía Bắc. Mỗi sự đóng góp của bạn đều mang lại nụ cười cho các em.",
                shortDescription: "Gửi ấm áp đến trẻ em vùng cao.",
                highlightMessage: "Chắp cánh ước mơ đến trường",
                goalAmount: 50000000,
                currentAmount: 10000000,
                status: "active"
            }
        ]);
        console.log("🏫 Created Sample Charities");

        // Create Sample Posts
        await Post.insertMany([
            {
                title: "Laptop cũ còn tốt",
                description: "Mình có chiếc laptop Dell Inspiron không dùng đến, muốn tặng lại hoặc bán rẻ để gây quỹ từ thiện.",
                price: 2000000,
                images: ["https://picsum.photos/seed/laptop/400/300"],
                category: "Electronics",
                tags: ["laptop", "charity"],
                userId: admin._id,
                status: "approved"
            },
            {
                title: "Sách giáo khoa lớp 10",
                description: "Bộ sách giáo khoa lớp 10 đầy đủ các môn, còn khá mới.",
                price: 0,
                images: ["https://picsum.photos/seed/books/400/300"],
                category: "Books",
                tags: ["education", "free"],
                userId: admin._id,
                status: "approved"
            }
        ]);
        console.log("📦 Created Sample Posts");

        console.log("✨ Seeding completed successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Error seeding data:", error);
        process.exit(1);
    }
};

seedData();
