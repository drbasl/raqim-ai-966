import { useNotification } from '@/hooks/useNotification';
import { Bell, X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const typeStyles = {
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
};

const iconMap = {
  success: <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />,
  error: <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
  warning: <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
  info: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
};

export default function NotificationCenter() {
  const { notifications, removeNotification, clearAll } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`border rounded-lg p-4 flex items-start gap-3 animate-in slide-in-from-right-4 fade-in duration-300 ${
            typeStyles[notification.type]
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">{iconMap[notification.type]}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{notification.title}</h3>
            <p className="text-xs mt-1">{notification.message}</p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}

      {notifications.length > 0 && (
        <Button
          onClick={clearAll}
          variant="outline"
          size="sm"
          className="w-full mt-2 text-xs"
        >
          مسح الكل
        </Button>
      )}
    </div>
  );
}

export function NotificationBell() {
  const { notifications } = useNotification();
  const unreadCount = notifications.length;

  return (
    <div className="relative">
      <Bell className="w-5 h-5 text-foreground" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </div>
  );
}
