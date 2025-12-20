import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  FaPaperPlane, 
  FaComments, 
  FaEnvelope, 
  FaEnvelopeOpen,
  FaClock,
  FaUser,
  FaReply
} from 'react-icons/fa';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  projectId: string;
  projectName: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  projectId: string;
  projectName: string;
  participants: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
}

interface MessageBoardProps {
  isAdmin?: boolean;
  selectedProjectId?: string;
}

export default function MessageBoard({ isAdmin = false, selectedProjectId }: MessageBoardProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showNewMessage, setShowNewMessage] = useState(false);

  // Demo projects for new conversations
  const projects = [
    { id: '1', name: 'VSR Snow Removal Website' },
    { id: '2', name: 'CityLyfe LLC Website' },
    { id: '3', name: 'E-commerce Platform' }
  ];

  const clients = [
    { id: 'client-1', name: 'Demo Client', email: 'client@demo.com' }
  ];

  useEffect(() => {
    fetchMessages();
  }, [user]);

  const fetchMessages = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/messages/get?userId=${user.id}${selectedProjectId ? `&projectId=${selectedProjectId}` : ''}`);
      const data = await response.json();
      
      if (data.success) {
        setConversations(data.conversations);
        
        // Auto-select first conversation if none selected
        if (data.conversations.length > 0 && !selectedConversation) {
          setSelectedConversation(data.conversations[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!user || !newMessage.trim()) return;

    setIsSending(true);

    try {
      let recipientInfo;
      
      if (selectedConversation) {
        // Reply to existing conversation
        recipientInfo = selectedConversation.participants.find(p => p.id !== user.id);
      } else if (isAdmin && showNewMessage) {
        // Admin starting new conversation with client
        recipientInfo = clients[0]; // For demo, using first client
      } else {
        // Client messaging admin
        recipientInfo = {
          id: 'admin-1',
          name: 'Matthew Kenner',
          email: 'citylife32@outlook.com'
        };
      }

      if (!recipientInfo) {
        alert('No recipient found');
        return;
      }

      const projectInfo = selectedConversation ? 
        { id: selectedConversation.projectId, name: selectedConversation.projectName } :
        projects.find(p => p.id === selectedProjectId) || projects[0];

      const messageData = {
        senderId: user.id,
        senderName: user.name,
        senderEmail: user.email,
        recipientId: recipientInfo.id,
        recipientName: recipientInfo.name,
        recipientEmail: recipientInfo.email,
        projectId: projectInfo.id,
        projectName: projectInfo.name,
        subject: newSubject || (selectedConversation ? `Re: ${selectedConversation.messages[0]?.subject}` : 'New Message'),
        message: newMessage
      };

      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData)
      });

      const data = await response.json();

      if (data.success) {
        setNewMessage('');
        setNewSubject('');
        setShowNewMessage(false);
        await fetchMessages(); // Refresh messages
      } else {
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message');
    } finally {
      setIsSending(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    if (!user) return;

    try {
      await fetch('/api/messages/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId, userId: user.id })
      });
      
      // Refresh messages to update read status
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg h-96 flex">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Messages</h3>
            {isAdmin && (
              <button
                onClick={() => setShowNewMessage(true)}
                className="text-blue-600 hover:text-blue-800"
                title="New Message"
              >
                <FaComments />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <FaComments className="mx-auto h-8 w-8 mb-2 text-gray-300" />
              <p className="text-sm">No messages yet</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={`${conversation.projectId}-${conversation.participants.map(p => p.id).sort().join('-')}`}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedConversation === conversation ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-sm text-gray-900 truncate">
                    {conversation.projectName}
                  </h4>
                  {conversation.unreadCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-1">
                  {conversation.participants.find(p => p.id !== user?.id)?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {conversation.lastMessage.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatTimestamp(conversation.lastMessage.timestamp)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 flex flex-col">
        {selectedConversation || showNewMessage ? (
          <>
            {/* Message Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900">
                {selectedConversation ? selectedConversation.projectName : 'New Message'}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedConversation ? 
                  `with ${selectedConversation.participants.find(p => p.id !== user?.id)?.name}` :
                  'Start a new conversation'
                }
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation?.messages
                .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                .map((message) => {
                  const isOwn = message.senderId === user?.id;
                  const isUnread = !message.read && message.recipientId === user?.id;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      onClick={() => isUnread && markAsRead(message.id)}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isOwn 
                          ? 'bg-blue-600 text-white' 
                          : `bg-gray-200 text-gray-900 ${isUnread ? 'border-2 border-blue-400' : ''}`
                      }`}>
                        <div className="flex items-center space-x-2 mb-1">
                          <FaUser className="h-3 w-3" />
                          <span className="text-xs font-medium">
                            {isOwn ? 'You' : message.senderName}
                          </span>
                          {isUnread && !isOwn && (
                            <FaEnvelope className="h-3 w-3 text-blue-600" />
                          )}
                        </div>
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                          {formatTimestamp(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              {showNewMessage && !selectedConversation && (
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                />
              )}
              <div className="flex space-x-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  rows={2}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 bg-white"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isSending}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  {isSending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <FaPaperPlane />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                📧 Email notifications will be sent to both parties
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FaComments className="mx-auto h-12 w-12 mb-4 text-gray-300" />
              <p>Select a conversation to view messages</p>
              {!isAdmin && (
                <button
                  onClick={() => setShowNewMessage(true)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Start New Message
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}