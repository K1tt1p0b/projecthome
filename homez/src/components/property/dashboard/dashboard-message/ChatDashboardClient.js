"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchBox from "@/components/property/dashboard/dashboard-message/SearchBox";
import UserInboxList from "@/components/property/dashboard/dashboard-message/UserInboxList";
import UserChatBoxContent from "@/components/property/dashboard/dashboard-message/UserChatBoxContent";
import propertyData from "@/data/propertyData";

const ChatDashboardClient = () => {
    const searchParams = useSearchParams();
    const interestPropertyId = searchParams.get("interest_property");

    // State เก็บรายชื่อคนคุย
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

    const [activeUser, setActiveUser] = useState(null);

    // ✅ เพิ่มฟังก์ชันลบตรงนี้
    const handleDeleteChat = (idToDelete) => {
        setUsers((prevUsers) => prevUsers.filter(user => user.id !== idToDelete));

        if (activeUser && activeUser.id === idToDelete) {
            setActiveUser(null);
        }
    };

    // Logic: สร้างแชทใหม่จาก URL
    useEffect(() => {
        console.log("Interest ID from URL:", interestPropertyId);

        if (interestPropertyId) {
            const targetProperty = propertyData.find((p) => String(p.id) === String(interestPropertyId));
            console.log("Found Property:", targetProperty);

            if (targetProperty) {
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

                    setUsers((prevUsers) => {
                        const alreadyInList = prevUsers.find(u => u.name === newUser.name);
                        if (alreadyInList) return prevUsers;
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
                    {/* ✅ ส่ง onDelete ไปให้ลูกใช้ */}
                    <UserChatBoxContent
                        activeUser={activeUser}
                        onDelete={handleDeleteChat}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatDashboardClient;