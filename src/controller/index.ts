import { useState } from 'react';
import { GameState } from '../types';

const GAME_STATE = "JEOPARDY_GAME_STATE";

const saveState = (gameState: GameState) => {
    window.localStorage.setItem(GAME_STATE, JSON.stringify(gameState))
}

const getState = (): GameState => {
    const stateString = window.localStorage.getItem(GAME_STATE);
    if (!stateString) return {}
    return JSON.parse(stateString)
}

export const useLocalState = (key: keyof GameState) => <State>(defaultValue: State): [State, (value: State) => void] => {
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