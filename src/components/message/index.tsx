import './styles.scss';

type MessageProps = {
    attempt?: number,
    combination?: string,
    message: string
    type?: 'info' | 'warn' | 'success'
}

export function Message({attempt, combination, message, type}: MessageProps) {
    return (
        <li className={type || 'info'}>
            { attempt && <span>#{String(attempt).padStart(2, '0')}</span> } 
            { combination && <span> - {combination} - </span> }
            <span>{message}</span>
        </li>
    );
}