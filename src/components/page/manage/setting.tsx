"use client"

import { editPageConfig } from '@/actions/user/manage-page';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

// Reusable SettingsDialog component
export default function SettingsDialog({ page, onClose }: any) {
  const pageId = page.id;
  const pageConfigData = page.publicPageConfig;
  const router = useRouter();

  const [pending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    displayName: pageConfigData?.displayName ||  '',
    contactMail: pageConfigData?.contactMail ||  '',
    contactLink: pageConfigData?.contactLink || '',
    projectName: pageConfigData?.projectName ||  '',
    toggleDarkmode: pageConfigData?.toggleDarkmode || true,
    showAuthor: pageConfigData?.showAuthor || true,
  });

  const [checkboxStates, setCheckboxStates] = useState({
    displayName: !!pageConfigData?.displayName ,
    contactMail: !!pageConfigData?.contactMail,
    contactLink: !!pageConfigData?.contactLink,
    projectName: !!pageConfigData?.projectName,
    toggleDarkmode: !!pageConfigData?.toggleDarkmode,
    showAuthor: !!pageConfigData?.showAuthor,
  });

  // UseEffect to clear form fields when checkboxes are unchecked (except for toggleDarkmode)
  useEffect(() => {
    Object.keys(checkboxStates).forEach((key) => {
      if (!checkboxStates[key as keyof typeof checkboxStates] && key !== 'toggleDarkmode' &&  key !== 'showAuthor') {
        setFormData((prev) => ({
          ...prev,
          [key]: '',
        }));
      }
    });
  }, [checkboxStates]);

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e:any) => {
    const { name, checked } = e.target;
    setCheckboxStates((prev) => ({ ...prev, [name]: checked }));

    // If unchecked, set the corresponding form value to undefined
    setFormData((prev:any) => ({
      ...prev,
      [name]: checked ? prev[name] : '',
    }));
  };

  const handleToggleChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, toggleDarkmode: checked}));
    setCheckboxStates((prev) => ({ ...prev, toggleDarkmode: checked }));
  };

  const handleToggleAuthor = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, showAuthor:checked }));
    setCheckboxStates((prev) => ({ ...prev,  showAuthor:checked}));
  };


  const handleSubmit = async () => {
    startTransition(async () => {
      await editPageConfig(pageId, formData);
      router.refresh();
      onClose(); // Close modal after submission
    });
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/80 flex justify-center items-center z-50 p-4">
      <div className="p-6 w-full space-y-4 bg-muted max-w-sm">
        <h2 className="text-base font-semibold">Header Configuration</h2>

 {/* show author mode (Switch) */}
        <div className="flex items-center justify-between">
          <label htmlFor='showAuthor'>Show Author</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              id='showAuthor'
              type="checkbox"
              className="sr-only"
              checked={checkboxStates.showAuthor}
              onChange={(e) => handleToggleAuthor(e.target.checked)}
            />
            <div
              className={`w-12 h-7 bg-neutral-400  peer-checked:bg-violet-600 peer peer-focus:ring-violet-600 transition-all`}
            >
              <div
                className={`h-5 w-5 translate-y-1  shadow-md transform transition-transform duration-300 ease-in-out ${
                  checkboxStates.showAuthor ? 'translate-x-6 bg-neutral-50' : 'translate-x-1 bg-neutral-200 '
                }`}
              ></div>
            </div>
          </label>
        </div>
        {/* User Name */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={checkboxStates.displayName}
              onChange={handleCheckboxChange}
              name="displayName"
            />
            <input
              type="text"
              name="displayName"
              className="border p-2 w-full rounded"
              value={formData.displayName || ''}
              onChange={handleChange}
              disabled={!checkboxStates.displayName}
              placeholder="Enter page display name"
            />
          </label>
        </div>

        {/* User Email */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={checkboxStates.contactMail}
              onChange={handleCheckboxChange}
              name="contactMail"
            />
            <input
              type="email"
              name="contactMail"
              className="border p-2 w-full rounded"
              value={formData.contactMail || ''}
              onChange={handleChange}
              disabled={!checkboxStates.contactMail}
              placeholder="Enter your public email"
            />
          </label>
        </div>

        {/* Contact Link */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={checkboxStates.contactLink}
              onChange={handleCheckboxChange}
              name="contactLink"
            />
            <input
              type="url"
              name="contactLink"
              className="border p-2 w-full rounded"
              value={formData.contactLink || ''}
              onChange={handleChange}
              disabled={!checkboxStates.contactLink}
              placeholder="Enter contact link"
            />
          </label>
        </div>

        {/* Project Name */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={checkboxStates.projectName}
              onChange={handleCheckboxChange}
              name="projectName"
            />
            <input
              type="text"
              name="projectName"
              className="border p-2 w-full rounded"
              value={formData.projectName || ''}
              onChange={handleChange}
              disabled={!checkboxStates.projectName}
              placeholder="Enter project name"
            />
          </label>
        </div>

        {/* Toggle Dark Mode (Switch) */}
        <div className="flex items-center justify-between">
          <label htmlFor='toggleDarkmode'>Show Dark/light Mode</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              id='toggleDarkmode'
              type="checkbox"
              className="sr-only"
              checked={checkboxStates.toggleDarkmode}
              onChange={(e) => handleToggleChange(e.target.checked)}
            />
            <div
              className={`w-12 h-7 bg-neutral-400  peer-checked:bg-violet-600 peer peer-focus:ring-violet-600 transition-all`}
            >
              <div
                className={`h-5 w-5 translate-y-1 shadow-md transform transition-transform duration-300 ease-in-out ${
                  checkboxStates.toggleDarkmode ? 'translate-x-6 bg-neutral-50' : 'translate-x-1 bg-neutral-200 '
                }`}
              ></div>
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-start items-center space-x-2">
          <button
            className="px-4 py-2 bg-gray-600 text-white hover:bg-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 text-white ${
              pending ? 'bg-gray-500' : 'bg-violet-500 hover:bg-violet-600'
            }`}
            disabled={pending}
            onClick={handleSubmit}
          >
            {pending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
