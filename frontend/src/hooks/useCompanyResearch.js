import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { requestCompanyResearch } from '../lib/researchApi';
import { saveResearchResult } from '../lib/researchResultStore';

const LOADING_MESSAGES = [
  'Locating filings & exchange disclosures…',
  'Reading five years of financial statements…',
  'Cross-checking figures across sources…',
  'Flagging discrepancies and assumptions…',
  'Compiling the research dossier…',
];

const LOADING_MESSAGE_INTERVAL_MS = 4000;

/**
 * Owns the full lifecycle of a research request: submission, a rotating
 * "what's happening right now" message for the long wait, toast feedback,
 * and the resulting data - so the form component only has to render state,
 * not manage it.
 */
export function useCompanyResearch() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (status !== 'loading') {
      clearInterval(intervalRef.current);
      setLoadingMessageIndex(0);
      return undefined;
    }

    intervalRef.current = setInterval(() => {
      setLoadingMessageIndex((index) => (index + 1) % LOADING_MESSAGES.length);
    }, LOADING_MESSAGE_INTERVAL_MS);

    return () => clearInterval(intervalRef.current);
  }, [status]);

  async function runResearch({ companyName, loanAmountInr }) {
    setStatus('loading');
    setResult(null);

    const toastId = toast.loading(`Researching ${companyName}…`);

    try {
      const data = await requestCompanyResearch({ companyName, loanAmountInr });
      setResult(data);
      setStatus('success');
      saveResearchResult(data);

      if (!data.meta.groundedWithLiveSearch) {
        toast(`${companyName} researched, but without live web search - figures may be out of date.`, {
          id: toastId,
          icon: '⚠️',
        });
      } else {
        toast.success(`${companyName} researched successfully.`, { id: toastId });
      }

      navigate('/analysis', { state: { result: data } });
    } catch (error) {
      setStatus('error');
      toast.error(error.message, { id: toastId });
    }
  }

  function reset() {
    setStatus('idle');
    setResult(null);
  }

  return {
    status,
    result,
    loadingMessage: LOADING_MESSAGES[loadingMessageIndex],
    runResearch,
    reset,
  };
}
