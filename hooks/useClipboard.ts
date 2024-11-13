import {useCallback} from 'react';

export function useClipboard() {
    const copyToClipboard = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (error) {
            console.error(error);
        }
    }, []);

    return {copyToClipboard};
}
