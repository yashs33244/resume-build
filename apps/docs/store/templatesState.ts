import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import { act, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Define the possible template types
type LandingPageTemplateType = 'classic' | 'modern' | 'bold';
type ActualTemplateType = 'fresher' | 'experienced' | 'designer';

// Mapping between landing page names and actual template names
const templateMapping: Record<LandingPageTemplateType, ActualTemplateType> = {
  'classic': 'fresher',
  'modern': 'experienced',
  'bold': 'designer'
};

// Reverse mapping for convenience
const reverseTemplateMapping: Record<ActualTemplateType, LandingPageTemplateType> = {
  'fresher': 'classic',
  'experienced': 'modern',
  'designer': 'bold'
};

// Create a Recoil atom for the selected template (using landing page names)
export const templateAtom = atom<LandingPageTemplateType>({
  key: 'templateAtom',
  default: 'classic',
});

// Create a selector for the actual template type
export const actualTemplateSelector = selector<ActualTemplateType>({
  key: 'actualTemplateSelector',
  get: ({ get }) => {
    const landingPageTemplate = get(templateAtom);
    return templateMapping[landingPageTemplate];
  },
});

// Create a selector for the template class
export const templateClassSelector:any = selector({
  key: 'templateClassSelector',
  get: ({ get }) => {
    const actualTemplate = get(actualTemplateSelector);
    switch (actualTemplate) {
      case 'fresher':
        return 'fresher-template';
      case 'experienced':
        return 'experienced-template';
      case 'designer':
        return 'presentable-template';
      default:
        return 'fresher-template';
    }
  },
});

// Custom hook to ensure component is mounted
const useIsMounted = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return isMounted;
};

// Hook to handle localStorage and URL syncing
export const useTemplateSync = () => {
  const [template, setTemplate] = useRecoilState(templateAtom);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted) {
      // Load from localStorage on client-side
      const storedValue = localStorage.getItem('selectedTemplate');
      if (storedValue && Object.keys(templateMapping).includes(storedValue)) {
        setTemplate(storedValue as LandingPageTemplateType);
      }

      // Sync with URL
      const urlTemplate = searchParams.get('template');
      if (urlTemplate && Object.values(templateMapping).includes(urlTemplate as ActualTemplateType)) {
        setTemplate(reverseTemplateMapping[urlTemplate as ActualTemplateType]);
      }
    }
  }, [isMounted, searchParams]);

  useEffect(() => {
    if (isMounted) {
      // Save to localStorage on every change
      localStorage.setItem('selectedTemplate', template);
    }
  }, [template, isMounted]);

  const setTemplateAndUpdateURL = (newTemplate: LandingPageTemplateType) => {
    setTemplate(newTemplate);
    const actualTemplate = templateMapping[newTemplate];
  };

  return { template, setTemplateAndUpdateURL};
};

// Export the setTemplateAndUpdateURL function separately
export const useSetTemplateAndUpdateURL = () => {
  const { setTemplateAndUpdateURL } = useTemplateSync();
  return setTemplateAndUpdateURL;
};