import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, Calendar, Wallet } from 'lucide-react';
import { formatDate } from '../utils/constants';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Your account information</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-emerald-50 text-sm">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <InfoRow icon={UserIcon} label="Full Name" value={user.name} />
          <InfoRow icon={Mail} label="Email Address" value={user.email} />
          {user.createdAt && (
            <InfoRow icon={Calendar} label="Member Since" value={formatDate(user.createdAt)} />
          )}
          <InfoRow icon={Wallet} label="Account ID" value={user.id} />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <p className="text-sm text-blue-800">
          This is a college project demonstration account. Your data is stored securely in MongoDB
          and associated with your email address.
        </p>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-sm text-slate-800 font-medium truncate">{value}</p>
      </div>
    </div>
  );
}
