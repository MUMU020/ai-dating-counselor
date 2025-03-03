"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

export default function Page() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null); // 로그인한 사용자 저장
    const router = useRouter();

    useEffect(() => {
        // 로그인 상태 감지
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                router.push("/");
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (isRegistering) {
                await createUserWithEmailAndPassword(auth, email, password);
                alert("회원가입 성공!");
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                alert("로그인 성공!");
            }
            router.push("/"); // 로그인 성공 후 홈으로 이동
        } catch (error: any) {
            console.error(error);
            alert("오류 발생: " + error.message);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert("로그아웃 되었습니다!");
            setUser(null);
            router.push("/login"); // 로그아웃 후 로그인 페이지로 이동
        } catch (error) {
            console.error("로그아웃 오류:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            {user ? (
                // 로그인한 경우 로그아웃 UI 표시
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">AI 연애 상담소 💬</h1>
                    <p>로그인된 상태입니다. ({user.email})</p>
                    <button 
                        onClick={handleLogout} 
                        className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg"
                    >
                        로그아웃
                    </button>
                </div>
            ) : (
                // 로그인되지 않은 경우 로그인/회원가입 UI 표시
                <>
                    <h1 className="text-2xl font-bold mb-4">{isRegistering ? "회원가입" : "로그인"}</h1>
                    
                    <input
                        type="email"
                        placeholder="이메일 입력"
                        className="p-2 border rounded bg-gray-800 text-white w-64"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    
                    <input
                        type="password"
                        placeholder="비밀번호 입력"
                        className="p-2 border rounded bg-gray-800 text-white w-64 mt-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    
                    <button 
                        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50" 
                        onClick={handleSubmit} 
                        disabled={loading}
                    >
                        {loading ? "처리 중..." : isRegistering ? "회원가입" : "로그인"}
                    </button>
                    
                    <button className="text-sm text-gray-400 mt-2" onClick={() => setIsRegistering(!isRegistering)}>
                        {isRegistering ? "로그인으로 전환" : "회원가입으로 전환"}
                    </button>
                </>
            )}
        </div>
    );
}
