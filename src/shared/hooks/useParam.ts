import { useRouter } from 'next/router';

export const useParam = (param: string, getFallback?: Function) => {
  const router = useRouter();

  const value = router.query[param];

  if (!value)
    return getFallback ? getFallback() : value;

  const returnValue = Array.isArray(value) ? value[0] : value;

  return getFallback ? getFallback() : value;
};