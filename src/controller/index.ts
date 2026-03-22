import { useState } from "react";
import { GameState } from "../types";

export const STORAGE_KEY = "JEOPARDY_GAME_STATE";

const saveState = (gameState: GameState) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
};

const getState = (): GameState => {
  const stateString = window.localStorage.getItem(STORAGE_KEY);
  if (!stateString) return {};
  return JSON.parse(stateString);
};

export const useLocalState =
  (key: keyof GameState) =>
  <State>(defaultValue: State): [State, (value: State) => void] => {
    const localState = getState()[key] as State;
    const [state, baseUpdateState] = useState(localState ?? defaultValue);

    const updateState = (value: State) => {
      let localState = getState();
      localState[key] = value;
      saveState(localState);
      return baseUpdateState(value);
    };
    return [state, updateState];
  };
