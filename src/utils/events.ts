export const handleEnterPress = (e: React.KeyboardEvent, callback: () => void) => {
    const isEnter = e.key === 'Enter';

    if (isEnter) {
        callback();
    }
}