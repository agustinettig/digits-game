import { useEffect, useState } from 'react';
import { Message } from '../message';

import './styles.scss';

type MessageType = {
    attempt?: number;
    message: string;
    combination?: number[],
    type?: 'warn' | 'info' | 'success'
}

export function Game() {
    const [gameFinished, setGameFinished] = useState(false);
    const [code, setCode] =  useState<Array<number | null>>([null, null, null]);
    const [guessedCode, setGuessedCode] = useState<Array<number | null>>([null, null, null]);
    const [attempts, setAttempts] = useState(0);
    const [messages, setMessages] = useState<MessageType[]>([]);

    useEffect(() => {
        createCode();
    }, []);
    
    function createCode() {
        let code1, code2, code3 = 0;
        do {
        code1 = Math.round(Math.random() * 8) + 1;    
        code2 = Math.round(Math.random() * 8) + 1;
        code3 = Math.round(Math.random() * 8) + 1;
        } while (code1 === code2 || code1 === code3 || code2 === code3);
        setCode([code1, code2, code3]);
    }

    function handleSelectNumber(codeNumber: number) {

        const numberIndex = guessedCode.indexOf(codeNumber);
        if (numberIndex >= 0) {
        const newGuess = [...guessedCode];
        newGuess[numberIndex] = null;
        setGuessedCode(newGuess);
        return;
        }

        const filledNumbers = guessedCode.filter(code => code != null).length;
        if (filledNumbers === 3) {
        return;
        }

        const newGuess = [...guessedCode];
        const indexToAdd = newGuess.indexOf(null);
        newGuess[indexToAdd] = codeNumber;
        setGuessedCode(newGuess);
    }


    function guessContainsNumber(codeNumber: number) {
        return guessedCode.indexOf(codeNumber) >= 0;
    }

    function handleClearGuess() {
        setGuessedCode([null, null, null]);
    }

    function handleReset() {
        setMessages([]);
        createCode();
        setAttempts(0);
        handleClearGuess();
        setGameFinished(false);
    }

    function handleVerify() {
        const filledNumbers = guessedCode.filter(code => code != null).length;
        if (filledNumbers !== 3) {
            return;
        }

        const currentAttempt = attempts + 1;
        setAttempts(currentAttempt);

        let correctNumbersInTheRightPosition = 0;
        let correctNumbersInTheWrongPosition = 0;
        
        guessedCode.forEach((number, index) => {
            const numberIndexInCode = code.indexOf(number as any);
            
            if (numberIndexInCode >= 0) {
            index === numberIndexInCode
                ? correctNumbersInTheRightPosition++
                : correctNumbersInTheWrongPosition++;          
            }
        });
        
        const rightMessages = ['',
                                'one number correct in the right position',
                                'two numbers correct in the right position',
                                'all numbers in the right position!!'
                                ];

        const wrongMessages = ['',
                                'one number correct, but in the wrong position',
                                'two numbers correct, but in the wrong position',
                                'three numbers correct, but in the wrong position'
                                ];
                                
        let message = '';

        if (correctNumbersInTheRightPosition === 0 && correctNumbersInTheWrongPosition === 0) {
            message = 'None of those numbers are in the combination';
        } else {
            message = 'You got ';
            message += rightMessages[correctNumbersInTheRightPosition];
            if (correctNumbersInTheWrongPosition > 0) {        
            correctNumbersInTheRightPosition > 0 
                ?  message += (' and ' + wrongMessages[correctNumbersInTheWrongPosition])
                : message += wrongMessages[correctNumbersInTheWrongPosition];
            }
        }              

        const newMessage = {
            attempt: currentAttempt, 
            combination: guessedCode as number[],
            message,
        };
        setMessages([...messages, newMessage]);

        
        if (correctNumbersInTheRightPosition === 3) {
            const message: MessageType= {
                message: 'Congratulations! 🥳',
                type: 'success'
            }
            setMessages(state => [...state, message]);
            setGameFinished(true);
            return;
        }
        
        handleClearGuess();

        if (currentAttempt >= 10) {
            const message: MessageType= {
                message: 'Max attempts reached, restart the game to try again 🙁',
                type: 'warn'
            }
            setMessages(state => [...state, message]);
            setGameFinished(true);
        }

    }

    return (
        <main>
            <p className="selected-numbers">
                <span>{guessedCode[0]} </span>
                <span>{guessedCode[1]}</span>
                <span>{guessedCode[2]}</span>
            </p>
            <div className="number-grid">
                <button className={guessContainsNumber(1) ? 'selected' : ''} onClick={() => handleSelectNumber(1)}>1</button>
                <button className={guessContainsNumber(2) ? 'selected' : ''} onClick={() => handleSelectNumber(2)}>2</button>
                <button className={guessContainsNumber(3) ? 'selected' : ''} onClick={() => handleSelectNumber(3)}>3</button>
                <button className={guessContainsNumber(4) ? 'selected' : ''} onClick={() => handleSelectNumber(4)}>4</button>
                <button className={guessContainsNumber(5) ? 'selected' : ''} onClick={() => handleSelectNumber(5)}>5</button>
                <button className={guessContainsNumber(6) ? 'selected' : ''} onClick={() => handleSelectNumber(6)}>6</button>
                <button className={guessContainsNumber(7) ? 'selected' : ''} onClick={() => handleSelectNumber(7)}>7</button>
                <button className={guessContainsNumber(8) ? 'selected' : ''} onClick={() => handleSelectNumber(8)}>8</button>
                <button className={guessContainsNumber(9) ? 'selected' : ''} onClick={() => handleSelectNumber(9)}>9</button>
            </div>
            <div className="game-control">
                <button className="reset" onClick={handleReset}>Restart</button>
                <button className="cancel" onClick={handleClearGuess} disabled={gameFinished}>Clear</button>
                <button className="confirm" onClick={handleVerify} disabled={gameFinished}>Verify</button>
            </div>
            <ul>
                {
                    messages.map(message => 
                        <Message 
                            key={message.attempt + message.message} 
                            attempt={message.attempt}
                            combination={message.combination?.toString()}
                            type={message.type}
                            message={message.message} />)
                }
            </ul>
            
        </main>
    );
}
