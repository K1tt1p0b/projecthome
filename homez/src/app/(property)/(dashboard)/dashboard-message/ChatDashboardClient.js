"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchBox from "@/components/property/dashboard/dashboard-message/SearchBox";
import UserInboxList from "@/components/property/dashboard/dashboard-message/UserInboxList";
import UserChatBoxContent from "@/components/property/dashboard/dashboard-message/UserChatBoxContent";

// ✅ 1. ดึงข้อมูลจริงมาใช้ (เพื่อให้ ID ตรงกับหน้า Listing แน่นอน)
import propertyData from "@/data/propertyData";

const ChatDashboardClient = () => {
    const searchParams = useSearchParams();
    const interestPropertyId = searchParams.get("interest_property");

    // State เก็บรายชื่อคนคุย (Mock เริ่มต้น)
    const [users, setUsers] = useState([
        {
            id: 1,
            name: "Darlene Robertson",
            image: "/images/inbox/ms1.png",
            message: "สอบถามเรื่องบ้านเดี่ยว...",
            time: "35 mins",
            status: "online",
            notif: 2,
        },
        {
            id: 2,
            name: "Jane Cooper",
            image: "/images/inbox/ms2.png",
            message: "ขอบคุณครับ",
            time: "1 hr",
            status: "away",
            notif: 0,
        },
    ]);

    const [activeUser, setActiveUser] = useState(null); // เริ่มต้นยังไม่เลือกใคร

    // Logic: สร้างแชทใหม่จาก URL
    useEffect(() => {
        // 🔍 Debug: เช็คว่า ID ส่งมาไหม (กด F12 ดู Console)
        console.log("Interest ID from URL:", interestPropertyId);

        if (interestPropertyId) {
            // ✅ 2. ค้นหาจากข้อมูลจริง (propertyData)
            // แปลงเป็น String ทั้งคู่ก่อนเทียบ เพื่อความชัวร์
            const targetProperty = propertyData.find((p) => String(p.id) === String(interestPropertyId));

            console.log("Found Property:", targetProperty); // 🔍 ดูว่าเจอทรัพย์ไหม

            if (targetProperty) {
                // เช็คว่าเคยคุยกันยัง (Mock เช็คจากชื่อทรัพย์ที่อยู่ในชื่อคน)
                const isExist = users.find((u) => u.name.includes(targetProperty.title));

                if (!isExist) {
                    const newUser = {
                        id: Date.now(),
                        name: `เจ้าของ: ${targetProperty.title}`,
                        image: targetProperty.imageSrc || "/images/inbox/ms3.png",
                        message: "สนใจทรัพย์รหัส " + targetProperty.id,
                        time: "เมื่อสักครู่",
                        status: "online",
                        notif: 1,
                    };

                    // ❌ ของเดิม: setUsers((prev) => [newUser, ...prev]); 
                    // (แบบเดิมมันยัดเลย ไม่เช็คว่ามีของเก่าซ้ำไหมในวินาทีนั้น)

                    // ✅ แก้เป็นแบบนี้: เช็คซ้ำอีกทีก่อนยัดเข้า State
                    setUsers((prevUsers) => {
                        // เช็คว่าใน list ปัจจุบัน มีคนชื่อนี้หรือยัง?
                        const alreadyInList = prevUsers.find(u => u.name === newUser.name);

                        // ถ้ามีแล้ว ให้คืนค่าเดิมกลับไป (ไม่เพิ่ม)
                        if (alreadyInList) return prevUsers;

                        // ถ้ายังไม่มี ค่อยเพิ่มตัวใหม่เข้าไป
                        return [newUser, ...prevUsers];
                    });

                    setActiveUser(newUser);
                } else {
                    setActiveUser(isExist);
                }
            }
        }
    }, [interestPropertyId]);

    return (
        <div className="row mb40">
            {/* กล่องซ้าย */}
            <div className="col-lg-5 col-xl-4">
                <div
                    className="bg-white border rounded-4 shadow-sm overflow-hidden d-flex flex-column h-100"
                    style={{ maxHeight: "80vh", minHeight: "600px" }}
                >
                    <div className="p-3 border-bottom bg-white">
                        <h4 className="mb-3 fw-bold">Chats</h4>
                        <SearchBox />
                    </div>
                    <div className="flex-grow-1 overflow-auto custom-scrollbar">
                        {/* ส่ง props ไปให้ List */}
                        <UserInboxList
                            data={users}
                            activeUser={activeUser}
                            setActiveUser={setActiveUser}
                        />
                    </div>
                </div>
            </div>

            {/* กล่องขวา */}
            <div className="col-lg-7 col-xl-8">
                <div
                    className="bg-white border rounded-4 shadow-sm overflow-hidden h-100"
                    style={{ maxHeight: "80vh", minHeight: "600px" }}
                >
                    {/* ส่ง props ไปให้ Content */}
                    <UserChatBoxContent activeUser={activeUser} />
                </div>
            </div>
        </div>
    );
};

export default ChatDashboardClient;