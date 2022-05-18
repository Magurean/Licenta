import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { UserService } from 'src/app/user.service';
import { User } from 'src/app/userModel';
import { Letter, letters, LetterState, Try } from './helpers/helpers';
import { words } from './helpers/words';

@Component({
  selector: 'app-wordle',
  templateUrl: './wordle.component.html',
  styleUrls: ['./wordle.component.scss']
})
export class WordleComponent implements OnInit {
  @ViewChildren('tryContainer') tryContainers!: QueryList<ElementRef>;
  user: User;
  isLogged: boolean;
  isGameOver: boolean;
  letterState = LetterState;
  curLetterStates: { [key: string]: LetterState };
  currentLetterIndex: number;
  maxTries: number = 6;
  triesEntered: number;
  tries: Try[] = [];
  answer: string = '';
  answerLetterCounts: { [letter: string]: number } = {};
  won: boolean;
  wordLength: number = 5;
  keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace', 'Enter'],
  ];

  constructor(private snackBarService: SnackBarService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.initGame()
  }

  initGame() {
    this.curLetterStates = {}
    this.currentLetterIndex = 0;
    this.triesEntered = 0;
    this.won = false;
    this.isGameOver = false;
    this.tries = [];

    for (let i = 0; i < this.maxTries; i++) {
      const letters: Letter[] = [];
      for (let j = 0; j < this.wordLength; j++) {
        letters.push({ text: '', state: LetterState.Pending });
      }
      this.tries.push({ letters });
    }
    this.answer = words[this.random(1, words.length)].toLowerCase();

    for (const letter of this.answer) {
      if (this.answerLetterCounts[letter] == null) {
        this.answerLetterCounts[letter] = 0;
      }
      this.answerLetterCounts[letter]++;
    }
    console.log('raspunsul: ', this.answer);
  }

  random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  @HostListener('document:keydown', ['$event']) handleKeyboardEvent(event: KeyboardEvent) {
    this.handleClickKey(event.key);
  }

  getKeyClass(key: string): string {
    const state = this.curLetterStates[key.toLowerCase()];
    switch (state) {
      case LetterState.FullMatch:
        return 'match key';
      case LetterState.PartialMatch:
        return 'partial key';
      case LetterState.Wrong:
        return 'wrong key';
      default:
        return 'key';
    }
  }

  handleClickKey(key: string) {
    if (this.won) {
      return;
    }

    if (letters[key.toLowerCase()]) {
      if (this.currentLetterIndex < (this.triesEntered + 1) * this.wordLength) {
        this.setLetter(key);
        this.currentLetterIndex++;
      }
    }
    else if (key === 'Backspace') {
      if (this.currentLetterIndex > this.triesEntered * this.wordLength) {
        this.currentLetterIndex--;
        this.setLetter('');
      }
    }
    else if (key === 'Enter') {
      this.checkCurrentTry();
    }
  }

  setLetter(letter: string) {
    const tryIndex = Math.floor(this.currentLetterIndex / this.wordLength);
    const letterIndex = this.currentLetterIndex - tryIndex * this.wordLength;
    this.tries[tryIndex].letters[letterIndex].text = letter;
  }

  async checkCurrentTry() {
    const currentTry = this.tries[this.triesEntered];
    const answerLetterCounts = { ...this.answerLetterCounts };
    const states: LetterState[] = [];
    const tryContainer = this.tryContainers.get(this.triesEntered)?.nativeElement as HTMLElement;
    const letterElements = tryContainer.querySelectorAll('.letter-container');
    const wordInCurrentTry = currentTry.letters.map(letter => letter.text).join('').toLowerCase();

    if (currentTry.letters.some(letter => letter.text === '')) {
      this.snackBarService.openSnackBar('Not enough letters', 'X');
      return;
    }

    if (!words.includes(wordInCurrentTry)) {
      this.snackBarService.openSnackBar('Not in word list', 'X');
      return;
    }
    this.triesEntered++;

    for (let i = 0; i < this.wordLength; i++) {
      const currentLetter = currentTry.letters[i].text.toLowerCase();
      let state = LetterState.Wrong;
      if (this.answer[i] === currentLetter
        && answerLetterCounts[currentLetter] > 0) {
        answerLetterCounts[this.answer[i]]--;
        state = LetterState.FullMatch;
      } else if (
        this.answer.includes(currentLetter)
        && answerLetterCounts[currentLetter] > 0) {
        answerLetterCounts[currentLetter]--;
        state = LetterState.PartialMatch;
      }
      states.push(state);
    }

    for (let i = 0; i < letterElements.length; i++) {
      letterElements[i].classList.add('fold');
      currentTry.letters[i].state = states[i];
      letterElements[i].classList.remove('fold');
    }
    for (let i = 0; i < this.wordLength; i++) {
      const currentLetter = currentTry.letters[i].text.toLowerCase();
      if (this.curLetterStates[currentLetter] == null
        || states[i] > this.curLetterStates[currentLetter]) {
        this.curLetterStates[currentLetter] = states[i];
      }
    }

    if (states.every(state => state === LetterState.FullMatch)) {
      this.isGameOver = true;
      this.won = true;
      if (this.isLogged) {
        this.user.wordleGamesPlayed++;
        this.user.wordleGamesWon++;
        this.userService.updateUser(this.user).subscribe(x => { });
      }
      return;
    }

    if (this.triesEntered === this.maxTries) {
      this.isGameOver = true;
      if (this.isLogged) {
        this.user.wordleGamesPlayed++;
        this.userService.updateUser(this.user).subscribe(x => { });
      }
    }
  }
}
