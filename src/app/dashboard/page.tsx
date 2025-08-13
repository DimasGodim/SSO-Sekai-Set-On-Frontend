'use client';
import { useState, useEffect, useCallback } from "react";
import dynamic from 'next/dynamic';
import {
    Key,
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
} from 'lucide-react';
import { UserDetail, UserUpdate, UserDelete } from '@/lib/user';
import { CreateApiKeys, deleteApiKeys } from '@/lib/api_keys';
import { logoutUser } from '@/lib/logout';

// Dynamic imports for modals
const EditProfileModal = dynamic(() => import('@/components/modals/EditProfileModal'), {
    ssr: false,
});

const DeleteAccountModal = dynamic(() => import('@/components/modals/DeleteAccountModal'), {
    ssr: false,
});

const LogoutModal = dynamic(() => import('@/components/modals/LogoutModal'), {
    ssr: false,
});

const CreateApiKeyModal = dynamic(() => import('@/components/modals/CreateApiKeyModal'), {
    ssr: false,
});

const GeneratedKeyModal = dynamic(() => import('@/components/modals/GeneratedKeyModal'), {
    ssr: false,
});

const DeleteApiKeyModal = dynamic(() => import('@/components/modals/DeleteApiKeyModal'), {
    ssr: false,
});

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
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    // Fungsi untuk menampilkan custom alert
    const showCustomAlert = useCallback((msg: string) =>
        setCustomAlert({ message: msg, open: true }), []);
    const closeCustomAlert = useCallback(() =>
        setCustomAlert({ message: '', open: false }), []);

    // Fungsi untuk menghapus cookie
    const deleteAuthCookies = useCallback(() => {
        document.cookie = 'access-token=; Max-Age=0; path=/;';
        document.cookie = 'refresh_token=; Max-Age=0; path=/;';
    }, []);

    // Create API Key
    const handleCreateKey = useCallback(async () => {
        if (!newKeyForm.title.trim()) {
            showCustomAlert('Title is required!');
            return;
        }
        setCreateKeyLoading(true);
        try {
            const res = await CreateApiKeys({ title: newKeyForm.title, desc: newKeyForm.description });
            setGeneratedKey(res.data.api_key || '');
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
    }, [newKeyForm.title, newKeyForm.description, showCustomAlert]);

    // Delete API Key
    const handleDeleteKey = useCallback((identifier: string) => {
        setConfirmDeleteKey({ open: true, identifier });
    }, []);

    const confirmDeleteKeyAction = useCallback(async () => {
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
    }, [confirmDeleteKey.identifier, showCustomAlert]);

    // Edit Account
    const handleEditAccount = useCallback(async () => {
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
    }, [editForm.name, editForm.nickname, showCustomAlert]);

    // Delete Account
    const handleDeleteAccount = useCallback(async () => {
        setDeleteAccountLoading(true);
        try {
            await UserDelete();
            deleteAuthCookies();
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
    }, [deleteAuthCookies, showCustomAlert]);

    // Logout handler
    const handleLogout = useCallback(async () => {
        setLogoutLoading(true);
        try {
            await logoutUser();
            deleteAuthCookies();
            window.location.href = '/';
        } catch {
            showCustomAlert('Logout failed.');
        } finally {
            setLogoutLoading(false);
        }
    }, [deleteAuthCookies, showCustomAlert]);

    const copyGeneratedKey = useCallback(() => {
        navigator.clipboard.writeText(generatedKey);
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 1500);
    }, [generatedKey]);

    const closeGeneratedKeyModal = useCallback(() => {
        setShowGeneratedKeyModal(false);
        setGeneratedKey('');
        setCopiedKey(false);
    }, []);

    // Modal close handlers
    const handleCloseEditModal = useCallback(() => setShowEditModal(false), []);
    const handleCloseDeleteModal = useCallback(() => {
        setShowDeleteModal(false);
        setDeleteAccountConfirm('');
    }, []);
    const handleCloseLogoutModal = useCallback(() => setShowLogoutModal(false), []);
    const handleCloseCreateKeyModal = useCallback(() => setShowCreateKeyModal(false), []);
    const handleCancelDeleteKey = useCallback(() =>
        setConfirmDeleteKey({ open: false, identifier: null }), []);

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

            {/* Delete API Key Modal */}
            {confirmDeleteKey.open && (
                <DeleteApiKeyModal
                    onConfirm={confirmDeleteKeyAction}
                    onCancel={handleCancelDeleteKey}
                    loading={deleteKeyLoading === confirmDeleteKey.identifier}
                />
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
                                onClick={() => window.location.href = '/docs'}
                            >
                                <Globe className="h-5 w-5 text-blue-400" />
                                <div>
                                    <div className="font-medium text-white">API Documentation</div>
                                    <div className="text-sm text-white/60">View complete API reference</div>
                                </div>
                            </button>

                            <button
                                className="h-auto p-4 border border-white/20 hover:border-cyan-400 hover:bg-cyan-400/10 text-left flex flex-col items-start space-y-2 rounded transition-colors"
                                onClick={() => window.location.href = '/docs'}
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

                {/* Modals */}
                {showCreateKeyModal && (
                    <CreateApiKeyModal
                        keyForm={newKeyForm}
                        setKeyForm={setNewKeyForm}
                        onCreate={handleCreateKey}
                        onClose={handleCloseCreateKeyModal}
                        loading={createKeyLoading}
                    />
                )}

                {showGeneratedKeyModal && (
                    <GeneratedKeyModal
                        generatedKey={generatedKey}
                        copiedKey={copiedKey}
                        onCopyKey={copyGeneratedKey}
                        onClose={closeGeneratedKeyModal}
                    />
                )}

                {showEditModal && (
                    <EditProfileModal
                        editForm={editForm}
                        setEditForm={setEditForm}
                        onEdit={handleEditAccount}
                        onClose={handleCloseEditModal}
                        loading={editAccountLoading}
                    />
                )}

                {showDeleteModal && (
                    <DeleteAccountModal
                        userName={userInfo?.name || ''}
                        confirmText={deleteAccountConfirm}
                        setConfirmText={setDeleteAccountConfirm}
                        onDelete={handleDeleteAccount}
                        onClose={handleCloseDeleteModal}
                        loading={deleteAccountLoading}
                    />
                )}

                {showLogoutModal && (
                    <LogoutModal
                        onLogout={handleLogout}
                        onClose={handleCloseLogoutModal}
                        loading={logoutLoading}
                    />
                )}
            </div>
        </div>
    );
}