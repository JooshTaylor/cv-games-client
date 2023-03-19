type StorageType = 'session' | 'local';

const useStorage = (type: StorageType) => {
  const isBrowser: boolean = ((): boolean => typeof window !== 'undefined')();

  const getItem = (key: string): string => {
    const storageType: 'localStorage' | 'sessionStorage' = `${type ?? 'session'}Storage`;
    return isBrowser ? window[storageType][key] : '';
  };

  function setItem(key: string, value: string): void {
    const storageType: 'localStorage' | 'sessionStorage' = `${type ?? 'session'}Storage`;
    window[storageType].setItem(key, value);
  }

  function removeItem(key: string): void {
    const storageType: 'localStorage' | 'sessionStorage' = `${type ?? 'session'}Storage`;
    window[storageType].removeItem(key);
  }

  return {
    getItem,
    setItem,
    removeItem
  };
};

export default useStorage;