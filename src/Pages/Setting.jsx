import React from "react";

function Setting() {
  return (
    <div className="px-6 py-6">
    
      <div className="bg-white rounded-xl shadow-sm border-[0.5px] border-gray-200 p-6">

      
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Settings
        </h2>

    
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Profile Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                defaultValue="tnpLab Pvt Ltd"
                className="
                  w-full
                  px-4 py-3
                  border border-gray-200
                  rounded-lg
                  outline-none
                  focus:ring-2 focus:ring-blue-500
                "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue="admin@tnplab.com"
                className="
                  w-full
                  px-4 py-3
                  border border-gray-200
                  rounded-lg
                  outline-none
                  focus:ring-2 focus:ring-blue-500
                "
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-200 mb-8" />

      
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Notification Preferences
          </h3>

          <div className="space-y-4">
        
            {[
              "Email Notifications",
              "SMS Alerts",
              "Push Notifications",
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between"
              >
                <span className="text-gray-700">{item}</span>

                <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                  <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        
        <hr className="border-gray-200 mb-8" />

       
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Security
          </h3>

          <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-6 py-3 rounded-lg">
            Change Password
          </button>
        </div>

      </div>
    </div>
  );
}

export default Setting;
