# 📘 LinkedIn Job Crawler Extension

## 🚀 Chức năng chính

Tiện ích mở rộng (Extension) này cho phép bạn thu thập thông tin việc làm từ trang [LinkedIn Jobs](https://www.linkedin.com/jobs/) một cách tự động, trực tiếp hiển thị ngay trên giao diện người dùng và hỗ trợ lưu lại kết quả dưới dạng file CSV.

## ✅ Các tính năng nổi bật

* **Tự động crawl nhiều trang kết quả tìm kiếm việc làm**
* **Hiển thị dữ liệu trực tiếp trên giao diện trang LinkedIn**
* **Crawl đầy đủ các trường thông tin:**

  * `Job Title`
  * `Company`
  * `Location`
  * `Type` (Full-time / Part-time / Remote...)
  * `Salary`
  * `Date Posted`
  * `Job Link`
* **Tự động chuyển trang & tiếp tục crawl**
* **Hỗ trợ tiếp tục sau khi reload trang** (dữ liệu lưu tạm qua localStorage)
* **Giới hạn số trang crawl (người dùng nhập)**
* **Xuất file CSV với định dạng:**

  ```
  [số-job]_jobs_[ten-trang].csv
  ```

  * Ví dụ: `25_jobs_linkedin-jobs-search.csv`
* **Nút “Xóa Dữ Liệu” để reset dữ liệu đã lưu**
* **Nút “Dừng” để tạm ngắt crawl giữa chừng**
* **Giả lập hành vi người dùng** (cuộn và rê chuột tự nhiên để tránh bị chặn)

---

## 🛠 Hướng dẫn sử dụng

1. **Truy cập trang:**
   * Truy cập vào: [https://www.linkedin.com/jobs/search](https://www.linkedin.com/jobs/search)
   * Nhập từ khóa tìm kiếm và nhấn tìm kiếm.
2. **Hiển thị giao diện crawler:**
   * Một nút nhỏ xuất hiện góc phải trên cùng: `🧰 Mở Tool Crawl`
   * Click vào để mở bảng điều khiển.
3. **Thiết lập thông số:**
   * Nhập số trang cần crawl.
   * Nhấn **Bắt đầu** để bắt đầu thu thập dữ liệu.
4. **Khi crawl hoàn tất:**
   * Tự động xuất file CSV.
   * Có thể nhấn "Xóa" để reset dữ liệu hoặc "Dừng" để tạm ngưng.
     ![Video Demo](https://example.com/path/to/video.gif)

---

## 📂 Cấu trúc dữ liệu CSV

| Title | Company | Location | Type | Salary | Date | Link |
| ----- | ------- | -------- | ---- | ------ | ---- | ---- |
| ...   | ...     | ...      | ...  | ...    | ...  | ...  |

---

## 📌 Lưu ý

* Nên sử dụng tài khoản thật đã đăng nhập LinkedIn để tránh bị chặn/captcha.
* Không nên để tool chạy quá nhanh hoặc crawl quá nhiều trong thời gian ngắn.
* Đã hỗ trợ resume sau reload, nhưng nếu bạn xóa localStorage thì dữ liệu sẽ mất.
* Sau khi bấm 'Bắt đầu' bạn cần thu nhỏ trang xuống 25% để tool có thể hoạt động chính xác nhất

---

## 🧑‍💻 Kỹ thuật sử dụng

* JavaScript thuần (`content.js` inject vào DOM)
* DOM crawling với delay ngẫu nhiên
* Simulate scroll và mousemove
* CSV export bằng `Blob`
* Hiển thị bảng dữ liệu bằng HTML Table trực tiếp trong trang
* Không cần popup hay UI phức tạp

---

## 📧 Liên hệ

Mọi vấn đề hoặc yêu cầu mở rộng thêm tính năng, bạn có thể liên hệ [huuduongle2002@gmail.com](huuduongle2002@gmail.com).

Chúc bạn tìm được công việc tốt! 🚀
