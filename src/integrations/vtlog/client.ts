import { supabase } from "../supabase/client";

const VTLOG_TOKEN = "cd1e9d5face6919f84305ff0366e2925787e8c3e1ad6659df219d4524a4874ef";
const VTC_ID = 8118;
const API_BASE_URL = "https://api.vtlog.net/v1";

export interface VtlogMember {
    name: string;
    steam_id: string;
    avatar: string;
    cover: string;
    created_at: string;
    member_since: string;
    role: string;
}

export interface VtlogUserStats {
    steam_id: string;
    username: string;
    avatar?: string;
    experience: number;
    level: number;
    financial: {
        income: number;
        expense: number;
        profit: number;
    };
}

export interface RankedDriver {
    id: string; // steam_id
    nickname: string;
    nome: string; // usually role or same as nickname
    pontos: number; // based on experience
    avatar?: string;
    rank?: number;
    lucro?: number;
    level?: number;
}

export interface VtlogCompanyStats {
    experience: number;
    level: number;
    financial: {
        income: number;
        expense: number;
        profit: number;
    };
    memberCount: number;
}

export const fetchVtlogStats = async (): Promise<VtlogCompanyStats | null> => {
    try {
        const res = await fetch(`${API_BASE_URL}/vtc/${VTC_ID}`, {
            headers: { Authorization: `Bearer ${VTLOG_TOKEN}` },
        });
        if (!res.ok) return null;

        const data = await res.json();

        // Let's also fetch members count quickly
        const membersRes = await fetch(`${API_BASE_URL}/vtc/${VTC_ID}/members`, {
            headers: { Authorization: `Bearer ${VTLOG_TOKEN}` },
        });
        let count = 0;
        if (membersRes.ok) {
            const members = await membersRes.json();
            count = members.length;
        }

        return {
            experience: data.experience || 0,
            level: data.level || 0,
            financial: data.financial || { income: 0, expense: 0, profit: 0 },
            memberCount: count,
        };
    } catch {
        return null; // fallback
    }
};

export const fetchVtlogRanking = async (): Promise<RankedDriver[]> => {
    try {
        // 1. Fetch all members
        const membersRes = await fetch(`${API_BASE_URL}/vtc/${VTC_ID}/members`, {
            headers: {
                Authorization: `Bearer ${VTLOG_TOKEN}`,
            },
        });

        if (!membersRes.ok) {
            throw new Error("Failed to fetch VTLOG members");
        }

        const members: VtlogMember[] = await membersRes.json();

        // 2. Fetch stats for each member concurrently
        const statsPromises = members.map(async (member) => {
            try {
                const statRes = await fetch(`${API_BASE_URL}/user/${member.steam_id}`);
                if (!statRes.ok) return null;

                const stats: VtlogUserStats = await statRes.json();
                return {
                    member,
                    stats,
                };
            } catch (err) {
                console.error(`Error fetching stats for ${member.steam_id}`, err);
                return null;
            }
        });

        const membersWithStats = await Promise.all(statsPromises);

        // 3. Map to our ranking structure, filter failed ones, and sort by experience
        const ranking: RankedDriver[] = membersWithStats
            .filter((m): m is { member: VtlogMember; stats: VtlogUserStats } => m !== null)
            .map(({ member, stats }) => {
                return {
                    id: member.steam_id,
                    nickname: member.name,
                    nome: member.role,
                    avatar: stats.avatar !== "https://uploads.vtlog.net/user-avatar/default-avatar.png" ? stats.avatar : member.avatar,
                    pontos: Math.floor(stats.experience),
                    lucro: stats.financial?.profit || 0,
                    level: stats.level || 0,
                };
            })
            .sort((a, b) => b.pontos - a.pontos); // Sort descending

        return ranking;
    } catch (error) {
        console.error("VTLOG Fetch Error:", error);
        return [];
    }
};
