"use client";

import { useNextAuth } from "@/hooks/useNextAuth";
import { login, logout } from "@/lib/actions/auth";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";
import { LoginIcon, LogoutIcon, UserIcon } from "./icons/AuthIcons";
import Loading from "./Loading";
import Tooltip from "./Tooltip";

const ProfileButtonContent = () => {
  const { session, isAuthenticated } = useNextAuth();
  const [showTooltip, setShowTooltip] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchParams = useSearchParams();

  const handleSignOut = () => {
    setShowTooltip(false);
    logout("/");
  };

  const handleSignIn = () => {
    setShowTooltip(false);
    login(searchParams.get("callbackUrl") || "/");
  };

  return (
    <div className='flex items-center gap-4 justify-end pr-6 relative'>
      <button
        ref={buttonRef}
        onClick={() => setShowTooltip(!showTooltip)}
        className='p-2 hover:bg-secondary rounded-full transition-all'
        aria-label='User profile'
      >
        <div className='w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground overflow-hidden'>
          {session?.user?.profile?.images?.[0] ? (
            <Image
              src={session.user.profile.images[0].url}
              alt='Profile'
              width={32}
              height={32}
              className='rounded-full object-cover'
            />
          ) : (
            <UserIcon />
          )}
        </div>
      </button>

      {isAuthenticated ? (
        <Tooltip
          isOpen={showTooltip}
          onClose={() => setShowTooltip(false)}
          triggerRef={buttonRef}
          position='bottom'
          align='end'
          arrowOffset={40}
        >
          <div className='p-4'>
            <div className='flex gap-3 items-center'>
              <div className='flex-1 min-w-0'>
                <p className='text-sm text-muted-foreground mb-3'>
                  Signed in as:
                </p>
                <p className='font-semibold text-foreground truncate'>
                  {session?.user?.profile?.display_name || "User"}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className='p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0'
                aria-label='Sign out'
                title='Sign out'
              >
                <LogoutIcon />
              </button>
            </div>
          </div>
        </Tooltip>
      ) : (
        <Tooltip
          isOpen={showTooltip}
          onClose={() => setShowTooltip(false)}
          triggerRef={buttonRef}
          position='bottom'
          align='end'
          arrowOffset={40}
        >
          <div className='p-4'>
            <div className='flex gap-3 items-center'>
              <div className='flex-1 min-w-0'>
                <p className='font-semibold text-foreground truncate'>Login</p>
              </div>
              <button
                onClick={handleSignIn}
                className='p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0'
                aria-label='Sign out'
                title='Sign out'
              >
                <LoginIcon />
              </button>
            </div>
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default function ProfileButton() {
  return (
    <Suspense fallback={<Loading />}>
      <ProfileButtonContent />
    </Suspense>
  );
}
