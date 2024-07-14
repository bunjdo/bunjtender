import {useEffect, useState} from "react";

export function useAudio(url: string): [boolean, (playing: boolean) => void] {
    const [audio] = useState(new Audio(url));
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
            playing ? audio.play().catch(function(error) {
                console.log(error);
            }) : audio.pause();
        },
        [audio, playing]
    );

    useEffect(() => {
        audio.addEventListener('ended', () => setPlaying(false));
        return () => {
            audio.removeEventListener('ended', () => setPlaying(false));
        };
    }, [audio]);

    return [playing, setPlaying];
}
