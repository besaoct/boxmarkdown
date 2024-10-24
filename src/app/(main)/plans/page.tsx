import Plans from "@/components/common/Plans";
import { currentUser, currentUserPlan, getUserByEmail } from "@/lib/auth";
import React from "react";
import Link from "next/link";

const page = async () => {
  const user = await currentUser();
  const userData = await getUserByEmail(user?.email);
  const userPlan = await currentUserPlan();
  return (
    <>
      {userPlan === "Free" && <Plans userData={userData} />}
   
      {userPlan === "Basic" && (
        <>
          <div className="border  shadow bg-muted">
            <h3 className="text-base font-semibold">
              Current Plan:{" "}
              <span className="text-violet-600 dark:text-violet-400">
                Basic{" "}
              </span>
            </h3>
            <div className="mt-4 flex items-start justify-start gap-8 flex-wrap">
              <div>
                <p className="">Benefits of Basic Plan:</p>
                <ul className="list-disc ml-5 mt-2">
                  <li>Access to 10 Markdown pages</li>
                  <li>100 AI generations per month</li>
                  <li>Page Editing and Public URL</li>
                  <li>Priority support via email</li>
                </ul>
              </div>
              <div>
                <p className=" text-teal-600">
                  Upgrade to Pro for more benefits!
                </p>
                <p className="mt-2">Benefits of Pro Plan:</p>
                <ul className="list-disc ml-5 mt-2">
                  <li>Access to 100 Markdown pages</li>
                  <li>1000 AI generations per month</li>
                  <li>Premium Page Editor with advanced features</li>
                  <li>Subdomain Support!</li>
                  <li>Priority customer support</li>
                </ul>
                <Link
                  href="/plans/pro"
                  className="mt-4 inline-block bg-teal-700 text-white py-2 px-4 hover:bg-teal-800"
                >
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {userPlan === "Pro" && (
        <>
          <div className="border shadow bg-muted">
            <h3 className="text-base font-semibold">
              Hey!{" "}
              <span className="text-violet-600 dark:text-violet-400">Pro </span>
            </h3>
            <div className="mt-4 flex items-start justify-start gap-8 flex-wrap">
              <div>
                <p className="">Benefits of Pro Plan:</p>
                <ul className="list-disc ml-5 mt-2">
                  <li>Access to 100 Markdown pages</li>
                  <li>1000 AI generations per month</li>
                  <li>Premium Page Editor with advanced features</li>
                  <li>Subdomain Support!</li>
                  <li>Priority customer support</li>
                </ul>
              </div>
              <div>
                <p className=" text-teal-600">
                  Upgrade to Member for more benefits!
                </p>
                <p className="mt-2">Benefits of Member Plan:</p>
                <ul className="list-disc ml-5 mt-2">
                  <li>Access to 10,000 Markdown pages</li>
                  <li>100,000 AI generations per month</li>
                  <li>All Pro features plus unlimited enhancements</li>
                  <li>Dedicated support and consultation</li>
                </ul>
                <Link
                  href="/plans/member"
                  className="mt-4 inline-block bg-teal-700 text-white py-2 px-4 hover:bg-teal-800"
                >
                  Upgrade to Member
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
   {userPlan === "Member" && (
        <>
     
     Please contact <span className='text-teal-600 dark:text-teal-400'>team@horofy.com </span>to get desired plans or benefits.

        </>
          )}
    </>
  );
};

export default page;
