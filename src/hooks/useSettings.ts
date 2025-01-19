import { create } from "zustand";
import type { GameType, Settings } from '../types/types'

export const useSettings = create<Settings>((set) => ({
    soundEnabled: true,
    timerEnabled: true,
    scoreEnabled: true,
    rigidInterval: null,
    gameType: 'ANARCHY',
    enableSound: (enabled: boolean) => set({ soundEnabled: enabled }),
    enableScore: (enabled: boolean) => set({scoreEnabled: enabled}),
    showTimer: (show: boolean) => set({ timerEnabled:show }),
    toggleInterval: (i: number | null) => set({ rigidInterval: i }),
    setGameType: (g: GameType) => set({ gameType: g })
}))
