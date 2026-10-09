import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CompanyPicker } from './CompanyPicker';
import { LoanAmountInput } from './LoanAmountInput';
import { ResearchLoadingState } from './ResearchLoadingState';
import { useCompanyResearch } from '../../hooks/useCompanyResearch';
import { DEFAULT_LOAN_AMOUNT_INR } from '../../lib/constants';

export function AnalysisRequestForm() {
  const [companyName, setCompanyName] = useState('');
  const [loanAmountInr, setLoanAmountInr] = useState(DEFAULT_LOAN_AMOUNT_INR);
  const { status, loadingMessage, runResearch } = useCompanyResearch();

  const isLoading = status === 'loading';

  function handleSubmit(event) {
    event.preventDefault();

    if (companyName.trim().length < 2) {
      toast.error('Enter a company name to research.');
      return;
    }
    if (!loanAmountInr || loanAmountInr <= 0) {
      toast.error('Enter a loan amount greater than zero.');
      return;
    }

    runResearch({ companyName: companyName.trim(), loanAmountInr });
  }

  return (
    <Card id="start-analysis" className="scroll-mt-24 p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <CompanyPicker value={companyName} onChange={setCompanyName} disabled={isLoading} />
        <LoanAmountInput value={loanAmountInr} onChange={setLoanAmountInr} disabled={isLoading} />

        <Button type="submit" size="lg" loading={isLoading} className="w-full">
          {isLoading ? 'Researching…' : 'Run Credit Analysis'}
          {!isLoading && <ArrowRight className="size-4" />}
        </Button>

        <p className="text-center text-xs text-ink-400">
          Pulls filings, exchange data and corporate announcements — every figure traced to a
          source.
        </p>
      </form>

      {isLoading && <ResearchLoadingState message={loadingMessage} />}
    </Card>
  );
}
