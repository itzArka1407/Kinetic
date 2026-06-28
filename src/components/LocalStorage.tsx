import { useEffect, useState } from "react";

function useLocalStorage<T>(key: string, init_val: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    // Load the data from storage(if present)
    const [val, setVal] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : init_val;
        } catch (err) {
            console.warn(`Error ${err} occured during reading "${key}"`);
            return init_val;
        }
    });

    // Whenever the value changes, update the storage
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(val));
        } catch (err) {
            console.warn(`Err: ${err} while writing to "${key}"`);
        }
    }, [key, val]);

    return [val, setVal];
}

export default useLocalStorage;
