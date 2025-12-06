import { useState } from 'react';

const GAME_STATE = "JEOPARDY_GAME_STATE";

export const STATE_KEY = {
    GAME_STATUS: 'gameStatus',
    CATEGORY: 'category',
    QUESTIONS: 'questions',
    TEAMS: 'teams',
} as const 

const saveState = (gameState) => {
    window.localStorage.setItem(GAME_STATE, JSON.stringify(gameState))
}

const getState = () => {
    const stateString = window.localStorage.getItem(GAME_STATE);
    if (!stateString) return {}
    return JSON.parse(stateString)
}

export const useLocalState = (key: string) => <State>(defaultValue: State): [State, (value: State) => void] => {
    const localState = getState()[key] as State;
    const [state, baseUpdateState] = useState(localState ?? defaultValue)

    const updateState = (value: State) => {
        let localState = getState();
        localState[key] = value
        saveState(localState)
        return baseUpdateState(value)
    }
    return [state, updateState]
}