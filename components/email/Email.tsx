"use client"
import { useState } from 'react';
import { validateEmailWithoutRegex } from './validation';

const EmailFormCustom = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError(validateEmailWithoutRegex(e.target.value));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateEmailWithoutRegex(email);
    if (validationError) {
      setError(validationError);
    } else {
      setError(null);
      console.log('Form submitted with email:', email);
    }
  };

  return (
    <div className='min-h-screen flex flex-col justify-center items-center'>
      <form onSubmit={handleSubmit} className="p-4 max-w-sm mx-auto">
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
        Email Address
      </label>
      <input
        type="text"
        id="email"
        value={email}
        onChange={handleInputChange}
        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
          error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
        }`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby="email-error"
      />
      {error && (
        <p id="email-error" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="mt-3 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Submit
      </button>
    </form>
    </div>
    
  );
};

export default EmailFormCustom;
