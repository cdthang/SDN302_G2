import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user.models.js";
import Charity from "../models/charity.model.js";
import Post from "../models/post.models.js";
import Donation from "../models/donation.model.js";
import Report from "../models/report.model.js";
import Transaction from "../models/transaction.model.js";
import Cart from "../models/cart.model.js";
import Category from "../models/category.model.js";
import Address from "../models/address.model.js";
import Order from "../models/order.model.js";
import Favorite from "../models/favorite.model.js";
import Review from "../models/review.model.js";

dotenv.config({ quiet: true });

const STATUS_CYCLE = ["approved", "approved", "sold", "pending", "rejected"];
const CONDITION_CYCLE = ["newLike", "good", "fair"];
const DISTRICTS = [
    "Ba Đình",
    "Đống Đa",
    "Cầu Giấy",
    "Hai Bà Trưng",
    "Nam Từ Liêm",
    "Thanh Xuân",
    "Bình Thạnh",
    "Gò Vấp",
    "Quận 7",
    "Thủ Đức",
];

const categorySeed = [
    { name: "Sách", slug: "sach", level: 1, sortOrder: 1 },
    { name: "Văn học", slug: "van-hoc", level: 2, sortOrder: 2 },
    { name: "Thiết bị điện tử", slug: "thiet-bi-dien-tu", level: 1, sortOrder: 3 },
    { name: "Laptop", slug: "laptop", level: 2, sortOrder: 4 },
    { name: "Thời trang", slug: "thoi-trang", level: 1, sortOrder: 5 },
    { name: "Đồ gia dụng", slug: "do-gia-dung", level: 1, sortOrder: 6 },
    { name: "Nội thất", slug: "noi-that", level: 1, sortOrder: 7 },
    { name: "Xe đạp", slug: "xe-dap", level: 1, sortOrder: 8 },
    { name: "Đồ học tập", slug: "do-hoc-tap", level: 1, sortOrder: 9 },
    { name: "Khác", slug: "khac", level: 1, sortOrder: 10 },
];

const charitySeed = [
    {
        title: "Góp tiền xây web ReUni",
        description: "Kêu gọi đóng góp để nâng cấp hệ thống web ReUni, tối ưu tốc độ, bảo mật và trải nghiệm người dùng cho toàn bộ sinh viên.",
        shortDescription: "Góp quỹ nâng cấp nền tảng web",
        highlightMessage: "Mỗi khoản góp giúp hệ thống chạy mượt và ổn định hơn.",
        goalAmount: 120000000,
        currentAmount: 26000000,
        status: "active",
    },
    {
        title: "Trả lương nhân viên hỗ trợ vận hành",
        description: "Chiến dịch gây quỹ để duy trì đội ngũ hỗ trợ, chăm sóc người dùng và xử lý đơn hàng minh bạch mỗi ngày.",
        shortDescription: "Hỗ trợ quỹ lương đội vận hành",
        highlightMessage: "Đảm bảo dịch vụ luôn có người hỗ trợ nhanh.",
        goalAmount: 95000000,
        currentAmount: 21000000,
        status: "active",
    },
    {
        title: "Nâng cấp máy chủ và dữ liệu",
        description: "Gây quỹ cho hạ tầng server, sao lưu dữ liệu và giám sát hệ thống để tránh gián đoạn trong mùa cao điểm.",
        shortDescription: "Đầu tư hạ tầng server",
        highlightMessage: "Ổn định hạ tầng, bảo vệ dữ liệu cộng đồng.",
        goalAmount: 80000000,
        currentAmount: 15000000,
        status: "active",
    },
    {
        title: "Quỹ bảo trì ứng dụng di động",
        description: "Đóng góp cho bảo trì app ReUni trên iOS/Android, sửa lỗi, tối ưu hiệu năng và cải thiện thông báo giao dịch.",
        shortDescription: "Bảo trì app cho sinh viên",
        highlightMessage: "Giữ ứng dụng luôn mượt, ít lỗi.",
        goalAmount: 70000000,
        currentAmount: 12000000,
        status: "active",
    },
    {
        title: "Mở rộng đội kiểm duyệt nội dung",
        description: "Kêu gọi nguồn lực cho đội kiểm duyệt bài đăng nhằm giảm lừa đảo, lọc nội dung không phù hợp và duyệt nhanh hơn.",
        shortDescription: "Tăng chất lượng kiểm duyệt",
        highlightMessage: "Duyệt nhanh hơn, an toàn hơn.",
        goalAmount: 65000000,
        currentAmount: 9000000,
        status: "active",
    },
    {
        title: "Quỹ học bổng đồ cũ cho tân sinh viên",
        description: "Gây quỹ hỗ trợ các bạn tân sinh viên khó khăn tiếp cận đồ học tập và đồ dùng thiết yếu với chi phí thấp.",
        shortDescription: "Học bổng đồ cũ cho tân sinh viên",
        highlightMessage: "Giảm gánh nặng chi phí đầu năm học.",
        goalAmount: 110000000,
        currentAmount: 48000000,
        status: "active",
    },
    {
        title: "Hỗ trợ vận chuyển liên trường",
        description: "Đóng góp chi phí vận chuyển giữa các trường để sinh viên mua bán đồ cũ thuận tiện hơn, đặc biệt với đồ cồng kềnh.",
        shortDescription: "Quỹ ship liên trường",
        highlightMessage: "Mua bán xa vẫn dễ dàng.",
        goalAmount: 50000000,
        currentAmount: 18000000,
        status: "active",
    },
    {
        title: "Trang bị công cụ chăm sóc khách hàng",
        description: "Kêu gọi tài trợ để mua các công cụ CSKH, tổng đài và dashboard phản hồi nhằm giải quyết khiếu nại nhanh chóng.",
        shortDescription: "Nâng cấp công cụ CSKH",
        highlightMessage: "Phản hồi nhanh, xử lý minh bạch.",
        goalAmount: 40000000,
        currentAmount: 13000000,
        status: "active",
    },
    {
        title: "Quỹ truyền thông cộng đồng ReUni",
        description: "Tài trợ các hoạt động truyền thông để lan tỏa mô hình tái sử dụng, tiêu dùng bền vững và kết nối cộng đồng sinh viên.",
        shortDescription: "Truyền thông và phát triển cộng đồng",
        highlightMessage: "Lan tỏa thói quen tiêu dùng xanh.",
        goalAmount: 35000000,
        currentAmount: 9000000,
        status: "closed",
    },
    {
        title: "Quỹ dự phòng rủi ro giao dịch",
        description: "Xây dựng quỹ dự phòng cho các tình huống rủi ro trong giao dịch để hỗ trợ người dùng khi phát sinh sự cố đặc biệt.",
        shortDescription: "Dự phòng rủi ro giao dịch",
        highlightMessage: "An tâm hơn khi mua bán trực tuyến.",
        goalAmount: 60000000,
        currentAmount: 22000000,
        status: "closed",
    },
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        await Promise.all([
            Review.deleteMany({}),
            Favorite.deleteMany({}),
            Order.deleteMany({}),
            Cart.deleteMany({}),
            Transaction.deleteMany({}),
            Report.deleteMany({}),
            Donation.deleteMany({}),
            Post.deleteMany({}),
            Address.deleteMany({}),
            Charity.deleteMany({}),
            Category.deleteMany({}),
            User.deleteMany({}),
        ]);
        console.log("Cleared existing data");

        const categories = await Category.insertMany(categorySeed);
        console.log(`Categories: ${categories.length}`);

        const hashedPassword = await bcrypt.hash("123456", 10);
        const usersPayload = Array.from({ length: 10 }).map((_, index) => {
            const i = index + 1;
            const isAdmin = i === 1;
            return {
                username: isAdmin ? "admin" : `user${i}`,
                email: isAdmin ? "admin@gmail.com" : `user${i}@gmail.com`,
                password: hashedPassword,
                full_name: isAdmin ? "Admin User" : `User ${i}`,
                phone: `09000000${String(i).padStart(2, "0")}`,
                address: `${DISTRICTS[index]}, ${index < 6 ? "Hà Nội" : "Hồ Chí Minh"}`,
                role: isAdmin ? "admin" : "user",
                status: "active",
                isEmailVerified: true,
                emailVerifiedAt: new Date(),
                avatarUrl: `https://i.pravatar.cc/150?img=${i + 10}`,
            };
        });
        const users = await User.insertMany(usersPayload);
        console.log(`Users: ${users.length}`);

        const addresses = await Address.insertMany(
            users.map((user, index) => ({
                userId: user._id,
                fullName: user.full_name,
                phone: user.phone,
                province: index < 6 ? "Hà Nội" : "Hồ Chí Minh",
                district: DISTRICTS[index],
                ward: `Phuong ${index + 1}`,
                street: `${100 + index} Đường Mẫu ${index + 1}`,
                note: "Địa chỉ mặc định",
                isDefault: true,
            }))
        );
        console.log(`Addresses: ${addresses.length}`);

        const charities = await Charity.insertMany(charitySeed);
        console.log(`Charities: ${charities.length}`);

        const posts = await Post.insertMany(
            Array.from({ length: 10 }).map((_, index) => {
                const seller = users[(index % 9) + 1] || users[1];
                const category = categories[index % categories.length];
                const status = STATUS_CYCLE[index % STATUS_CYCLE.length];
                const isApprovedLike = status === "approved" || status === "sold";
                const now = new Date();
                return {
                    title: `Sản phẩm đồ cũ ${index + 1}`,
                    description: `Sản phẩm ${index + 1} còn sử dụng tốt, phù hợp cho sinh viên.`,
                    price: 150000 + index * 50000,
                    images: [
                        `https://picsum.photos/seed/post-${index + 1}/900/700`,
                        `https://picsum.photos/seed/post-${index + 1}-b/900/700`,
                    ],
                    category: category.name,
                    categoryId: category._id,
                    tags: ["do-cu", "sinh-vien", category.slug],
                    userId: seller._id,
                    status,
                    condition: CONDITION_CYCLE[index % CONDITION_CYCLE.length],
                    brand: ["Dell", "Ikea", "Casio", "Nike", "Generic"][index % 5],
                    color: ["Đen", "Trắng", "Xám", "Xanh", "Đỏ"][index % 5],
                    size: ["S", "M", "L", "XL", "Free"][index % 5],
                    locationCity: index < 5 ? "Hà Nội" : "Hồ Chí Minh",
                    locationDistrict: DISTRICTS[index],
                    shippingType: ["pickup", "delivery", "both"][index % 3],
                    shippingFee: index % 2 === 0 ? 0 : 20000,
                    isFreeShip: index % 2 === 0,
                    quantity: status === "sold" ? 0 : 1 + (index % 3),
                    viewCount: 100 + index * 17,
                    favoriteCount: index,
                    rejectReason: status === "rejected" ? "Nội dung cần bổ sung thông tin" : "",
                    approvedAt: isApprovedLike ? now : null,
                    approvedBy: isApprovedLike ? users[0]._id : null,
                    soldAt: status === "sold" ? now : null,
                };
            })
        );
        console.log(`Posts: ${posts.length}`);

        const donations = await Donation.insertMany(
            Array.from({ length: 10 }).map((_, index) => ({
                charityId: charities[index % charities.length]._id,
                donorName: users[index % users.length].full_name,
                amount: 50000 + index * 25000,
                message: `Ủng hộ lần ${index + 1}`,
                userId: users[index % users.length]._id,
            }))
        );
        console.log(`Donations: ${donations.length}`);

        const reports = await Report.insertMany(
            Array.from({ length: 10 }).map((_, index) => ({
                postId: posts[index % posts.length]._id,
                reporterId: users[(index + 2) % users.length]._id,
                reason: `Báo cáo nội dung ${index + 1}`,
                details: `Chi tiết báo cáo ${index + 1}`,
                reportType: ["spam", "fake", "prohibited", "scam", "other"][index % 5],
                status: index < 4 ? "pending" : index < 8 ? "resolved" : "dismissed",
                reviewedBy: index < 4 ? null : users[0]._id,
                adminNote: index < 4 ? "" : "Đã xử lý bởi admin",
                resolvedAt: index < 4 ? null : new Date(),
                resolutionAction: index < 4 ? "none" : index % 2 === 0 ? "hidden" : "dismissed",
            }))
        );
        console.log(`Reports: ${reports.length}`);

        const orders = await Order.insertMany(
            Array.from({ length: 10 }).map((_, index) => {
                const buyer = users[(index + 2) % users.length];
                const postA = posts[index % posts.length];
                const postB = posts[(index + 3) % posts.length];

                const unitA = Number(postA.price || 0);
                const unitB = Number(postB.price || 0);
                const itemA = {
                    postId: postA._id,
                    sellerId: postA.userId,
                    quantity: 1,
                    unitPrice: unitA,
                    subtotal: unitA,
                };
                const itemB = {
                    postId: postB._id,
                    sellerId: postB.userId,
                    quantity: 1,
                    unitPrice: unitB,
                    subtotal: unitB,
                };
                const useTwoItems = index % 2 === 0;
                const items = useTwoItems ? [itemA, itemB] : [itemA];

                return {
                    buyerId: buyer._id,
                    items,
                    shippingAddressId: addresses[(index + 2) % addresses.length]._id,
                    totalAmount: items.reduce((sum, item) => sum + item.subtotal, 0),
                    orderStatus: ["pending", "confirmed", "shipping", "completed", "cancelled"][index % 5],
                    paymentStatus: ["pending", "paid", "failed", "paid", "refunded"][index % 5],
                    note: `Đơn hàng mẫu ${index + 1}`,
                };
            })
        );
        console.log(`Orders: ${orders.length}`);

        const transactions = await Transaction.insertMany(
            Array.from({ length: 10 }).map((_, index) => {
                if (index % 2 === 0) {
                    const order = orders[index % orders.length];
                    const firstItem = order.items[0];
                    const paymentStatus = ["pending", "paid", "failed", "paid", "refunded"][index % 5];
                    return {
                        type: "sale",
                        amount: firstItem.unitPrice,
                        commissionRate: 5,
                        commissionAmount: Math.round(firstItem.unitPrice * 0.05),
                        netAmount: firstItem.unitPrice - Math.round(firstItem.unitPrice * 0.05),
                        payerId: order.buyerId,
                        sellerId: firstItem.sellerId,
                        postId: firstItem.postId,
                        orderId: order._id,
                        charityId: null,
                        status: paymentStatus,
                        paymentMethod: "manual",
                        metadata: { flow: "seed-sale", index },
                        bankTransferRef: `SEED-SALE-${index + 1}`,
                        paymentProofImage: `https://picsum.photos/seed/proof-${index + 1}/600/400`,
                        paidAt: paymentStatus === "paid" ? new Date() : null,
                        confirmedAt: paymentStatus === "paid" ? new Date() : null,
                        confirmedBy: paymentStatus === "paid" ? users[0]._id : null,
                        failReason: paymentStatus === "failed" ? "Người mua chưa chuyển khoản" : "",
                    };
                }

                const charity = charities[index % charities.length];
                const payer = users[index % users.length];
                const amount = 50000 + index * 15000;
                const paymentStatus = index % 3 === 0 ? "paid" : "pending";
                return {
                    type: "donation",
                    amount,
                    commissionRate: 0,
                    commissionAmount: 0,
                    netAmount: amount,
                    payerId: payer._id,
                    sellerId: null,
                    postId: null,
                    orderId: null,
                    charityId: charity._id,
                    status: paymentStatus,
                    paymentMethod: "manual",
                    metadata: { flow: "seed-donation", index },
                    bankTransferRef: `SEED-DON-${index + 1}`,
                    paymentProofImage: "",
                    paidAt: paymentStatus === "paid" ? new Date() : null,
                    confirmedAt: paymentStatus === "paid" ? new Date() : null,
                    confirmedBy: paymentStatus === "paid" ? users[0]._id : null,
                    failReason: "",
                };
            })
        );
        console.log(`Transactions: ${transactions.length}`);

        const favoritePairs = [];
        const favoriteSet = new Set();
        for (const user of users) {
            for (const post of posts) {
                if (String(user._id) === String(post.userId)) {
                    continue;
                }
                const key = `${user._id}-${post._id}`;
                if (!favoriteSet.has(key)) {
                    favoriteSet.add(key);
                    favoritePairs.push({ userId: user._id, postId: post._id });
                }
                if (favoritePairs.length >= 10) {
                    break;
                }
            }
            if (favoritePairs.length >= 10) {
                break;
            }
        }
        const favorites = await Favorite.insertMany(favoritePairs);
        console.log(`Favorites: ${favorites.length}`);

        const carts = await Cart.insertMany(
            users.map((user, index) => {
                const safePostA = posts.find((post) => post.status === "approved" && String(post.userId) !== String(user._id));
                const safePostB = posts.find((post, i) => i !== index && post.status === "approved" && String(post.userId) !== String(user._id));
                const items = [];
                if (safePostA) {
                    items.push({ postId: safePostA._id, quantity: 1 + (index % 2), priceAtAdd: safePostA.price });
                }
                if (safePostB && index % 2 === 0) {
                    items.push({ postId: safePostB._id, quantity: 1, priceAtAdd: safePostB.price });
                }
                return {
                    userId: user._id,
                    items,
                };
            })
        );
        console.log(`Carts: ${carts.length}`);

        const reviews = await Review.insertMany(
            Array.from({ length: 10 }).map((_, index) => {
                const order = orders[index % orders.length];
                const sellerId = order.items[0].sellerId;
                return {
                    orderId: order._id,
                    reviewerId: order.buyerId,
                    sellerId,
                    rating: (index % 5) + 1,
                    comment: `Đánh giá mẫu ${index + 1} cho người bán`,
                };
            })
        );
        console.log(`Reviews: ${reviews.length}`);

        const sellerStats = await Review.aggregate([
            {
                $group: {
                    _id: "$sellerId",
                    ratingAvg: { $avg: "$rating" },
                    ratingCount: { $sum: 1 },
                },
            },
        ]);

        for (const stat of sellerStats) {
            await User.findByIdAndUpdate(stat._id, {
                ratingAvg: Number(stat.ratingAvg.toFixed(2)),
                ratingCount: stat.ratingCount,
            });
        }

        const postCountStats = await Post.aggregate([
            { $group: { _id: "$userId", count: { $sum: 1 } } },
        ]);
        for (const stat of postCountStats) {
            await User.findByIdAndUpdate(stat._id, { postCount: stat.count });
        }

        console.log("Seeding completed successfully");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();
