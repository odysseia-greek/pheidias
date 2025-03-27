import Cookies from 'universal-cookie';
import { v4 as uuidv4 } from 'uuid';

const cookies = new Cookies();
const COOKIE_NAME = 'boule';

export function useBouleId() {
    const cookie = cookies.get(COOKIE_NAME);
    if (!cookie || typeof cookie !== 'object' || !cookie.sessionId) {
        const newSession = {
            sessionId: uuidv4(),
            progress: {
                streak: 0,
                totalPlayed: 0,
                totalMistakes: 0,
            }
        };
        cookies.set(COOKIE_NAME, newSession, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        return newSession.sessionId;
    }

    return cookie.sessionId;
}

export function saveProgress({ streak, totalPlayed, totalMistakes }) {
    let cookie = cookies.get(COOKIE_NAME);

    if (!cookie || typeof cookie !== 'object') {
        // Create new cookie with progress block if missing or malformed
        cookie = { progress: {} };
    }

    cookie.progress.streak = streak;
    cookie.progress.totalPlayed = totalPlayed;
    cookie.progress.totalMistakes = totalMistakes;

    cookies.set(COOKIE_NAME, cookie, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
    });
}

export function getProgress() {
    const cookie = cookies.get(COOKIE_NAME);

    if (!cookie || typeof cookie !== 'object') {
        return { streak: 0, totalPlayed: 0 };
    }

    return {
        streak: cookie.progress?.streak || 0,
        totalPlayed: cookie.progress?.totalPlayed || 0,
        totalMistakes: cookie.progress?.totalMistakes || 0,
    };
}

