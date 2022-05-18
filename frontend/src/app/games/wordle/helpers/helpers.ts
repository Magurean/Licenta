export interface Try {
    letters: Letter[];
}

export interface Letter {
    text: string;
    state: LetterState;
}

export enum LetterState {
    Wrong,
    PartialMatch,
    FullMatch,
    Pending,
}

export const letters = (() => {
    const ret: { [key: string]: boolean } = {};
    for (let charCode = 97; charCode < 97 + 26; charCode++) {
        ret[String.fromCharCode(charCode)] = true;
    }
    return ret;
})();