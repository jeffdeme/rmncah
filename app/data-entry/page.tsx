'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LgaDataEntryForm() {
  const searchParams = useSearchParams();
  const selectedLga = searchParams.get('lga') || 'Unknown LGA';

  const initialFormState = {
    anc1Early: '',
    iptp2InAnc: '',
    sbaExpectedBirths: '',
    newLarcUsers: '',
    orsZincForDiarrhea: '',
    amoxylDtForPneumonia: '',
    childFeversAsPneumonia: '',
    pnc1And3LiveBirths: '',
    birthRegistrationUnder1: '',
    exclusiveBreastfeeding: '',
    vitaminA: '',
    rdtMicroscopyFeverUnder5: '',
    actTreatmentMalariaChildren: '',
    bcgVaccine: '',
    fullyImmunized: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');

    // Simulate API call
    setTimeout(() => {
      // Replace with your actual API submission logic
      const isSuccess = Math.random() > 0.1; // 90% success rate for demo

      if (isSuccess) {
        console.log(`Submitting data for ${selectedLga}:`, formData);
        setStatus('success');
        setFormData(initialFormState); // Clear form on success
        setTimeout(() => setStatus('idle'), 3000); // Reset status after 3 seconds
      } else {
        setStatus('error');
        setError('An unexpected error occurred. Please try again.');
      }
    }, 1500);
  };

  const isSubmitting = status === 'submitting';

  return (
    <div className="min-h-screen bg-zinc-50 p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold text-zinc-900">Data Entry Portal</h1>
          <p className="text-lg text-zinc-600 mt-1">LGA: <span className="font-bold text-blue-600">{selectedLga}</span></p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Form Sections */}
            <FormSection title="1. Maternal Health/FP">
              <InputField label="ANC1 early" name="anc1Early" value={formData.anc1Early} onChange={handleChange} disabled={isSubmitting} />
              <InputField label="IPTp2 in ANC" name="iptp2InAnc" value={formData.iptp2InAnc} onChange={handleChange} disabled={isSubmitting} />
              <InputField label="SBA/ expected births" name="sbaExpectedBirths" value={formData.sbaExpectedBirths} onChange={handleChange} disabled={isSubmitting} />
              <InputField label="New LARC/ Users of family planning" name="newLarcUsers" value={formData.newLarcUsers} onChange={handleChange} disabled={isSubmitting} />
            </FormSection>

            <FormSection title="2. Child health/Newborn">
              <InputField label="ORS & Zinc for diarrhea" name="orsZincForDiarrhea" value={formData.orsZincForDiarrhea} onChange={handleChange} disabled={isSubmitting} />
              <InputField label="Amoxyl DT for pneumonia" name="amoxylDtForPneumonia" value={formData.amoxylDtForPneumonia} onChange={handleChange} disabled={isSubmitting} />
              <InputField label="% Child fevers as pneumonia" name="childFeversAsPneumonia" value={formData.childFeversAsPneumonia} onChange={handleChange} disabled={isSubmitting} />
              <InputField label="PNC1&3/ Live births" name="pnc1And3LiveBirths" value={formData.pnc1And3LiveBirths} onChange={handleChange} disabled={isSubmitting} />
            </FormSection>

            <FormSection title="3. Birth Registration/Nutrition">
              <InputField label="Birth Registration <1 yrs" name="birthRegistrationUnder1" value={formData.birthRegistrationUnder1} onChange={handleChange} disabled={isSubmitting} />
              <InputField label="Exclusive Breastfeeding" name="exclusiveBreastfeeding" value={formData.exclusiveBreastfeeding} onChange={handleChange} disabled={isSubmitting} />
              <InputField label="Vitamin A" name="vitaminA" value={formData.vitaminA} onChange={handleChange} disabled={isSubmitting} />
            </FormSection>

            <FormSection title="4. Malaria/Immunization">
              <InputField label="RDT or microscopy test for fever <5 yrs" name="rdtMicroscopyFeverUnder5" value={formData.rdtMicroscopyFeverUnder5} onChange={handleChange} disabled={isSubmitting} />
              <InputField label="ACT treatment for malaria in children" name="actTreatmentMalariaChildren" value={formData.actTreatmentMalariaChildren} onChange={handleChange} disabled={isSubmitting} />
              <InputField label="BCG Vaccine" name="bcgVaccine" value={formData.bcgVaccine} onChange={handleChange} disabled={isSubmitting} />
              <InputField label="Fully Immunized" name="fullyImmunized" value={formData.fullyImmunized} onChange={handleChange} disabled={isSubmitting} />
            </FormSection>

            {/* Status Messages */}
            {status === 'success' && (
              <div className="p-4 text-sm text-green-800 bg-green-100 border border-green-200 rounded-lg text-center">
                <strong>Success!</strong> Data has been submitted successfully.
              </div>
            )}
            {status === 'error' && (
              <div className="p-4 text-sm text-red-800 bg-red-100 border border-red-200 rounded-lg text-center">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Submission Button */}
            <div className="flex flex-col items-center justify-center pt-4">
              <button
                type="submit"
                className="w-full max-w-xs flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-zinc-400 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : 'Submit Data'}
              </button>
              <Link href="/" className="mt-4 text-sm text-blue-600 hover:underline">
                &larr; Back to Dashboard
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const FormSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <section className="p-6 border border-zinc-200 rounded-xl">
    <h2 className="text-xl font-bold text-zinc-800 mb-6 pb-2 border-b border-zinc-200">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
      {children}
    </div>
  </section>
);

const InputField = ({ label, name, value, onChange, disabled }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, disabled: boolean }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-zinc-700">{label}</label>
    <input
      type="number"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="mt-1 block w-full px-3 py-2 bg-white border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-zinc-100"
    />
  </div>
);

export default function LgaDataEntryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LgaDataEntryForm />
    </Suspense>
  );
}
