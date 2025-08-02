'use client';
import { useState, useEffect } from "react";
import {
  Key,
  Copy,
  Trash2,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Zap,
  Globe,
  Clock,
  User,
  CalendarClock,
  FileText,
  LogOut,
  Pencil,
  XCircle,
} from "lucide-react";
import { UserDetail, UserUpdate, UserDelete } from '@/lib/user';
import { CreateApiKeys, deleteApiKeys } from '@/lib/api_keys';
import { logoutUser } from '@/lib/logout';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    nickname: string;
    email: string;
    activate: boolean;
  } | null>(null);
  const [apiKeys, setApiKeys] = useState<
    { identifier: string; title: string; detail: string; created_at?: string }[]
  >([]);
  const [usageStats, setUsageStats] = useState<{
    currentMonth: number;
    limit: number;
    successfulCalls: number;
    errorRate: number;
    averageResponseTime: number;
    successRate: number;
  } | null>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCreateKeyModal, setShowCreateKeyModal] = useState(false);
  const [showGeneratedKeyModal, setShowGeneratedKeyModal] = useState(false);
  const [newKeyForm, setNewKeyForm] = useState({ title: '', description: '' });
  const [generatedKey, setGeneratedKey] = useState('');
  const [editForm, setEditForm] = useState<{ name: string; nickname: string }>({ name: '', nickname: '' });
  const [createKeyLoading, setCreateKeyLoading] = useState(false);
  const [deleteKeyLoading, setDeleteKeyLoading] = useState<string | null>(null);
  const [editAccountLoading, setEditAccountLoading] = useState(false);
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [customAlert, setCustomAlert] = useState<{ message: string, open: boolean }>({ message: '', open: false });
  const [confirmDeleteKey, setConfirmDeleteKey] = useState<{ open: boolean, identifier: string | null }>({ open: false, identifier: null });
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [deleteAccountConfirm, setDeleteAccountConfirm] = useState('');

  // Fetch user detail on mount
  useEffect(() => {
    setLoading(true);
    UserDetail()
      .then(res => {
        const data = res.data;
        setUserInfo({
          name: data.name,
          nickname: data.nickname,
          email: data.email,
          activate: data.activate,
        });
        setApiKeys(data.api_keys || []);
        setUsageStats({
          currentMonth: data.total_api_usage,
          limit: 10000,
          successfulCalls: Math.round(data.total_api_usage * (data.average_success_rate / 100)),
          errorRate: data.average_error_rate,
          averageResponseTime: data.average_response_time,
          successRate: data.average_success_rate,
        });
        setEditForm({ name: data.name, nickname: data.nickname });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Fungsi untuk menampilkan custom alert
  const showCustomAlert = (msg: string) => setCustomAlert({ message: msg, open: true });
  const closeCustomAlert = () => setCustomAlert({ message: '', open: false });

  // Create API Key
  const handleCreateKey = async () => {
    if (!newKeyForm.title.trim()) {
      showCustomAlert('Title is required!');
      return;
    }
    setCreateKeyLoading(true);
    try {
      const res = await CreateApiKeys({ title: newKeyForm.title, desc: newKeyForm.description });
      setGeneratedKey(res.api_key || '');
      // Refresh user detail to update API keys list
      const detail = await UserDetail();
      setApiKeys(detail.data.api_keys || []);
      setShowCreateKeyModal(false);
      setShowGeneratedKeyModal(true);
      setNewKeyForm({ title: '', description: '' });
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'message' in err) {
        showCustomAlert((err as { message: string }).message);
      } else {
        showCustomAlert('Failed to create API key.');
      }
    } finally {
      setCreateKeyLoading(false);
    }
  };

  // Delete API Key
  const handleDeleteKey = async (identifier: string) => {
    setConfirmDeleteKey({ open: true, identifier });
  };

  const confirmDeleteKeyAction = async () => {
    if (!confirmDeleteKey.identifier) return;
    setDeleteKeyLoading(confirmDeleteKey.identifier);
    setConfirmDeleteKey({ open: false, identifier: null });
    try {
      await deleteApiKeys(confirmDeleteKey.identifier);
      setApiKeys(prev => prev.filter(k => k.identifier !== confirmDeleteKey.identifier));
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'message' in err) {
        showCustomAlert((err as { message: string }).message);
      } else {
        showCustomAlert('Failed to delete API key.');
      }
    } finally {
      setDeleteKeyLoading(null);
    }
  };

  // Edit Account
  const handleEditAccount = async () => {
    setEditAccountLoading(true);
    try {
      await UserUpdate({ name: editForm.name, nickname: editForm.nickname });
      setUserInfo((prev) => prev ? ({ ...prev, name: editForm.name, nickname: editForm.nickname }) : prev);
      setShowEditModal(false);
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'message' in err) {
        showCustomAlert((err as { message: string }).message);
      } else {
        showCustomAlert('Failed to update account.');
      }
    } finally {
      setEditAccountLoading(false);
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    setDeleteAccountLoading(true);
    try {
      await UserDelete();
      window.location.href = '/';
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'message' in err) {
        showCustomAlert((err as { message: string }).message);
      } else {
        showCustomAlert('Failed to delete account.');
      }
    } finally {
      setDeleteAccountLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logoutUser();
      window.location.href = '/';
    } catch {
      showCustomAlert('Logout failed.');
    } finally {
      setLogoutLoading(false);
    }
  };

  const copyGeneratedKey = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 1500);
  };
  const closeGeneratedKeyModal = () => {
    setShowGeneratedKeyModal(false);
    setGeneratedKey('');
    setCopiedKey(false);
  };

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6 lg:p-8 relative">
      {/* Custom Alert Popup */}
      {customAlert.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
          <div className="bg-white/10 border border-blue-400 p-6 rounded-xl backdrop-blur-md w-full max-w-sm space-y-4 text-center">
            <div className="text-blue-400 text-2xl font-bold mb-2">Notice</div>
            <div className="text-white text-base">{customAlert.message}</div>
            <button
              onClick={closeCustomAlert}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Custom Confirm Delete API Key Popup */}
      {confirmDeleteKey.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
          <div className="bg-white/10 border border-white/20 p-6 rounded-xl backdrop-blur-md w-full max-w-sm space-y-4 text-center">
            <div className="text-red-400 text-2xl font-bold mb-2">Delete API Key</div>
            <div className="text-white text-base mb-2">Are you sure you want to delete this API key? This action cannot be undone.</div>
            <div className="flex justify-center space-x-2 mt-4">
              <button
                onClick={() => setConfirmDeleteKey({ open: false, identifier: null })}
                className="px-4 py-2 bg-white/20 text-white rounded hover:bg-white/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteKeyAction}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                disabled={deleteKeyLoading === confirmDeleteKey.identifier}
              >
                {deleteKeyLoading === confirmDeleteKey.identifier ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay for dashboard data */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-400 border-solid mb-4"></div>
            <span className="text-white text-lg font-semibold">Loading dashboard...</span>
          </div>
        </div>
      )}

      {/* Loading overlay for logout */}
      {logoutLoading && (
        <div className="fixed inset-0 z-[101] flex items-center justify-center bg-black/70">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-yellow-400 border-solid mb-4"></div>
            <span className="text-yellow-400 text-lg font-semibold">Logging out...</span>
          </div>
        </div>
      )}

      {/* Background Effects */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute border-blue-400"
              style={{
                width: '1px',
                height: '100%',
                left: `${(i + 1) * 10}%`,
                background: 'linear-gradient(0deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="fixed top-20 right-10 text-8xl font-light text-blue-400 opacity-10 pointer-events-none select-none">
        ダッシュボード
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">
            Dashboard <span className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.7)]">世界</span>
          </h1>
          <p className="text-white/60">Manage your API keys and monitor your usage</p>
        </div>

        {/* Account Detail */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center p-4 sm:p-6 pb-2 gap-4">
            <h3 className="flex items-center space-x-2 text-white text-lg font-semibold">
              <User className="w-5 h-5" />
              <span>Account Detail</span>
            </h3>
            <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="px-3 py-2 text-sm border border-white/20 text-white/70 hover:text-white hover:border-blue-400 rounded transition-colors flex items-center justify-center sm:justify-start"
              >
                <Pencil className="w-4 h-4 mr-1" /> Edit
              </button>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="px-3 py-2 text-sm border border-yellow-500/40 text-yellow-400 hover:border-yellow-500 hover:bg-yellow-500/10 rounded transition-colors flex items-center justify-center sm:justify-start"
              >
                <LogOut className="w-4 h-4 mr-1" /> Logout
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-3 py-2 text-sm border border-red-500/40 text-red-400 hover:border-red-500 hover:bg-red-500/10 rounded transition-colors flex items-center justify-center sm:justify-start"
              >
                <XCircle className="w-4 h-4 mr-1" /> Delete Account
              </button>
            </div>
          </div>
          <div className="p-4 sm:p-6 pt-2 text-white/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <strong className="text-white/90 min-w-0 sm:min-w-[100px]">Full Name:</strong> 
              <span className="break-words">{userInfo?.name}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <strong className="text-white/90 min-w-0 sm:min-w-[100px]">Nickname:</strong> 
              <span className="break-words">{userInfo?.nickname}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <strong className="text-white/90 min-w-0 sm:min-w-[100px]">Email:</strong> 
              <span className="break-all">{userInfo?.email}</span>
            </div>
          </div>
        </div>

        {/* API Key Management */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg">
          <div className="p-6 pb-2">
            <div className="flex justify-between items-center">
              <h3 className="flex items-center space-x-2 text-white text-lg font-semibold">
                <Key className="w-5 h-5" />
                <span>API Keys</span>
              </h3>
              <button 
                onClick={() => setShowCreateKeyModal(true)}
                className="px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors flex items-center space-x-2"
              >
                <Key className="w-4 h-4" />
                <span>Create New Key</span>
              </button>
            </div>
            <p className="text-white/60 text-sm mt-1">
              List of your generated API keys. You must generate them manually.
            </p>
          </div>
          <div className="p-6 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {apiKeys.map((key) => (
                <div
                  key={key.identifier}
                  className="bg-white/5 border border-white/10 backdrop-blur-sm p-4 space-y-3 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div className="text-white font-medium text-lg flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span>{key.title}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteKey(key.identifier)}
                      disabled={deleteKeyLoading === key.identifier}
                      className={`p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors ${deleteKeyLoading === key.identifier ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {deleteKeyLoading === key.identifier ? (
                        <span className="text-xs">Loading...</span>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="text-sm text-white/60 flex items-center space-x-2">
                    <CalendarClock className="w-4 h-4" />
                    <span>Created at: {key.created_at?.slice(0, 16).replace('T', ' ')}</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-white/70">{key.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {apiKeys.length === 0 && (
              <p className="text-white/60 mt-4 text-center">You have no API keys. Generate one to get started.</p>
            )}
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg">
            <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
              <h3 className="text-sm font-medium text-white/80">
                API Calls This Month
              </h3>
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </div>
            <div className="p-6 pt-2">
              <div className="text-2xl font-bold text-white">
                {usageStats?.currentMonth?.toLocaleString()}
              </div>
              <p className="text-xs text-white/60 mt-1">
                of {usageStats?.limit?.toLocaleString()} limit
              </p>
              <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-400 h-2 rounded-full"
                  style={{ width: `${((usageStats?.currentMonth ?? 0) / (usageStats?.limit ?? 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg">
            <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
              <h3 className="text-sm font-medium text-white/80">
                Successful Calls
              </h3>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </div>
            <div className="p-6 pt-2">
              <div className="text-2xl font-bold text-white">
                {usageStats?.successfulCalls?.toLocaleString()}
              </div>
              <p className="text-xs text-green-400 mt-1">
                {usageStats ? `${usageStats.successRate}% success rate` : ''}
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg">
            <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
              <h3 className="text-sm font-medium text-white/80">
                Error Rate
              </h3>
              <AlertCircle className="h-4 w-4 text-yellow-400" />
            </div>
            <div className="p-6 pt-2">
              <div className="text-2xl font-bold text-white">
                {usageStats?.errorRate}%
              </div>
              <p className="text-xs text-white/60 mt-1">
                Last 30 days
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg">
            <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
              <h3 className="text-sm font-medium text-white/80">
                Avg Response Time
              </h3>
              <Zap className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="p-6 pt-2">
              <div className="text-2xl font-bold text-white">
                {usageStats?.averageResponseTime ? `${usageStats.averageResponseTime}ms` : '0ms'}
              </div>
              <p className="text-xs text-cyan-400 mt-1">
                {/* You can add delta from last month if available */}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg">
          <div className="p-6 pb-2">
            <h3 className="text-white text-lg font-semibold">Quick Actions</h3>
            <p className="text-white/60 text-sm mt-1">
              Common tasks and useful links
            </p>
          </div>
          <div className="p-6 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                className="h-auto p-4 border border-white/20 hover:border-blue-400 hover:bg-blue-400/10 text-left flex flex-col items-start space-y-2 rounded transition-colors"
                onClick={() => window.open('https://sso-sekai-set-on-backend-production.up.railway.app/docs', '_blank')}
              >
                <Globe className="h-5 w-5 text-blue-400" />
                <div>
                  <div className="font-medium text-white">API Documentation</div>
                  <div className="text-sm text-white/60">View complete API reference</div>
                </div>
              </button>

              <button
                className="h-auto p-4 border border-white/20 hover:border-cyan-400 hover:bg-cyan-400/10 text-left flex flex-col items-start space-y-2 rounded transition-colors"
                onClick={() => window.open('https://sso-sekai-set-on-backend-production.up.railway.app/docs', '_blank')}
              >
                <Zap className="h-5 w-5 text-cyan-400" />
                <div>
                  <div className="font-medium text-white">API Testing</div>
                  <div className="text-sm text-white/60">Test endpoints in browser</div>
                </div>
              </button>

              <button className="h-auto p-4 border border-white/20 hover:border-green-400 hover:bg-green-400/10 text-left flex flex-col items-start space-y-2 rounded transition-colors">
                <Clock className="h-5 w-5 text-green-400" />
                <div>
                  <div className="font-medium text-white">Usage History</div>
                  <div className="text-sm text-white/60">View detailed analytics</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Create API Key Modal */}
        {showCreateKeyModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white/10 border border-white/20 p-6 rounded-xl backdrop-blur-md w-full max-w-md space-y-4">
              <h3 className="text-xl text-white font-bold flex items-center space-x-2">
                <Key className="w-5 h-5 text-blue-400" />
                <span>Create New API Key</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter API key title"
                    value={newKeyForm.title}
                    onChange={(e) => setNewKeyForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 text-white border border-white/20 rounded focus:outline-none focus:border-blue-400 placeholder-white/40"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Description <span className="text-white/40">(optional)</span>
                  </label>
                  <textarea
                    placeholder="Enter description for this API key"
                    value={newKeyForm.description}
                    onChange={(e) => setNewKeyForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-white/5 text-white border border-white/20 rounded focus:outline-none focus:border-blue-400 placeholder-white/40 resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => {
                    setShowCreateKeyModal(false);
                    setNewKeyForm({ title: '', description: '' });
                  }}
                  disabled={createKeyLoading}
                  className="px-4 py-2 text-white/60 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateKey}
                  disabled={createKeyLoading}
                  className={`px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded transition-colors flex items-center space-x-2 ${createKeyLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Key className="w-4 h-4" />
                  <span>{createKeyLoading ? 'Creating...' : 'Create Key'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Generated API Key Modal */}
        {showGeneratedKeyModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white/10 border border-white/20 p-6 rounded-xl backdrop-blur-md w-full max-w-lg space-y-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl text-white font-bold">API Key Created Successfully!</h3>
              </div>
              
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-200">
                    <p className="font-medium mb-1">Important Security Notice:</p>
                    <p>This is the only time you will be able to see this API key. Please copy it now and store it securely. Once you close this dialog, the key cannot be retrieved again.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-white/80 text-sm font-medium">
                  Your API Key:
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={generatedKey}
                    readOnly
                    className="w-full px-3 py-3 bg-black/30 text-white border border-white/20 rounded font-mono text-sm pr-12 select-all focus:outline-none focus:border-blue-400" 
                  />
                  <button
                    onClick={copyGeneratedKey}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {copiedKey && (
                  <div className="text-green-400 text-sm font-semibold mt-2">Copied!</div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button 
                  onClick={copyGeneratedKey}
                  className="px-4 py-2 border border-white/20 text-white/70 hover:text-white hover:border-blue-400 rounded transition-colors flex items-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Key</span>
                </button>
                <button 
                  onClick={closeGeneratedKeyModal}
                  className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded transition-colors"
                >
                  I've Saved It
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white/10 border border-white/20 p-6 rounded-xl backdrop-blur-md w-full max-w-sm space-y-4">
              <h3 className="text-xl text-white font-bold">Edit Account</h3>
              <input
                type="text"
                placeholder="Full Name"
                value={editForm.name}
                onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 bg-white/5 text-white border border-white/20 rounded focus:outline-none focus:border-blue-400"
              />
              <input
                type="text"
                placeholder="Nickname"
                value={editForm.nickname}
                onChange={e => setEditForm(f => ({ ...f, nickname: e.target.value }))}
                className="w-full px-3 py-2 bg-white/5 text-white border border-white/20 rounded focus:outline-none focus:border-blue-400"
              />
              <div className="flex justify-end space-x-2">
                <button onClick={() => setShowEditModal(false)} disabled={editAccountLoading} className="px-4 py-2 text-white/60 hover:text-white transition-colors">
                  Cancel
                </button>
                <button onClick={handleEditAccount} disabled={editAccountLoading} className={`px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded transition-colors ${editAccountLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {editAccountLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white/10 border border-white/20 p-6 rounded-xl backdrop-blur-md w-full max-w-sm space-y-4">
              <h3 className="text-xl text-white font-bold">Confirm Account Deletion</h3>
              <p className="text-white/60">
                Are you sure you want to delete your account? This action cannot be undone.<br />
                Please type <span className="font-bold text-red-400">delete my account ({userInfo?.name})</span> to confirm.
              </p>
              <input
                type="text"
                value={deleteAccountConfirm}
                onChange={e => setDeleteAccountConfirm(e.target.value)}
                placeholder={`delete my account (${userInfo?.name?.replace(/'/g, '&#39;')})`}
                className="w-full px-3 py-2 bg-white/5 text-white border border-white/20 rounded focus:outline-none focus:border-red-400 mt-2"
                disabled={deleteAccountLoading}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteAccountConfirm('');
                  }}
                  disabled={deleteAccountLoading}
                  className="px-4 py-2 text-white/60 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={
                    deleteAccountLoading ||
                    deleteAccountConfirm !== `delete my account (${userInfo?.name?.replace(/'/g, '&#39;')})`
                  }
                  className={`px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded transition-colors ${
                    deleteAccountLoading ||
                    deleteAccountConfirm !== `delete my account (${userInfo?.name?.replace(/'/g, '&#39;')})`
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {deleteAccountLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logout Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white/10 border border-white/20 p-6 rounded-xl backdrop-blur-md w-full max-w-sm space-y-4">
              <h3 className="text-xl text-white font-bold">Confirm Logout</h3>
              <p className="text-white/60">Do you really want to logout from your account?</p>
              <div className="flex justify-end space-x-2">
                <button onClick={() => setShowLogoutModal(false)} className="px-4 py-2 text-white/60 hover:text-white transition-colors">Cancel</button>
                <button
                  className={`px-4 py-2 bg-yellow-500 text-black hover:bg-yellow-600 rounded transition-colors ${logoutLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleLogout}
                  disabled={logoutLoading}
                >
                  {logoutLoading ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}