import { UserCircle, Bell } from "lucide-react";

export default function TopBar() {
  return (
    <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-8">
      <div className="flex flex-1">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div className="ml-4 flex items-center space-x-4 md:ml-6">
        <button
          type="button"
          className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <span className="sr-only">View notifications</span>
          <Bell className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Profile dropdown */}
        <div className="relative ml-3">
          <div>
            <button
              className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none"
              id="user-menu-button"
              aria-expanded="false"
              aria-haspopup="true"
            >
              <span className="sr-only">Open user menu</span>
              <UserCircle className="h-8 w-8 text-gray-400" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
