"use client";  // ✅ 클라이언트 컴포넌트 선언

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseConfig";  // ✅ auth 가져오는 방식 수정
import { onAuthStateChanged, signOut, User } from "firebase/auth";

export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);  // ✅ 로그아웃 기능 정상 작동
            alert("로그아웃 되었습니다!");
            router.push("/login");
        } catch (error) {
            console.error("로그아웃 오류:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <p>로딩 중...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-2xl font-bold mb-4">AI 연애 상담소 💬</h1>

            {user ? (
                <>
                    <p>로그인된 상태입니다. ({user.email})</p>
                    <button 
                        onClick={handleLogout} 
                        className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg"
                    >
                        로그아웃
                    </button>
                </>
            ) : (
                <>
                    <p>로그인이 필요합니다.</p>
                    <button 
                        onClick={() => router.push("/login")}
                        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
                    >
                        로그인하기
                    </button>
                </>
            )}
        </div>
    );
}
