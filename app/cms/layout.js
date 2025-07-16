// app/cms/layout.js
import Sidebar from '../components/Sidebar';

export default function CmsLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-6 w-full">{children}</main>
    </div>
  );
}
