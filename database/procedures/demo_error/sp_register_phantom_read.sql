-- ============================================================
-- LỖI BÓNG MA (PHANTOM READ) - DEMO
-- ============================================================
-- 
-- KHÁI NIỆM:
--   Phantom Read xảy ra khi:
--   - Transaction T1 đọc một tập hợp bản ghi theo điều kiện nào đó
--   - Transaction T2 INSERT thêm bản ghi mới thoả điều kiện đó
--   - T1 đọc lại lần nữa thấy bản ghi "bóng ma" xuất hiện thêm
--
-- KỊCH BẢN DEMO:
--   Áp dụng vào hệ thống đăng ký học phần:
--   - T1 (Session 1): Đọc số slot còn lại của lớp học phần → thấy còn 1 slot
--   - T2 (Session 2): Đăng ký vào lớp đó → lớp đầy (0 slot còn lại)
--   - T1 (Session 1): Đọc lại → slot đã thay đổi (phantom!) → đăng ký vào
--     lớp đã đầy gây ra dữ liệu sai
--
-- CÁCH DEMO (chạy 2 cửa sổ SSMS song song):
--   Bước 1: Chuẩn bị dữ liệu - chạy phần SETUP bên dưới
--   Bước 2: Mở 2 cửa sổ SSMS (Session 1 và Session 2)
--   Bước 3: Session 1 chạy sp_demo_phantom_session1 (sẽ bị dừng 10 giây)
--   Bước 4: TRONG 10 GIÂY ĐÓ - Session 2 chạy sp_demo_phantom_session2
--   Bước 5: Sau 10 giây Session 1 tiếp tục chạy
--   Bước 6: Kiểm tra kết quả - thấy registered_students > maximum_students
--           → Đây là lỗi Phantom: T1 đọc slot lúc đầu, T2 chen vào,
--             T1 vẫn tiếp tục dựa trên dữ liệu cũ → sai
--
-- KẾT QUẢ MONG ĐỢI KHI LỖI XẢY RA:
--   registered_students = maximum_students + 1 (vượt quá giới hạn)
--   Có 2 bản ghi trong CourseRegistration cho cùng 1 section
--   khi section đó chỉ còn 1 slot
--
-- CÁCH FIX (đã áp dụng trong sp_register_course_section gốc):
--   Dùng fn_get_remaining_slots() bên trong transaction với
--   isolation level cao hơn (SERIALIZABLE hoặc dùng UPDLOCK hint)
--   để lock bản ghi khi đọc, ngăn T2 insert vào giữa.
-- ============================================================

USE StudentRegistrationDB;
GO

-- ============================================================
-- BƯỚC 1: SETUP - Tạo section demo chỉ còn 1 slot
-- Chạy phần này trước khi demo
-- ============================================================

-- Tạo procedure setup dữ liệu demo
CREATE OR ALTER PROCEDURE sp_phantom_setup_demo
AS
BEGIN
    -- Tìm section có slot còn trống, set về còn đúng 1 slot
    -- Dùng section_id = 1 cho demo (điều chỉnh nếu cần)
    UPDATE CourseSection
    SET registered_students = maximum_students - 1
    WHERE id = 1;

    -- Xoá đăng ký cũ của student 3, 4 (nếu có) để demo sạch
    DELETE FROM CourseRegistration
    WHERE student_id IN (3, 4)
      AND section_id = 1;

    -- Kiểm tra lại
    SELECT
        id AS section_id,
        maximum_students,
        registered_students,
        maximum_students - registered_students AS slots_remaining
    FROM CourseSection
    WHERE id = 1;

    PRINT N'[SETUP] Section 1 hiện còn đúng 1 slot - sẵn sàng demo';
END
GO

-- ============================================================
-- BƯỚC 2: SESSION 1 - Transaction đọc slot rồi bị delay
-- Chạy cửa sổ này TRƯỚC, sau đó NGAY LẬP TỨC chạy Session 2
-- ============================================================

CREATE OR ALTER PROCEDURE sp_demo_phantom_session1
AS
BEGIN
    -- Bắt đầu transaction với READ COMMITTED (mặc định)
    -- KHÔNG dùng isolation cao → dễ bị phantom
    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
    BEGIN TRANSACTION;

    DECLARE @SlotsRemaining INT;
    DECLARE @StudentId INT = 3;  -- Student 3 đăng ký
    DECLARE @SectionId INT = 1;

    -- LẦN ĐỌC 1: Đọc số slot còn lại
    SELECT
        @SlotsRemaining = maximum_students - registered_students
    FROM CourseSection
    WHERE id = @SectionId;

    PRINT N'[SESSION 1] Lần đọc 1 - Slots còn lại: ' + CAST(@SlotsRemaining AS NVARCHAR);
    PRINT N'[SESSION 1] Đang chờ 10 giây... (Hãy chạy Session 2 ngay bây giờ!)';

    -- DELAY 10 giây để Session 2 có thời gian chen vào
    WAITFOR DELAY '00:00:10';

    -- LẦN ĐỌC 2: Đọc lại slot sau khi delay
    DECLARE @SlotsAfterDelay INT;
    SELECT
        @SlotsAfterDelay = maximum_students - registered_students
    FROM CourseSection
    WHERE id = @SectionId;

    PRINT N'[SESSION 1] Lần đọc 2 - Slots còn lại: ' + CAST(@SlotsAfterDelay AS NVARCHAR);

    -- Vẫn dựa vào lần đọc 1 (phantom!) để quyết định đăng ký
    IF @SlotsRemaining > 0
    BEGIN
        PRINT N'[SESSION 1] Dựa vào lần đọc 1 thấy còn slot → tiến hành đăng ký';

        INSERT INTO CourseRegistration
        (student_id, section_id, registration_date, status)
        VALUES
        (@StudentId, @SectionId, GETDATE(), 'REGISTERED');

        -- Cập nhật sĩ số (dựa trên dữ liệu cũ đọc từ đầu - gây phantom)
        UPDATE CourseSection
        SET registered_students = registered_students + 1
        WHERE id = @SectionId;

        COMMIT TRANSACTION;
        PRINT N'[SESSION 1] Đăng ký thành công (nhưng có thể đã vượt quá slot!)';
    END
    ELSE
    BEGIN
        ROLLBACK TRANSACTION;
        PRINT N'[SESSION 1] Rollback - không còn slot';
    END

    -- Kiểm tra kết quả cuối
    SELECT
        cs.id AS section_id,
        cs.maximum_students,
        cs.registered_students,
        cs.maximum_students - cs.registered_students AS slots_remaining,
        CASE
            WHEN cs.registered_students > cs.maximum_students
            THEN N'⚠ LỖI PHANTOM: Vượt quá số lượng sinh viên!'
            ELSE N'OK'
        END AS trang_thai
    FROM CourseSection cs
    WHERE cs.id = @SectionId;
END
GO

-- ============================================================
-- BƯỚC 3: SESSION 2 - Đăng ký chen vào trong lúc Session 1 delay
-- Chạy TRONG VÒNG 10 GIÂY sau khi Session 1 bắt đầu
-- ============================================================

CREATE OR ALTER PROCEDURE sp_demo_phantom_session2
AS
BEGIN
    DECLARE @StudentId INT = 4;  -- Student 4 đăng ký (khác student 3)
    DECLARE @SectionId INT = 1;

    PRINT N'[SESSION 2] Đang đăng ký vào section đang có 1 slot...';

    -- Đăng ký trực tiếp không qua validate
    INSERT INTO CourseRegistration
    (student_id, section_id, registration_date, status)
    VALUES
    (@StudentId, @SectionId, GETDATE(), 'REGISTERED');

    UPDATE CourseSection
    SET registered_students = registered_students + 1
    WHERE id = @SectionId;

    PRINT N'[SESSION 2] Đăng ký thành công - đã chiếm slot cuối cùng!';

    SELECT
        id AS section_id,
        maximum_students,
        registered_students,
        maximum_students - registered_students AS slots_remaining
    FROM CourseSection
    WHERE id = @SectionId;
END
GO

-- ============================================================
-- BƯỚC 4: KIỂM TRA KẾT QUẢ SAU DEMO
-- ============================================================

CREATE OR ALTER PROCEDURE sp_phantom_check_result
AS
BEGIN
    PRINT N'=== KẾT QUẢ SAU DEMO PHANTOM READ ===';

    SELECT
        cs.id AS section_id,
        cs.maximum_students,
        cs.registered_students,
        CASE
            WHEN cs.registered_students > cs.maximum_students
            THEN N'⚠ LỖI PHANTOM XẢY RA: registered > maximum!'
            ELSE N'Bình thường'
        END AS ket_qua
    FROM CourseSection cs
    WHERE cs.id = 1;

    PRINT N'=== DANH SÁCH ĐĂNG KÝ ===';
    SELECT
        cr.student_id,
        s.full_name AS ten_sinh_vien,
        cr.section_id,
        cr.registration_date,
        cr.status
    FROM CourseRegistration cr
    JOIN Student st ON cr.student_id = st.id
    JOIN [User] s ON st.user_id = s.id
    WHERE cr.section_id = 1
    ORDER BY cr.registration_date;
END
GO

-- ============================================================
-- BƯỚC 5: RESET DATA SAU DEMO
-- ============================================================

CREATE OR ALTER PROCEDURE sp_phantom_reset_demo
AS
BEGIN
    DELETE FROM CourseRegistration
    WHERE student_id IN (3, 4) AND section_id = 1;

    UPDATE CourseSection
    SET registered_students = maximum_students - 1
    WHERE id = 1;

    PRINT N'[RESET] Dữ liệu đã được reset về trạng thái ban đầu';
END
GO

-- ============================================================
-- THỨ TỰ CHẠY DEMO:
--
--   1. EXEC sp_phantom_setup_demo          -- chuẩn bị dữ liệu
--   2. [Session 1] EXEC sp_demo_phantom_session1   -- chạy trước
--   3. [Session 2] EXEC sp_demo_phantom_session2   -- chạy trong 10 giây
--   4. EXEC sp_phantom_check_result        -- xem kết quả lỗi
--   5. EXEC sp_phantom_reset_demo          -- reset sau khi demo xong
-- ============================================================