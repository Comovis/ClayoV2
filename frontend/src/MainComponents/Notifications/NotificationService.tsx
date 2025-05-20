import type { Notification } from "./NotificationsPanel"

// This would be replaced with real API calls in production
export function getNotifications(): Notification[] {
  // Example notifications for a maritime compliance platform
  return [
    {
      id: "1",
      title: "Certificate Expiring Soon",
      message: "Safety Management Certificate for MV Pacific Explorer will expire in 30 days",
      type: "document",
      status: "unread",
      timestamp: "1 hour ago",
      priority: "critical",
      relatedEntityId: "vessel-1",
      relatedEntityType: "vessel",
      actionUrl: "/documents/SMC-PAC-EXP-2023",
    },
    {
      id: "2",
      title: "New Port Requirements",
      message: "Rotterdam port has updated emissions requirements effective June 1st",
      type: "port",
      status: "unread",
      timestamp: "3 hours ago",
      priority: "high",
      relatedEntityId: "port-rotterdam",
      relatedEntityType: "port",
      actionUrl: "/ports/rotterdam",
    },
    {
      id: "3",
      title: "PSC Inspection Alert",
      message: "Your vessel MV Atlantic Voyager is due for PSC inspection within the next port call",
      type: "inspection",
      status: "unread",
      timestamp: "5 hours ago",
      priority: "high",
      relatedEntityId: "vessel-2",
      relatedEntityType: "vessel",
      actionUrl: "/vessels/atlantic-voyager/inspections",
    },
    {
      id: "4",
      title: "Compliance Gap Identified",
      message: "AI analysis found a potential compliance gap in Ballast Water Management documentation",
      type: "compliance",
      status: "read",
      timestamp: "Yesterday",
      priority: "medium",
      relatedEntityId: "doc-bwm-2023",
      relatedEntityType: "document",
      actionUrl: "/compliance/gaps/bwm-2023",
    },
    {
      id: "5",
      title: "Document Successfully Uploaded",
      message: "Crew certificates for MV Pacific Explorer have been processed and verified",
      type: "document",
      status: "read",
      timestamp: "2 days ago",
      priority: "low",
      relatedEntityId: "vessel-1",
      relatedEntityType: "vessel",
      actionUrl: "/vessels/pacific-explorer/crew",
    },
  ]
}

export function markNotificationAsRead(id: string): void {
  // This would be an API call in production
  console.log("Marking notification as read:", id)
}

export function markAllNotificationsAsRead(): void {
  // This would be an API call in production
  console.log("Marking all notifications as read")
}
