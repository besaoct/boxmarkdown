'use client';

import React, { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { SettingsSchema } from '@/schemas';
import { z } from 'zod';
import { settings } from '@/actions/user/settings';

const SettingsPage = ({ userData }: { userData: any }) => {
  

  const [isEditing, setIsEditing] = useState(false);
  const [isPrivate, setIsPrivate] = useState(userData?.isPrivate || false);
  
  const [username, setUserName] = useState(userData?.username || '');
  const [name, setName] = useState(userData?.name || '');

  const [error, setError] = useState<string | null>("");
  const [success, setSuccess] = useState<string | null>("");
  const [isPending, startTransition] = useTransition();
  
  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
        settings(values)
            .then((data) => {
                if (data.error) {
                    setError(data.error && "Something went wrong!");
                }

                if (data.success) {
                    setSuccess(data.success || 'Settings saved.');
                }
            })
            .catch(() => setError("Something went wrong!"))
    });
};

const handleEditClick = () => {
  if (isEditing) {
    // Only submit if there are changes
    if (username !== userData?.username || name !== userData?.name) {
      onSubmit({ name, email: userData?.email, username });
    }
  }
  // Toggle the edit mode
  setIsEditing(!isEditing);
};



  const [deleteDialog, setDeleteDialog] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    if (reason.length >= 12) {
      setLoading(true);
      // Simulate sending request to server
      setTimeout(() => {
        alert("Deletion request sent to server!");
        setLoading(false);
        setDeleteDialog(false);  // Close dialog
        setReason("");  // Reset reason
      }, 1000);  // Simulate network delay
    }
  };

  return (
    <div className="w-full mx-auto">
      <div className="border dark:bg-neutral-900 bg-neutral-200 p-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-row items-center gap-4 w-full flex-wrap justify-between">
            <label className="font-medium w-full max-w-48">Name</label>
            <Input
              type="text"
              // defaultValue={userData?.name || ''}
              value={name}
              onChange={(e)=>setName(e.target.value)}
              readOnly={!isEditing}
              className={`bg-muted  ${isEditing && 'bg-background'} flex-1 w-48`}
            />
          </div>

          <div className="flex flex-row items-center gap-4 w-full flex-wrap justify-between">
            <label className="block font-medium w-full max-w-48">Email</label>
            <Input
              type="email"
              value={userData?.email || ''}
              readOnly
              className={`bg-muted flex-1  w-48`}
            />
          </div>

          <div className="flex flex-row items-center gap-4 w-full flex-wrap justify-between">

            <label className="block font-medium w-full max-w-48">Username</label>
            <Input
              type="text"
              // defaultValue={userData?.username || ''}
              value={username}
              onChange={(e)=>setUserName(e.target.value)}
              readOnly={!isEditing}
              className={`bg-muted ${isEditing && 'bg-background'} flex-1 w-48`}
            />
          </div>

          <div className="flex flex-row items-center gap-4 w-full flex-wrap justify-between">
            <label className="block font-medium w-full max-w-48">Account Type</label>
            <Input
              type="text"
              value={(userData?.isPro && 'Pro') || (userData?.isPremium && 'Premium') || 'Free'}
              readOnly
              className="bg-muted flex-1 w-48"
            />
          </div>

          <div className="flex flex-row items-center gap-4 w-full flex-wrap justify-between">
            <label className="block font-medium w-full max-w-48">Role</label>
            <Input
              type="text"
              value={userData?.isAdmin ? 'Admin' : 'User'}
              readOnly
              className="bg-muted flex-1 w-48"
            />
          </div>

          <div className={`flex flex-row items-center justify-between  ${'bg-muted'} gap-4 w-full flex-wrap p-4 border`}>
            <label className="block font-medium">Public visibility</label>
            <div className="flex items-center">
            {
              // isEditing? 
              // <Switch
              //   defaultChecked={!isPrivate}
              //   onChange={() => setIsPrivate(!isPrivate)}
              //   className=" data-[state=unchecked]:bg-neutral-500"
              // />:
              <Switch
                 checked={!isPrivate}
                 onChange={() => setIsPrivate(!isPrivate)}
                 className=" "
               />
            }
            </div>
          </div>
        </div>
       
        {(error || success) && (
  <div className={`w-full flex justify-between items-center p-2 mt-4 px-3 text-xl border ${error ? 'bg-red-100' : 'bg-green-100'}`}>

    {error && <p className="text-red-700 text-sm">{error}</p>}
    {success && <p className="text-green-700 text-sm">{success}</p>}
  
    {/* Dismiss button */}
    <button
      onClick={() => { 
        setError(null);
        setSuccess(null);
      }}
      className=" text-xl font-semibold  mr-2 text-red-500 hover:text-red-800 "
    >
      &times;
    </button>
  </div>
)}


        <div className="mt-4 flex justify-start items-start gap-4">
          <Button
            onClick={handleEditClick}
            className="px-4 py-2 bg-orange-600 text-white hover:bg-orange-700"
          >
            {isPending? 'Saving...' : isEditing? 'Save Changes': 'Edit'}
          </Button>

          <Button onClick={()=>setDeleteDialog(true)} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700">
            Delete Account
          </Button>
            {/* Modal Dialog */}
      {deleteDialog && (
        <div className="p-4 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className=" p-4 shadow-lg w-full max-w-md mx-auto bg-muted ">
            {/* Close button */}
            <button
              className="absolute top-2 right-2 "
              onClick={() => setDeleteDialog(false)}
            >
              &times;
            </button>

            <h2 className=" font-semibold text-left mb-4">Confirm Account Deletion</h2>

            <textarea
              className="w-full border  p-2 mb-4 max-h-32 min-h-12"
              placeholder="Please provide a reason (at least 12 characters)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              minLength={12}
            />

            <div className="flex justify-between items-center">
              <button
                className="px-4 py-2 bg-black text-white "
                onClick={() => setDeleteDialog(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ${
                  reason.length < 12 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={reason.length < 12 || loading}
                onClick={handleDelete}
              >
                {loading ? "Processing..." : "Request Deletion"}
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
