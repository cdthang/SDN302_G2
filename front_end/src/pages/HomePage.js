import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import Header from "../components/Header";

export default function StudentUsedGoodsHomepage() {
  const [charities, setCharities] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/charities')
      .then(res => {
        if (Array.isArray(res.data)) {
          setCharities(res.data.slice(0, 3));
        }
      })
      .catch(console.error);
  }, []);

  const categories = [
    { name: "Sách & giáo trình", icon: "📚" },
    { name: "Laptop & phụ kiện", icon: "💻" },
    { name: "Đồ điện tử", icon: "🎧" },
    { name: "Nội thất phòng trọ", icon: "🪑" },
    { name: "Xe đạp & đi lại", icon: "🚲" },
    { name: "Đồ dùng học tập", icon: "📝" },
  ];

  const products = [
    {
      title: "Giáo trình Kinh tế vi mô",
      price: "120.000đ",
      campus: "ĐH Kinh tế",
      status: "Còn tốt",
      image:
        "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Laptop học tập Lenovo",
      price: "5.200.000đ",
      campus: "Bách Khoa",
      status: "Đã kiểm tra",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Tai nghe Bluetooth",
      price: "350.000đ",
      campus: "ĐH Ngoại thương",
      status: "Like new",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    },
  ];

  const steps = [
    {
      title: "Đăng món đồ",
      desc: "Sinh viên chụp ảnh, mô tả tình trạng và gửi thông tin trong 1 phút.",
    },
    {
      title: "Định giá minh bạch",
      desc: "Hệ thống gợi ý giá thu mua dựa trên tình trạng, thương hiệu và nhu cầu thực tế.",
    },
    {
      title: "Nhận tiền nhanh",
      desc: "Xác nhận tại trường hoặc ký túc xá, thanh toán ngay sau khi kiểm tra.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-white to-sky-100" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm text-emerald-700 shadow-sm">
              Thu mua tận nơi • Định giá nhanh • Ưu tiên sinh viên
            </div>
            <h1 className="max-w-xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
              Biến đồ cũ thành <span className="text-emerald-600">tiền mặt</span> ngay tại trường
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Nền tảng thu mua đồ cũ dành riêng cho sinh viên: sách, laptop, đồ điện tử,
              nội thất phòng trọ và nhiều hơn nữa. Nhanh, minh bạch, không mặc cả mệt mỏi.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button className="rounded-2xl bg-slate-900 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5">
                Đăng món đồ cần bán
              </button>
              <button className="rounded-2xl border border-slate-300 bg-white px-6 py-4 text-base font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50">
                Xem giá thu mua
              </button>
            </div>

            <div className="mt-8 grid max-w-lg grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <p className="text-2xl font-black">15.000+</p>
                <p className="mt-1 text-sm text-slate-500">món đồ đã thu mua</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <p className="text-2xl font-black">30 phút</p>
                <p className="mt-1 text-sm text-slate-500">phản hồi báo giá</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <p className="text-2xl font-black">20+</p>
                <p className="mt-1 text-sm text-slate-500">trường hỗ trợ</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-10 h-28 w-28 rounded-full bg-emerald-200 blur-3xl" />
            <div className="absolute -right-6 bottom-6 h-28 w-28 rounded-full bg-sky-200 blur-3xl" />
            <div className="relative rounded-[2rem] bg-white p-4 shadow-2xl ring-1 ring-slate-200">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                alt="Sinh viên trao đổi đồ cũ"
                className="h-[460px] w-full rounded-[1.5rem] object-cover"
              />
              <div className="absolute bottom-10 left-10 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur">
                <p className="text-sm text-slate-500">Báo giá gần nhất</p>
                <p className="mt-1 text-xl font-bold">Bàn học mini — 420.000đ</p>
                <p className="mt-1 text-sm text-emerald-600">Xác nhận trong 12 phút</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="danh-muc" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Danh mục phổ biến</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Chúng tôi đang thu mua gì?</h2>
          </div>
          <button className="hidden rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium md:block">
            Xem tất cả
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((item) => (
            <div
              key={item.name}
              className="group rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                {item.icon}
              </div>
              <h3 className="mt-5 text-xl font-bold">{item.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Thu mua nhanh, có hỗ trợ kiểm tra tình trạng và gợi ý mức giá phù hợp với sinh viên.
              </p>
              <div className="mt-5 text-sm font-semibold text-emerald-600">Xem giá tham khảo →</div>
            </div>
          ))}
        </div>
      </section>

      <section id="quy-trinh" className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">Quy trình 3 bước</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Đơn giản để bán, an tâm khi giao dịch</h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-lg font-black text-slate-900">
                  {index + 1}
                </div>
                <h3 className="mt-5 text-2xl font-bold">{step.title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="san-pham" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Mức giá tham khảo</p>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">Một số món đồ sinh viên bán nhiều</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <div key={product.title} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
              <img src={product.image} alt={product.title} className="h-60 w-full object-cover" />
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {product.status}
                  </span>
                  <span className="text-sm text-slate-500">{product.campus}</span>
                </div>
                <h3 className="text-xl font-bold">{product.title}</h3>
                <p className="mt-3 text-2xl font-black text-slate-900">{product.price}</p>
                <button className="mt-5 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95">
                  Bán món tương tự
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="tu-thien" className="bg-emerald-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Hoạt động cộng đồng</p>
              <h2 className="mt-2 text-3xl font-black md:text-4xl">Chiến dịch từ thiện nổi bật</h2>
            </div>
            <Link to="/charities" className="hidden rounded-xl border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 md:block">
              Xem tất cả chiến dịch
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {charities.length > 0 ? charities.map((charity) => {
              const pct = charity.goalAmount > 0 ? Math.min(100, Math.round(((charity.currentAmount || 0) / charity.goalAmount) * 100)) : 0;
              return (
                <div key={charity._id} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 flex flex-col hover:shadow-lg transition-shadow">
                  <div className="p-6 flex-grow">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${charity.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                        {charity.status === 'active' ? 'Đang diễn ra' : 'Đã đóng'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold line-clamp-2 mb-2">{charity.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-3 mb-4">{charity.shortDescription || charity.description}</p>
                    {charity.highlightMessage && (
                      <p className="text-sm italic text-amber-700 bg-amber-50 p-2 rounded border-l-2 border-amber-400">"{charity.highlightMessage}"</p>
                    )}
                  </div>
                  <div className="bg-slate-50 p-6 border-t border-slate-100">
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span className="text-slate-600">Đã góp <span className="text-emerald-600 font-bold">{Number(charity.currentAmount || 0).toLocaleString()}đ</span></span>
                      <span className="text-slate-500">/{Number(charity.goalAmount || 0).toLocaleString()}đ</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-4 overflow-hidden">
                      <div className="bg-emerald-500 h-2 rounded-full flex relative" style={{ width: `${pct}%` }}></div>
                    </div>
                    <Link to={`/charity/${charity._id}`} className="mt-2 block text-center rounded-xl bg-white border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 w-full">
                      Ủng hộ ngay & Xem chi tiết
                    </Link>
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-3 text-center py-12 text-slate-500 bg-white rounded-3xl border border-slate-200">
                Chưa có chiến dịch nào.
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/charities" className="rounded-xl border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 inline-block w-full">
              Xem tất cả chiến dịch
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-16 mt-16">
        <div className="grid gap-6 rounded-[2rem] bg-gradient-to-r from-emerald-500 to-teal-500 p-8 text-white md:grid-cols-[1.4fr_0.8fr] md:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Ưu đãi cho tân sinh viên</p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">Bán combo đồ cũ, nhận thêm thưởng</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/90">
              Bán từ 3 món trở lên trong cùng một lần đăng ký để được ưu tiên lịch thu mua và cộng thêm ưu đãi vận chuyển.
            </p>
          </div>
          <div className="rounded-3xl bg-white/15 p-6 backdrop-blur">
            <p className="text-sm text-white/80">Nhanh tay bắt đầu</p>
            <input
              placeholder="Nhập email sinh viên"
              className="mt-4 w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-slate-900 outline-none"
            />
            <button className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white">
              Nhận báo giá miễn phí
            </button>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">FAQ</p>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">Câu hỏi thường gặp</h2>
        </div>

        <div className="mt-10 space-y-4">
          {[
            ["Có thu mua tận ký túc xá không?", "Có. Chúng tôi hỗ trợ nhận đồ tại ký túc xá, cổng trường hoặc khu trọ gần trường."],
            ["Mất bao lâu để nhận báo giá?", "Thông thường trong vòng 30 phút sau khi bạn gửi ảnh và mô tả sản phẩm."],
            ["Có thu mua đồ lỗi nhẹ không?", "Có. Hệ thống vẫn tiếp nhận và báo giá dựa trên tình trạng thực tế của món đồ."],
          ].map(([q, a]) => (
            <div key={q} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-lg font-bold">{q}</h3>
              <p className="mt-2 leading-7 text-slate-600">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-bold">ReUni</p>
            <p className="mt-1 text-sm text-slate-500">Giải pháp thu mua đồ cũ tiện lợi cho cộng đồng sinh viên.</p>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-slate-500">
            <a href="#">Chính sách</a>
            <a href="#">Điều khoản</a>
            <a href="#">Hỗ trợ</a>
            <a href="#">Liên hệ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
