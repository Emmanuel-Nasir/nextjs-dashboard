'use client';

import { lusitana } from '@/app/ui/fonts';
import { AtSymbolIcon, KeyIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  // useActionState connects the form to the server action (authenticate)
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>

        <div>
          <label htmlFor="email" className="mb-3 mt-5 block text-xs font-medium text-gray-900">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email address"
              required
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <AtSymbolIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900 pointer-events-none" />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-3 mt-5 block text-xs font-medium text-gray-900">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter password"
              required
              minLength={6}
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <KeyIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900 pointer-events-none" />
          </div>
        </div>

        {/* Hidden field for redirect */}
        <input type="hidden" name="redirectTo" value={callbackUrl} />

        {/* Submit button */}
        <Button
          type="submit"
          className="mt-4 w-full"
          aria-disabled={isPending}
          disabled={isPending}
        >
          {isPending ? 'Logging in...' : 'Log in'}
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>

        {/* Display error messages */}
        {errorMessage && (
          <div className="mt-2 flex items-center space-x-2" aria-live="polite" aria-atomic="true">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{errorMessage}</p>
          </div>
        )}
      </div>
    </form>
  );
}
