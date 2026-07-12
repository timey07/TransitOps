const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen border-r p-4">
      <h2 className="text-xl font-bold">TransitOps</h2>

      <nav className="mt-6 flex flex-col gap-3">
        <span>Dashboard</span>
        <span>Trips</span>
        <span>Fuel</span>
        <span>Expenses</span>
        <span>Reports</span>
      </nav>
    </aside>
  );
};

export default Sidebar;