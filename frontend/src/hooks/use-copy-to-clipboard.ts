type CopyFn = (text: string) => Promise<boolean>;

type ReturnType = {
  copy: CopyFn;
};

export function useCopyToClipboard(): ReturnType {

  const copy: CopyFn = async (text) => {

    if (!navigator?.clipboard) {
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      return true;
    }
    catch (error) {
      console.warn('Copy failed', error);
      return false;
    }
  };

  return { copy };
}
