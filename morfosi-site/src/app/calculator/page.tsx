import type { Metadata } from 'next';
import CalculatorWizard from '@/components/calculator/CalculatorWizard';

export const metadata: Metadata = {
  title: 'Υπολογισμός Μορίων | Μόρφωση Φροντιστήριο',
  description: 'Υπολογίστε τα μόριά σας με ακρίβεια βάσει των νέων συντελεστών βαρύτητας.',
};

export default function CalculatorPage() {
  return (
    <main className="min-h-screen bg-white">
       {/* Small header block could go here, but the wizard handles its own header area */}
       <CalculatorWizard />
    </main>
  );
}
